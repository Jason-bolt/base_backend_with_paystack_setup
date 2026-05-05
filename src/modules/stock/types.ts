export interface IStockItem {
  id: string;
  category: string;
  title: string;
  description?: string;
  condition: string;
  quantity: number;
  availability: string;
  visibility: string;
  locationBucket?: string;
  clothingType?: string;
  clothingAgeGroup?: string;
  genderFit?: string;
  bookType?: string;
  educationLevel?: string;
  subject?: string;
  photos: string[];
  source: string;
  contributionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateStockItem {
  category: string;
  title: string;
  description?: string;
  condition: string;
  quantity: number;
  visibility?: string;
  locationBucket?: string;
  clothingType?: string;
  clothingAgeGroup?: string;
  genderFit?: string;
  bookType?: string;
  educationLevel?: string;
  subject?: string;
  photos?: string[];
  source?: string;
  contributionId?: string;
}

export interface IUpdateStockItem {
  title?: string;
  description?: string;
  condition?: string;
  quantity?: number;
  availability?: string;
  visibility?: string;
  locationBucket?: string;
  clothingType?: string;
  clothingAgeGroup?: string;
  genderFit?: string;
  bookType?: string;
  educationLevel?: string;
  subject?: string;
  photos?: string[];
}

export interface IStockFilter {
  category?: string;
  availability?: string;
  visibility?: string;
  search?: string;
}
