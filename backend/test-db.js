const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Testando conexão com Neon...');
console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000, // 30 segundos
  keepAlive: true,
});

async function testConnection() {
  try {
    console.log('📡 Tentando conectar...');
    const client = await pool.connect();
    console.log('✅ Conectado com sucesso!');
    
    const result = await client.query('SELECT NOW()');
    console.log('📅 Data/Hora do servidor:', result.rows[0]);
    
    client.release();
    await pool.end();
    console.log('✅ Teste concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    console.error('📝 Código do erro:', error.code);
    
    // Sugestões baseadas no erro
    if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 Sugestões:');
      console.log('1. Verifique se o projeto Neon está ativo (não suspenso)');
      console.log('2. Tente usar o endpoint de pooling: adicione ?pool_timeout=20 à URL');
      console.log('3. Verifique suas configurações de firewall');
      console.log('4. Tente usar o IP do endpoint diretamente');
    }
  }
}

testConnection();