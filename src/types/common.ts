export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}