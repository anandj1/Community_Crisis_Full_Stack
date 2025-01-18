export * from './crisis';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Resource {
  id: string;
  name: string;
  type: 'shelter' | 'supplies' | 'medical' | 'other';
  quantity: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'available' | 'limited' | 'unavailable';
}