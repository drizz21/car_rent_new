import React, { useState, useEffect } from 'react';
import { FaCar, FaTimes, FaSpinner } from 'react-icons/fa';

interface CarData {
  id: number;
  name: string;
  type: 'SUV' | 'MPV' | 'Sedan' | 'Hatchback' | 'Minivan' | 'Pickup';
  price: number;
  transmisi: 'Manual' | 'Automatic' | 'CVT';
  bahanBakar: 'Bensin' | 'Solar' | 'Hybrid' | 'Electric';
  pintu: number;
  airConditioner: 'Ada' | 'Tidak Ada';
  seats: number;
  jumlahBBM: number;
  description: string;
  status: 'available' | 'rented' | 'maintenance';
  mainImage: string | null; // Base64 string
}

interface EditCarProps {
  isOpen: boolean;
  onClose: () => void;
  onCarUpdated: (updatedCar: CarData) => void;
  carId: number;
}

const EditCar: React.FC<EditCarProps> = ({ isOpen, onClose, onCarUpdated, carId }) => {
  const [carData, setCarData] = useState<CarData>({
    id: 0,
    name: '',
    type: 'SUV',
    price: 0,
    transmisi: 'Manual',
    bahanBakar: 'Bensin',
    pintu: 0,
    airConditioner: 'Ada',
    seats: 0,
    jumlahBBM: 0,
    description: '',
    status: 'available',
    mainImage: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [priceInput, setPriceInput] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi untuk memformat angka ke format mata uang Indonesia
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  // Fungsi untuk mengonversi string format mata uang ke number
  const parseCurrency = (value: string): number => {
    const cleanValue = value.replace(/[^\d]/g, '');
    return cleanValue === '' ? 0 : parseInt(cleanValue, 10);
  };

  // Mengambil data mobil saat komponen dibuka
  useEffect(() => {
    if (isOpen && carId) {
      const fetchCar = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5000/cars/${carId}`);
          
          if (!response.ok) {
            throw new Error('Gagal mengambil data mobil');
          }
          
          const car: CarData = await response.json();
          
          setCarData(car);
          setPriceInput(formatCurrency(car.price));
          
          if (car.mainImage) {
            setPreviewImage(`data:image/jpeg;base64,${car.mainImage}`);
          }
          
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
          setLoading(false);
        }
      };
      
      fetchCar();
    }
  }, [isOpen, carId]);

  // Reset form saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setCarData({
        id: 0,
        name: '',
        type: 'SUV',
        price: 0,
        transmisi: 'Manual',
        bahanBakar: 'Bensin',
        pintu: 0,
        airConditioner: 'Ada',
        seats: 0,
        jumlahBBM: 0,
        description: '',
        status: 'available',
        mainImage: null,
      });
      setPriceInput('');
      setPreviewImage(null);
      setFileName('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'pintu' || name === 'seats') {
      setCarData(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else if (name === 'jumlahBBM') {
      setCarData(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setCarData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Penangan khusus untuk input harga
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceInput(value);
    
    const parsedValue = parseCurrency(value);
    setCarData(prev => ({ ...prev, price: parsedValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*')) {
        alert('Hanya file gambar yang diperbolehkan (PNG, JPG)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      setCarData(prev => ({ ...prev, mainImage: null }));
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', carData.name);
    formData.append('type', carData.type);
    formData.append('price', carData.price.toString());
    formData.append('transmisi', carData.transmisi);
    formData.append('bahanBakar', carData.bahanBakar);
    formData.append('pintu', carData.pintu.toString());
    formData.append('airConditioner', carData.airConditioner);
    formData.append('seats', carData.seats.toString());
    formData.append('jumlahBBM', carData.jumlahBBM.toString());
    formData.append('description', carData.description);
    formData.append('status', carData.status);
    
    // Jika ada gambar baru (previewImage ada dan bukan base64 string)
    if (previewImage && previewImage.startsWith('data:image')) {
      // Konversi base64 ke Blob
      const blob = await fetch(previewImage).then(res => res.blob());
      formData.append('mainImage', blob, fileName || 'car-image.jpg');
    }

    try {
              const response = await fetch(`http://localhost:5000/cars/${carId}`, {
        method: 'PUT',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Terjadi kesalahan pada server');
      }

      alert('Data mobil berhasil diupdate!');
      
      // Panggil callback untuk update data di parent component
      onCarUpdated({
        ...carData,
        mainImage: previewImage ? previewImage.replace('data:image/jpeg;base64,', '') : carData.mainImage
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'Terjadi kesalahan saat mengirim data'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 text-center">
            <FaSpinner className="animate-spin mx-auto text-blue-600 text-2xl mb-4" />
            <p>Memuat data mobil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
              <FaCar className="text-xl text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Unit Mobil</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Informasi Dasar
            </h4>

            {/* Name and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Nama Mobil</label>
                <input
                  type="text"
                  name="name"
                  value={carData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  placeholder="Contoh: Toyota Avanza"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Tipe Mobil</label>
                <select
                  name="type"
                  value={carData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  required
                >
                  <option value="SUV">SUV</option>
                  <option value="MPV">MPV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Minivan">Minivan</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Harga Sewa (per hari)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 text-sm">Rp</span>
                <input
                  type="text"
                  name="price"
                  value={priceInput}
                  onChange={handlePriceChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  placeholder="300.000"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Harga: Rp{formatCurrency(carData.price)}
              </p>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Spesifikasi
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Transmisi</label>
                <select
                  name="transmisi"
                  value={carData.transmisi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  required
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Bahan Bakar</label>
                <select
                  name="bahanBakar"
                  value={carData.bahanBakar}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  required
                >
                  <option value="Bensin">Bensin</option>
                  <option value="Solar">Solar</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Jumlah Pintu</label>
                <input
                  type="number"
                  name="pintu"
                  value={carData.pintu}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  placeholder="4"
                  min="2"
                  max="6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Jumlah Kursi</label>
                <input
                  type="number"
                  name="seats"
                  value={carData.seats}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  placeholder="7"
                  min="2"
                  max="8"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">AC</label>
                <select
                  name="airConditioner"
                  value={carData.airConditioner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  required
                >
                  <option value="Ada">Ada</option>
                  <option value="Tidak Ada">Tidak Ada</option>
                </select>
              </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Jumlah BBM saat ini</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  name="jumlahBBM"
                  value={carData.jumlahBBM}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  placeholder="20"
                  min="0"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-500 text-sm">/Liter</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Deskripsi</h4>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Deskripsi Mobil</label>
              <textarea
                name="description"
                value={carData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors resize-none"
                placeholder="Deskripsi singkat tentang kondisi dan fitur mobil..."
                required
              />
            </div>
          </div>

          {/* Image Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Gambar Mobil</h4>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Gambar Utama</label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-contain p-2"
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {fileName || 'Gambar saat ini'}
                      </div>
                    </div>
                  ) : carData.mainImage ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={`data:image/png;base64,${carData.mainImage}`} 
                        alt="Current" 
                        className="w-full h-full object-contain p-2"
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        Gambar saat ini
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                
                {(previewImage || carData.mainImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setFileName('');
                      setCarData(prev => ({ ...prev, mainImage: null }));
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Status</h4>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Status Unit</label>
              <select
                name="status"
                value={carData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                required
              >
                <option value="available">Tersedia</option>
                <option value="rented">Disewa</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Menyimpan...
                </span>
              ) : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCar;