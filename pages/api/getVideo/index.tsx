import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_DB_HOST,
      port: 4000,
      user: process.env.NEXT_PUBLIC_DB_USER,
      password: process.env.NEXT_PUBLIC_DB_PASSWORD,
      database: process.env.NEXT_PUBLIC_DB_NAME,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
      connectAttributes: {
        program_name: 'pingcap/serverless-test',
      },
    });

    const [rows] = await connection.query(`SELECT * FROM test.video_info;`);
    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from the database.' });
  }
}
