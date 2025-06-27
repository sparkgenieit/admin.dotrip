export interface Driver {
  id?: number;
  email?:string,
  password?:string,
  name: string;
  phone?: string;
  license: string;
  userId: number;
  vendorId: number;
  vehicleId?: number;
  user?:any;
}

export interface Vehicle {
  id: number;
  name: string;
  model: string;
  vendorId?: number;
  driverId?: number;
}