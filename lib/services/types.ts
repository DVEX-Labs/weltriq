export interface ManagedService {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  title: string;
  description: string;
  image: string;
  id?: string;
  number?: string;
}

export interface UpdateServiceInput {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  number?: string;
}

export const MAX_DESCRIPTION_LENGTH = 160;
export const MAX_TITLE_LENGTH = 45;

