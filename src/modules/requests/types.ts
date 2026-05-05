export interface IRequest {
  id: string;
  code: string;
  type: string;
  status: string;
  requesterName: string;
  email: string;
  phone: string;
  contactChannel: string;
  location: string;
  handoverMethod: string;
  beneficiaryAgeGroup?: string;
  beneficiaryGender?: string;
  orgName?: string;
  beneficiaryCount?: string;
  assignedVolunteer?: string;
  assignedTimeBlockId?: string;
  contactStatus: string;
  lastContacted?: string;
  internalNotes?: string;
  declineReason?: string;
  items?: IRequestItem[];
  createdAt: string;
  updatedAt: string;
}

export interface IRequestItem {
  id: string;
  requestId: string;
  stockItemId: string;
  quantity: number;
}

export interface ICreateRequest {
  type: string;
  requesterName: string;
  email: string;
  phone: string;
  contactChannel: string;
  location: string;
  handoverMethod: string;
  beneficiaryAgeGroup?: string;
  beneficiaryGender?: string;
  orgName?: string;
  beneficiaryCount?: string;
  items: { stockItemId: string; quantity: number }[];
}

export interface IUpdateRequestStatus {
  status: string;
  declineReason?: string;
}

export interface IUpdateRequestAdmin {
  contactStatus?: string;
  internalNotes?: string;
  assignedVolunteer?: string;
  assignedTimeBlockId?: string;
}

export interface IRequestFilter {
  status?: string;
  type?: string;
  handoverMethod?: string;
  search?: string;
}
