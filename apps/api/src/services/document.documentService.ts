import prisma from "../prisma_client/client";
// import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";



interface SaveDocumentInput {
  type: string;
  filepath: string;
  userId: number;
  loanId: number;
}

export const documentService ={
  
 async  saveUploadedDocument(input:SaveDocumentInput) {
//     It does NOT upload file ❌
//     It ONLY saves record in DB
//     It saves:
//     document type (PAN)
//     Cloudinary URL
//     userId
//     loanId
//     status = UPLOADED
//     👉 Meaning:
//  “This document exists, and this is where it is stored.”


  const { type, filepath, userId, loanId } = input;

  return await prisma.document.create({
    data: {
      type,
      filepath,
      status: "UPLOADED",
      userId,
      loanId,
    },
  });
},



 async  generateSanctionLetter(loanId: number): Promise<Buffer> {
    
// This function ONLY generates PDF and returns the buffer
// Does NOT upload to Cloudinary
// Does NOT save to database
  // 1. Fetch loan + user + underwriting
  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    include: {
      user: true,
      underwriting: true,
      chat: true,
    },
  });

  if (!loan) throw new Error("Loan not found");
  if (!loan.underwriting || !loan.underwriting.approved)
    throw new Error("Loan not approved");
  if (!loan.user) throw new Error("User not found");

  const customerName = loan.user.name || "Valued Customer";
  
  // Get dates
  const approvalDate = loan.chat
    ? new Date(loan.chat.last_active_at).toLocaleDateString("en-IN")
    : new Date(loan.underwriting.created_at).toLocaleDateString("en-IN");
  
  const currentDate = new Date().toLocaleDateString("en-IN");
  const applicationDate = new Date(loan.created_at).toLocaleDateString("en-IN");

  // 2. Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #2563eb; }
        .header h1 { color: #2563eb; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .company-info { font-size: 12px; color: #666; }
        .date { text-align: right; margin-bottom: 30px; font-size: 14px; }
        .recipient { margin-bottom: 30px; }
        .recipient h3 { font-size: 16px; margin-bottom: 10px; }
        .recipient-details { line-height: 1.8; font-size: 14px; }
        .subject { margin: 30px 0; padding: 15px; background-color: #f3f4f6; border-left: 4px solid #2563eb; }
        .subject strong { font-size: 15px; }
        .content { margin: 30px 0; font-size: 14px; }
        .greeting { margin-bottom: 20px; font-weight: 500; }
        .loan-details { margin: 30px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .loan-details-header { background-color: #2563eb; color: white; padding: 12px 20px; font-weight: bold; font-size: 16px; }
        .loan-details-body { padding: 20px; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #4b5563; flex: 0 0 45%; }
        .detail-value { flex: 0 0 50%; text-align: right; color: #1f2937; }
        .highlight { background-color: #fef3c7; padding: 2px 6px; border-radius: 3px; font-weight: 600; }
        .terms { margin: 30px 0; }
        .terms h3 { font-size: 16px; margin-bottom: 15px; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
        .terms ol { margin-left: 20px; }
        .terms li { margin-bottom: 10px; font-size: 13px; line-height: 1.6; }
        .congratulations { margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; border-radius: 8px; font-size: 16px; font-weight: 600; }
        .footer-note { margin: 20px 0; text-align: center; font-size: 13px; color: #6b7280; font-style: italic; }
        .signature { margin-top: 60px; text-align: right; }
        .signature-line { border-top: 2px solid #333; width: 200px; margin: 0 0 10px auto; }
        .signature-text { font-size: 14px; font-weight: 600; }
        .signature-title { font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>LOAN SANCTION LETTER</h1>
        <div class="company-info">
          Your Finance Company Name<br>
          Registered Address | Contact: +91-XXXXXXXXXX | Email: info@company.com
        </div>
      </div>

      <div class="date"><strong>Date:</strong> ${currentDate}</div>

      <div class="recipient">
        <h3>To,</h3>
        <div class="recipient-details">
          <strong>${customerName}</strong><br>
          ${loan.user.email ? `Email: ${loan.user.email}<br>` : ""}
          ${loan.user.phone ? `Phone: ${loan.user.phone}<br>` : ""}
          ${loan.user.pan_number ? `PAN: ${loan.user.pan_number}<br>` : ""}
          ${loan.user.dob ? `Date of Birth: ${loan.user.dob}<br>` : ""}
        </div>
      </div>

      <div class="subject">
        <strong>Subject: Loan Sanction Approval - Loan ID #${loan.id}</strong>
      </div>

      <div class="content">
        <div class="greeting">Dear ${customerName},</div>
        <p>
          We are pleased to inform you that your loan application has been <span class="highlight">APPROVED</span> 
          after careful evaluation by our underwriting team. We appreciate your trust in our services.
        </p>
      </div>

      <div class="loan-details">
        <div class="loan-details-header">📋 Sanctioned Loan Details</div>
        <div class="loan-details-body">
          <div class="detail-row">
            <div class="detail-label">Loan Reference ID</div>
            <div class="detail-value">#${loan.id}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Loan Type</div>
            <div class="detail-value">${loan.type}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Sanctioned Amount</div>
            <div class="detail-value"><strong>₹ ${loan.amount.toLocaleString("en-IN")}</strong></div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Loan Tenure</div>
            <div class="detail-value">${loan.tenure_months} months</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Approval Score</div>
            <div class="detail-value">${loan.underwriting.score ? loan.underwriting.score.toFixed(2) : "N/A"}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Application Date</div>
            <div class="detail-value">${applicationDate}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Approval Date</div>
            <div class="detail-value">${approvalDate}</div>
          </div>
        </div>
      </div>

      <div class="terms">
        <h3>Terms & Conditions</h3>
        <ol>
          <li>This sanction letter is valid for <strong>30 days</strong> from the date of issue.</li>
          <li>The loan is subject to submission of all required documents and successful verification.</li>
          <li>Interest rates, processing fees, and other charges as per company policy will apply.</li>
          <li>The borrower must comply with all terms mentioned in the loan agreement.</li>
          <li>The company reserves the right to modify or cancel the sanction if any information provided is found to be incorrect.</li>
          <li>Disbursement will be made only after completion of all documentation and legal formalities.</li>
        </ol>
      </div>

      <div class="congratulations">🎉 Congratulations on Your Loan Approval! 🎉</div>

      <div class="footer-note">
        For any queries or assistance, please contact our customer support team.<br>
        We look forward to serving you.
      </div>

      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-text">Authorized Signatory</div>
        <div class="signature-title">Loan Approval Department</div>
      </div>
    </body>
    </html>
  `;

  // 3. Generate PDF with Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      right: "20mm",
      bottom: "20mm",
      left: "20mm",
    },
  });
  
  await browser.close();

  // 4. Return PDF buffer only
  return Buffer.from(pdfBuffer);
}
,



 async  saveGeneratedDocument(){

// After generation
// Upload generated PDF to Cloudinary
// Get URL
// Save record in DB
// Status = GENERATED



}
}