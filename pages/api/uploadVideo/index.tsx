import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const connection = mysql.createConnection({
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

    connection.connect(function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to connect to the database.' });
        }

        const {
            title,
            description,
            video_url,
            thumbnail_url,
            wallet_address,
        } = req.body;

        const id = uuidv4();

        connection.query(
            'INSERT INTO test.video_info (id, title, description, video_url, thumbnail_url, wallet_address) VALUES (?, ?, ?, ?, ?, ?)',
            [id, title, description, video_url, thumbnail_url, wallet_address],
            function (err, result) {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({ error: 'Failed to add data to the database.' });
                }

                connection.end();
                return res.status(200).json({ success: true });
            }
        );
    });
}
