export interface Vehicle {
  id?: number;
  name: string;
  model: string;
  image: string;
  capacity: number;
  price: number;
  originalPrice: number;
  registrationNumber: string; // ✅ added
  vendorId?: number | null;
  driverId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
