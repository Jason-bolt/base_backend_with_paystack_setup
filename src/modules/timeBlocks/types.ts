export interface ITimeBlock {
  id: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  locationZone?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTimeBlock {
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  locationZone?: string;
}

export interface IUpdateTimeBlock {
  date?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  locationZone?: string;
  status?: string;
}
