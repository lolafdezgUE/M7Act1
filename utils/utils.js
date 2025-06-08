import { promises as fs } from 'fs';

import path from 'path';

export const writeJsonFile = async (filePath, data) => {
    const dir = path.dirname(filePath);
    try {
        await fs.access(dir);
    } catch (error) {
        await fs.mkdir(dir, { recursive: true });
    }
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

export const readJsonFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error al leer el archivo JSON: ${filePath} - ${error.message}`);
    }
};
