export interface IContribution {
  id: string;
  code: string;
  category: string;
  status: string;
  donorName: string;
  email: string;
  phone: string;
  contactChannel: string;
  location: string;
  handoverMethod: string;
  assignedTimeBlockId?: string;
  internalNotes?: string;
  items?: IContributionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface IContributionItem {
  id: string;
  contributionId: string;
  type: string;
  quantity: number;
  condition: string;
  photos: string[];
  details?: Record<string, string>;
}

export interface ICreateContribution {
  category: string;
  donorName: string;
  email: string;
  phone: string;
  contactChannel: string;
  location: string;
  handoverMethod: string;
  items: {
    type: string;
    quantity: number;
    condition: string;
    photos?: string[];
    details?: Record<string, string>;
  }[];
}

export interface IUpdateContributionStatus {
  status: string;
}

export interface IUpdateContributionAdmin {
  contactStatus?: string;
  internalNotes?: string;
  assignedTimeBlockId?: string;
}

export interface IApproveContributionItem {
  itemId: string;
  title?: string;
  category?: string;
  clothingType?: string;
  clothingAgeGroup?: string;
  genderFit?: string;
  bookType?: string;
  educationLevel?: string;
  subject?: string;
}
