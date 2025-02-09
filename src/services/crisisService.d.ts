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

export interface Crisis {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
  reportedBy: string;
  media?: CrisisMedia[];
}

export interface CrisisFormData {
  title: string;
  description: string;
  severity: Severity;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  media?: File[];
}
export interface CrisisService {
  reportCrisis(data: CrisisFormData): Promise<Crisis>;
  getAllCrises(filters?: CrisisFilters): Promise<Crisis[]>;
  getMyCrises(): Promise<Crisis[]>;
  updateStatus(crisisId: string, status: Crisis['status']): Promise<Crisis>;
}

declare const crisisService: CrisisService;
export { crisisService };