-- SQL script to add file columns to the messages table
-- Run this in your PostgreSQL database

ALTER TABLE "messages" 
ADD COLUMN IF NOT EXISTS "fileName" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "fileType" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "fileData" TEXT;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'messages' 
AND column_name IN ('fileName', 'fileType', 'fileData');
