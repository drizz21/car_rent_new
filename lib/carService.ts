// lib/carService.js
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'cars.json');

export function getAllCars() {
  if (!fs.existsSync(filePath)) return [];
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileData || '[]');
}

export function saveCars(cars: any) {
  fs.writeFileSync(filePath, JSON.stringify(cars, null, 2));
}
