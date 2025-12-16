-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "tenure_months" DROP NOT NULL,
ALTER COLUMN "monthlyincome" DROP NOT NULL;
