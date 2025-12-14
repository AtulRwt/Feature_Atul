import { client as prisma } from "@repo/db";
import axios from "axios";
//libraries:
//axios
//csv-parser install kiya h
//fs=file system, It is a built-in Node.js module that lets your code read, write, update, and delete files on your computer or server.

import path from "path";
import fs from "fs";
import csv from "csv-parser";


//common functions:
async function getDocumentFromDB(loanId:number, type: string){
    const doc = await prisma.document.findFirst({
        where: {loanId, type}
    });

    if(!doc){
        throw new Error(`${type} document not found`);
    }

    return doc;
}

// cloudinary storage has a  public url for now:
async function getDocumentFromCloudinary(
    url: string
):Promise<Buffer>{
    const response = await axios.get(url,{
        responseType: "arraybuffer",
    });
    return Buffer.from(response.data);
}

//for images only(adhaar pan salary slip maybe):
async function runOCR(filepath: string): Promise<string>{

    try{
    //download document from cloudinary.
    const fileBuffer = await getDocumentFromCloudinary(filepath);

    // 2. Convert to base64
    const base64 = fileBuffer.toString('base64')

    //ocr api:
    const ocrRes = await axios.post(
    'https://api.ocr.space/parse/image',
    new URLSearchParams({
        base64Image: `data:image/png;base64,${base64}`,
        language: 'eng',
    }),
    {
      headers: {
        apikey: process.env.OCR_API_KEY as string,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

    // 4. Return extracted text
    return ocrRes.data?.ParsedResults?.[0]?.ParsedText ?? ''
    }catch(err){
        console.log("OCR failed: ", err);
        return "";

    }

    //dummy data for now:
    // return `
    //     adhaar: 123456789120
    //     pan: ABCDE1234F
    //     name: preeti negi
    //     dob: 1975-08-12
    //     father: xyz negi
    // `
}

function extractField(text: string, regex: RegExp): string | null {
  const match = text.match(regex);
  return match && match[1] ? match[1].trim() : null;
}


//User extractor functions:
async function extractPAN(filepath: string) {
    
    const text = await runOCR(filepath);

    //can't check status of pan if active for now

    const pan =
    text.match(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/)?.[0] ?? null;

    const name =
    extractField(text, /Name\s*:?\s*(.+)/i);

    const dob =
    text.match(/(?:Date\s*of\s*Birth|DOB)\s*:?\s*(.+)/i)
      ?.[1]
      ?.trim() ?? null;

    const father =
    text.match(/Father(?:'s)?\s*Name\s*:?\s*(.+)/i)
      ?.[1]
      ?.trim() ?? null;

    return {pan, name, dob, father};
    //dummy data:
    // return {
    //     pan: "ABCDE1234F",
    //     name: "preeti negi",
    //     dob: "1975-08-12",
    //     father: "xyz negi",
    //     status: "ACTIVE"
    // }
    
}

async function extractAadhaar(filepath:string){
    const text = await runOCR(filepath);

    const aadhaar = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/)?.[0]?.replace(/\s+/g, '') ?? null;

    const name = extractField(text, /Name\s*:?\s*(.+)/i);

    //aadhaar me dus prakaar/formats se likha h dob
    const dob =
    text.match(
        /(?:Date\s*of\s*Birth|DOB|Year\s*of\s*Birth|YOB)\s*:?\s*([0-9]{2}[\/\-\.][0-9]{2}[\/\-\.][0-9]{4}|[0-9]{4})/i
    )
        ?.[1]
        ?.trim() ?? null;

    //gender bhi kr skte h:

    return {aadhaar, name, dob};

}

async function extractSalarySlip(){
    
}

async function extractBankStatement(){
    
}

//verifyPan -helper
//csv file must have a pan column:
async function panExistsinCSV(pan:string, csvFilePath:string):Promise<boolean>{
    return new Promise((resolve, reject)=>{
        let found = false;

        fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on(`data`, (row:{pan?: string})=>{
            if(row.pan?.trim().toUpperCase()===pan.trim().toUpperCase()){
                found = true;
            }
        })
        .on(`end`, ()=> resolve(found))
        .on(`error`, reject);
    });
}


//User verification functions:

export async function verifyPAN(loanId:number){
    //delete previous results:
    await prisma.verificationResult.deleteMany({
    where: { loanId, type: "PAN" }
    });

    //fetch document
    const doc = await getDocumentFromDB(loanId, "PAN");

    //extract info
    const extracted = await extractPAN(doc.filepath);

    let status: string= "VERIFIED";

    //check blurry  pan:
    if (!extracted.pan || !extracted.name|| !extracted.dob) {
    status= "REUPLOAD_REQUIRED";
    const result = await prisma.verificationResult.create({
        data:{
            loanId,
            type: "PAN",
            status,
            result:{
                //nothing to save
            }
        }
     });
    return result;
    }

    //verify whether they are original or not from a csv file for now.
    const csvPathPan = path.join(__dirname, "../../data/original_pans.csv");

    const panExists = await panExistsinCSV(
        extracted.pan,
        csvPathPan
    );

    if(!panExists){
        status="REJECTED"
        const result = await prisma.verificationResult.create({
        data:{
            loanId,
            type: "PAN",
            status,
            result:{
                //nothing to save
            }
        }
     });
    return result;    
    }

    //fetch user:
    const user = await prisma.user.findUnique({
        where: {id: doc.userId}
    });

    if(!user) throw new Error ("user not found");

    //checks:

    //ptaani yr kyu kr rahi hu m//safety check maybe agr pan trace nhi hua.
    const panFormatValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(extracted.pan);

    const nameMatch = extracted.name?.toLowerCase() === user.name?.toLowerCase();//abhi model me nahi h
    const dobMatch = extracted.dob == user.dob;//abhi model me nahi h

    //duplicate pan check:
    const duplicatePan = await prisma.user.findFirst({
        where:{
            pan_number: extracted.pan,
            id: {not: user.id}//if someone else has same pan
        }
    });

    //check blacklisted pan:


    //decision:
    if(!panFormatValid||!nameMatch || !dobMatch){
        status = "REUPLOAD_REQUIRED";
    }
    else if(duplicatePan){
        status = "ON_HOLD" //so that admin can act accordingly
    }

    //saving verfication result:
     const result = await prisma.verificationResult.create({
        data:{
            loanId,
            type: "PAN",
            status,
            result:{
                pan:extracted.pan,
                panFormatValid: panFormatValid,
                panActive: true,//can't check if pan is active
                nameMatch: nameMatch,
                dobMatch: dobMatch,
                fatherName: extracted.father,
                duplicatePan: !!duplicatePan,//forcing it to be boolean
                blacklistedPan: false //for now
            }
        }
    });
    return result;
}


//csv file must have a aadhaar column:
async function aadhaarExistsinCSV(aadhaar:string, csvFilePath:string):Promise<boolean>{
    return new Promise((resolve, reject)=>{
        let found = false;

        fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on(`data`, (row:{aadhaar?: string})=>{
            if(row.aadhaar?.trim()===aadhaar.trim()){
                found = true;
            }
        })
        .on(`end`, ()=> resolve(found))
        .on(`error`, reject);
    });
}

export async function verifyAdhaar(loanId: number){
    //delete previous results:
    await prisma.verificationResult.deleteMany({
    where: { loanId, type: "AADHAAR" }
    });


    //fetch document
    const doc = await getDocumentFromDB(loanId, "AADHAAR");

    //extract info
    const extracted = await extractAadhaar(doc.filepath);

    let status: string= "VERIFIED"; 

    //check blurry aadhaar:
    if (!extracted.aadhaar || !extracted.name|| !extracted.dob) {
    status= "REUPLOAD_REQUIRED";
    const result = await prisma.verificationResult.create({
        data:{
            loanId,
            type: "AADHAAR",
            status,
            result:{
                reason: "Blurry Image"
                //nothing to save
            }
        }
     });
    return result;
    };

    //verify whether they are original or not from a csv file for now.
    const csvPathAdhaar = path.join(__dirname, "original_aadhaars.csv");

    const aadhaarExists = await aadhaarExistsinCSV(
        extracted.aadhaar,
        csvPathAdhaar
    );

    if(!aadhaarExists){
        status="REJECTED";
        const result = await prisma.verificationResult.create({
        data:{
            loanId,
            type: "AADHAAR",
            status,
            result:{
                reason: "INVALID AADHAAR"
                //nothing to save
            }
        }
     });
    return result;
    }


    //fetch user:
    const user = await prisma.user.findUnique({
        where: {id: doc.userId}
    });

    if(!user) throw new Error ("user not found");

    //checks:
    const aadhaarFormatValid = /^[0-9]{12}$/.test(extracted.aadhaar);
    const nameMatch = extracted.name?.toLowerCase() === user.name?.toLowerCase();//abhi model me nahi h
    const dobMatch = extracted.dob == user.dob;//abhi model me nahi h

    //decision:
    if(!aadhaarFormatValid||!nameMatch ||!dobMatch){
        status = "REUPLOAD_REQUIRED";
    }
    const result = await prisma.verificationResult.create({
        data:{
            loanId,
            type: "AADHAAR",
            status,
            result:{
                aadhaarFormatValid: aadhaarFormatValid,
                nameMatch: nameMatch,
                dobMatch: dobMatch,
            }
        }
    });
    
    if(status=="VERIFIED"){
        const aadhaarLast4 = extracted.aadhaar.slice(-4);
        await prisma.user.update({
            where: {id: user.id},
            data:{
                aadhaar_last_4: aadhaarLast4,
                aadhaar_verified: true
            }
        });
    };

    return result;

}

export async function verifySalarySlip(){

}

export async function verifyBankStatemnt(){

}


export async function emailVerification(){

}

export async function phoneVerification(){

}

export async function cibilVerification(){
//idk how yet
}

export async function EmployerVerification(){
//not now
}


//verification status:

export async function verificationStatus(loanId:number){

}


//Admin functions:

export async function verifyPendingsList(){

}

export async function verificationSummaryList() {
    
}

export async function verficationStatus(){

}

export async function verificationOverride(){

}

export async function viewUserDocument(){

}

//also verifies employment status and salary slip via contacting employer.
export async function verifyEmployer() {
    //checks if employer verification is done from db
}