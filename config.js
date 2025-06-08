import path from 'node:path';


export const PORT = 3000;
export const DATA_DIR = path.resolve('./data');
export const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');
export const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');