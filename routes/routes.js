
import getRoomsList from '../controllers/rooms.js';
import { getReservationsList, reserveRoom, cancelReservation } from '../controllers/reservations.js';

export async function router(req, res){
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log(`Recibida una solicitud: ${req.method} ${url.pathname}`);

    if(req.method === 'GET' && url.pathname === '/rooms'){
        await getRoomsList(res);
    }
    else if (req.method === 'GET' && url.pathname === '/reservations') {
        await getReservationsList(res);
    }
    else if (req.method === 'POST' && url.pathname === '/reservation'){
        await reserveRoom(req, res);
    }
    else if (req.method === 'DELETE' && url.pathname.startsWith('/reservation/')) {
        const id = url.pathname.split('/')[2];
        await cancelReservation(res, id);
    }
    else{
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('La ruta solicitada no existe\n');
    }

}