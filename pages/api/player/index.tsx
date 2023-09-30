import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: 4000,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
      connectAttributes: {
        program_name: 'pingcap/serverless-test',
      },
    });

    const [rows] = await connection.query('SELECT * FROM test.video_info WHERE id = ?;', [id]);

    await connection.end();

    if (rows.length === 0) {
      res.status(404).json({ error: 'Video not found' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from the database.' });
  }
}