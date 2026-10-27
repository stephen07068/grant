export type GrantCategory =
  | 'Military & Veterans'
  | 'Hospital & Healthcare'
  | 'Emergency Medical'
  | 'Small Business & Entrepreneurship'
  | 'Education & College'
  | 'Housing & Homelessness'
  | 'Agriculture & Farming'
  | 'Technology & Innovation'
  | 'Women-Owned Business'
  | 'Minority-Owned Business'
  | 'Nonprofit & Charity'
  | 'Disability Support'
  | 'Youth & Family'
  | 'Mental Health'
  | 'Environmental & Clean Energy'
  | 'Disaster Recovery'
  | 'Arts & Culture'
  | 'Scientific Research'
  | 'Cancer & Critical Illness'
  | 'Chronic Disease & Rare Conditions'
  | 'Senior & Elder Care'
  | 'Individual Medical Bills';

export type GrantStatus = 'Open' | 'Upcoming' | 'Closed';
export type ApplicantType =
  | 'Individual'
  | 'Small Business'
  | 'Nonprofit'
  | 'Healthcare Organization'
  | 'Educational Institution'
  | 'Government'
  | 'Research Institution'
  | 'Veterans & Military Families'
  | 'Farmers & Agricultural Producers';

export interface Grant {
  id: string;
  title: string;
  provider: string;
  category: GrantCategory;
  minAmount: number;
  maxAmount: number;
  status: GrantStatus;
  deadline: string; // ISO date string
  location: string;
  applicantTypes: ApplicantType[];
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  officialUrl: string;
  imageUrl: string;
  featured: boolean;
  isDemoData: boolean;
}

export interface CategoryInfo {
  name: GrantCategory;
  icon: string;
  description: string;
  count: number;
}

export interface ApplicationFormData {
  // Organization info
  organizationName: string;
  organizationType: ApplicantType | '';
  ein: string;
  organizationAddress: string;
  city: string;
  state: string;
  // Contact
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  // Grant selection
  grantId: string;
  // Project info
  projectTitle: string;
  projectDescription: string;
  // Eligibility
  meetsEligibility: boolean;
  notPreviouslyFunded: boolean;
  // Documents
  documents: File[];
}
