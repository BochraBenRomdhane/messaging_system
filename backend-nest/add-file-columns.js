const { Sequelize } = require('sequelize');

// Database configuration - adjust these values based on your setup
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'chatify',
  logging: console.log
});

async function addFileColumns() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully');

    // Add the missing columns to the messages table
    await sequelize.query(`
      ALTER TABLE "messages" 
      ADD COLUMN IF NOT EXISTS "fileName" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "fileType" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "fileData" TEXT;
    `);

    console.log('File columns added successfully to messages table');
    
    // Verify the columns were added
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'messages' 
      AND column_name IN ('fileName', 'fileType', 'fileData');
    `);
    
    console.log('Added columns:', results);
    
  } catch (error) {
    console.error('Error adding file columns:', error);
  } finally {
    await sequelize.close();
  }
}

addFileColumns();
