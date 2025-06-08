import http from 'http';
import { PORT, ROOMS_FILE } from './config.js';
import { writeJsonFile } from './utils/utils.js'; 
import { router } from './routes/routes.js';

async function main() {
    await writeJsonFile(ROOMS_FILE, [
        { "id": 1, "name": "Sala Madrid", "maxCapacity": 20 },
        { "id": 2, "name": "Sala Barcelona", "maxCapacity": 15 },
        { "id": 3, "name": "Sala Sevilla", "maxCapacity": 10 },
        { "id": 4, "name": "Sala Valencia", "maxCapacity": 25 },
        { "id": 5, "name": "Sala Bilbao", "maxCapacity": 12 },
        { "id": 6, "name": "Sala Granada", "maxCapacity": 8 },
        { "id": 7, "name": "Sala Málaga", "maxCapacity": 18 },
        { "id": 8, "name": "Sala Zaragoza", "maxCapacity": 14 },
        { "id": 9, "name": "Sala Salamanca", "maxCapacity": 16 },
        { "id": 10, "name": "Sala Alicante", "maxCapacity": 22 }
    ]);

    http.createServer( async (req, res) => {
        try{
            await router(req, res);
        }catch (error) {
            console.error(`Error al procesar la solicitud: ${error.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor\n');
            return
        }
    }).listen(PORT, () => {
    console.log(`El servidor está corriendo en http://localhost:${PORT}/`);
    });
}

main();




