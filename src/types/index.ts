export interface Addon {
  id: string;
  name: string;
  description: string;
  pricing: {
    type: 'monthly' | 'one-time' | 'inquire';
    amount?: number;
    note?: string;
  };
  category: string;
  subcategory?: string;
  categoryColor?: string;
  tags: string[];
  requirements?: string[];
  includes?: string[];
}

export interface Category {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  subcategories?: Array<{
    id: string;
    name: string;
  }>;
}

export interface SelectionData {
  selections: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    pricing: {
      type: 'monthly' | 'one-time' | 'inquire';
      amount?: number;
      note?: string;
    };
    includes?: string[];
  }>;
  metadata?: {
    totalPrice?: number;
    businessProfile?: {
      businessType: string;
      teamSize: string;
      mainGoal: string;
    };
    contact?: {
      businessName: string;
      contactName: string;
      email: string;
      phone: string;
      website?: string;
      bestTimeToContact: string;
    };
    preferences?: {
      budget: string;
      timeline: string;
      additionalInfo?: string;
    };
    userAgent?: string;
    platform?: string;
    language?: string;
    timezone?: string;
    timestamp?: string;
  };
}