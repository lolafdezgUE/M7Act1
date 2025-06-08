import { readJsonFile, writeJsonFile } from "../utils/utils.js"; 
import { ROOMS_FILE, RESERVATIONS_FILE } from '../config.js';
import { randomUUID } from 'crypto';

export async function getReservationsList(res) {
    try {
        const data = await readJsonFile(RESERVATIONS_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } catch (error) {
        console.error(`Error al procesar la petición: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor\n');
    }
}

export async function reserveRoom(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        try {
            req.body = JSON.parse(body);
            const { user, room, date, hourStart, hourEnd, persons } = req.body;
            if(!user || !room || !date || !hourStart || !hourEnd || !persons) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Envie toda la información necesaria para realizar la reserva\n');
                return;
            } else {
                const rooms = await readJsonFile(ROOMS_FILE);
                const roomExists = rooms.some(r => r.id === room);
                if (!roomExists) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end(`La sala ${room} no existe\n`);
                    return;
                }

                const roomCapacity = rooms.find(r => r.id === room)?.maxCapacity;
                if (roomCapacity < persons) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('La sala no tiene capacidad suficiente para el número de personas\n');
                    return;
                }

                if (hourStart >= hourEnd) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('La hora de inicio debe ser anterior a la hora de fin\n');
                    return;
                }

                const reservations = await readJsonFile(RESERVATIONS_FILE);

                const dateReservations = reservations.filter(r => r.room === room && r.date === date);
                if(dateReservations.length > 0) {
                    const bussyRoom = dateReservations.find(r => (hourStart < r.hourEnd && hourEnd > r.hourStart))
                    if(bussyRoom) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end(`La sala ${room} está reservada el día ${date} de ${bussyRoom.hourStart} a ${bussyRoom.hourEnd}\n`);
                        return;
                    }
                }

                const newReservation = {
                    id: randomUUID(),
                    user,
                    room,
                    date,
                    hourStart,
                    hourEnd,
                    persons
                };
                reservations.push(newReservation);
                    await writeJsonFile(RESERVATIONS_FILE, reservations);
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newReservation));
                    return;

            }
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Cuerpo de la petición inválido\n');
        }
    });
}


export async function cancelReservation(res, id) {
    if (!id) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Debe indicar el identificador de la reserva para cancelar\n');
        return;
    }
    const reservations = await readJsonFile(RESERVATIONS_FILE);
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Reserva no encontrada\n');
        return;
    }
    const updatedReservations = reservations.filter(r => r.id !== id);
    await writeJsonFile(RESERVATIONS_FILE, updatedReservations);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Reserva cancelada\n');
}