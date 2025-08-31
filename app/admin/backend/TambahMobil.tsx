import React, { useState, useEffect } from 'react';
import { FaCar, FaTimes } from 'react-icons/fa';

interface CarData {
  name: string;
  type: 'SUV' | 'MPV' | 'Sedan' | 'Hatchback';
  price: number;
  transmisi: 'Manual' | 'Automatic' | 'CVT';
  bahanBakar: 'Bensin' | 'Solar' | 'Hybrid' | 'Electric';
  pintu: number;
  airConditioner: 'Ada' | 'Tidak Ada';
  seats: number;
  description: string;
  status: 'available' | 'rented' | 'maintenance';
  mainImage: File | null;
}

interface AddCarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCar: (car: CarData) => void;
}

const TambahMobil: React.FC<AddCarProps> = ({ isOpen, onClose, onAddCar }) => {
  const [carData, setCarData] = useState<CarData>({
    name: '',
    type: 'SUV',
    price: 0,
    transmisi: 'Manual',
    bahanBakar: 'Bensin',
    pintu: 0,
    airConditioner: 'Ada',
    seats: 0,
    description: '',
    status: 'available',
    mainImage: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [priceInput, setPriceInput] = useState<string>('');

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const parseCurrency = (value: string): number => {
    const cleanValue = value.replace(/[^\d]/g, '');
    return cleanValue === '' ? 0 : parseInt(cleanValue, 10);
  };

  useEffect(() => {
    if (isOpen) {
      setCarData({
        name: '',
        type: 'SUV',
        price: 0,
        transmisi: 'Manual',
        bahanBakar: 'Bensin',
        pintu: 0,
        airConditioner: 'Ada',
        seats: 0,
        description: '',
        status: 'available',
        mainImage: null,
      });
      setPriceInput('');
      setPreviewImage(null);
      setFileName('');
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'pintu' || name === 'seats') {
      setCarData(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setCarData(prev => ({ ...prev, [name]: value }));
    }
  };

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
      setCarData(prev => ({ ...prev, mainImage: file }));
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
    if (!carData.mainImage) {
      alert('Harap upload gambar utama mobil');
      return;
    }
    const formData = new FormData();
    formData.append('name', carData.name);
    formData.append('type', carData.type);
    formData.append('price', carData.price.toString());
    formData.append('transmisi', carData.transmisi);
    formData.append('bahanBakar', carData.bahanBakar);
    formData.append('pintu', carData.pintu.toString());
    formData.append('airConditioner', carData.airConditioner);
    formData.append('seats', carData.seats.toString());
    formData.append('description', carData.description);
    formData.append('status', carData.status);
    if (carData.mainImage) {
      formData.append('mainImage', carData.mainImage);
    }
    try {
      const response = await fetch('http://localhost:5000/add-car', {
        method: 'POST',
        body: formData,
      });
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      if (!response.ok || !result.success) {
        const errorMsg = result.message || result.error || 'Terjadi kesalahan pada server';
        console.error('Gagal menambah mobil:', result);
        alert(`Gagal menambah mobil: ${errorMsg}`);
        return;
      }
      alert('Data mobil berhasil ditambahkan!');
      onClose();
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'Terjadi kesalahan saat mengirim data'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
              <FaCar className="text-xl text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Tambah Unit Mobil</h3>
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
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="pintu"
                  value={carData.pintu === 0 ? '' : carData.pintu}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setCarData(prev => ({ ...prev, pintu: val === '' ? 0 : Number(val) }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  placeholder="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Jumlah Kursi</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="seats"
                  value={carData.seats === 0 ? '' : carData.seats}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setCarData(prev => ({ ...prev, seats: val === '' ? 0 : Number(val) }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-colors"
                  placeholder="7"
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
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="object-contain w-full h-full rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <svg
                        className="w-8 h-8 mb-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
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
                    required
                  />
                </label>
                
                {previewImage && (
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
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Tambah Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahMobil;
