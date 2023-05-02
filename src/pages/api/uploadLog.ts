import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Logs are a bit bigger than the default 1mb limit.
        }
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const logNumber = fs.readdirSync('./src/data/logs').length;
        fs.writeFileSync(`./src/data/logs/log${logNumber}.txt`, req.body);
        res.status(200).json({ message: `log${logNumber}` });
    } catch (err) {
        res.status(500).json({ message: err });
    };
};