'use client';

import { useState, useEffect } from 'react';

interface Car {
  id: number;
  name: string;
  type: string;
  price: number;
  status: string;
}

export default function TestCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCars(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Cars API</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Total cars: {cars.length}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{car.name}</h3>
              <p className="text-gray-600 mb-2">ID: {car.id}</p>
              <p className="text-gray-600 mb-2">Type: {car.type}</p>
              <p className="text-gray-600 mb-2">Price: Rp {car.price.toLocaleString()}</p>
              <p className="text-gray-600 mb-4">Status: {car.status}</p>
              <a 
                href={`/detail/${car.id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                View Detail
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Available IDs:</h3>
          <p className="text-yellow-700">
            {cars.map(car => car.id).join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
