const { Client } = require('pg');

// Test the exact connection string
const connectionString = 'postgresql://postgres.hmsloyfnwrgirtuwjqjr:Bochra22@2003@aws-1-eu-north-1.pooler.supabase.com:5432/postgres';

async function testConnection() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Testing connection to Supabase...');
    await client.connect();
    console.log('✅ Connection successful!');
    
    const result = await client.query('SELECT version()');
    console.log('✅ Database version:', result.rows[0].version);
    
    await client.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
