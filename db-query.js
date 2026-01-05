const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '980722',
  database: 'postgres',
});

// Pegar argumentos da linha de comando
const args = process.argv.slice(2);
const command = args[0];

async function run() {
  const client = await pool.connect();
  try {
    if (command === 'update-business') {
      // Parâmetros: node db-query.js update-business <user_id> <business_name> <slug> <phone> <address>
      const userId = args[1] || 2;
      const businessName = args[2] || 'Minha Empresa';
      const slug = args[3] || 'minha-empresa';
      const phone = args[4] || '';
      const address = args[5] || '';

      await client.query(`
        UPDATE agendamais.users
        SET business_name = $1,
            slug = $2,
            business_phone = $3,
            business_address = $4,
            online_booking_enabled = true
        WHERE id = $5;
      `, [businessName, slug, phone, address, userId]);

      console.log('Dados atualizados com sucesso!');

      const updated = await client.query(`
        SELECT id, name, slug, business_name, business_phone, business_address, online_booking_enabled
        FROM agendamais.users WHERE id = $1;
      `, [userId]);
      console.log('Usuário:', updated.rows[0]);

    } else {
      // Listar usuários
      const users = await client.query(`
        SELECT id, name, email, slug, business_name, business_phone, business_address, online_booking_enabled
        FROM agendamais.users;
      `);
      console.log('=== USUÁRIOS ===');
      users.rows.forEach(r => {
        console.log(`ID: ${r.id}`);
        console.log(`  Nome: ${r.name}`);
        console.log(`  Email: ${r.email}`);
        console.log(`  Slug: ${r.slug}`);
        console.log(`  Empresa: ${r.business_name}`);
        console.log(`  Telefone: ${r.business_phone}`);
        console.log(`  Endereço: ${r.business_address}`);
        console.log(`  Booking Online: ${r.online_booking_enabled}`);
        console.log('---');
      });
    }

  } finally {
    client.release();
    pool.end();
  }
}

run().catch(console.error);
