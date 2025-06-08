
import { ROOMS_FILE } from "../config.js";
import { readJsonFile } from "../utils/utils.js";

export default async function getRoomsList(res){
    try {
        const data = await readJsonFile(ROOMS_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } catch (error) {
        console.error(`Error al procesar la petición: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor\n');
    }
}