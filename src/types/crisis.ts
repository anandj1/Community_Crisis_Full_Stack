export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'reported' | 'inProgress' | 'resolved';

export interface CrisisMedia {
  type: 'image' | 'video';
  url: string;
  secure_url?: string;
  public_id: string;
  width?: number;
  height?: number;
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface CrisisFormData {
  title: string;
  description: string;
  severity: Severity;
  location: Location;
  media?: File[];
}

export interface Crisis {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  location: Location;
  createdAt: string;
  updatedAt: string;
  reportedBy: string;
  media?: CrisisMedia[];
}