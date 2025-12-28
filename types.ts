
export interface SystemSpecs {
  os: string;
  platform: string;
  userAgent: string;
  cores: number;
  memory?: number;
  screenResolution: string;
  isLaptop: boolean;
  userAge?: number;
  userExperience?: 'beginner' | 'intermediate' | 'pro';
}

export interface Review {
  source: 'Reddit' | 'Social Media' | 'Official Site' | 'Tech Forum';
  content: string;
  rating?: number;
}

export interface Recommendation {
  osName: string;
  overallScore: number;
  performanceScore: number;
  description: string;
  recommendationReason: string;
  downloadUrl: string;
  pros: string[];
  cons: string[];
  reviews: Review[];
  isTopPick?: boolean;
}

export interface ComparisonResult {
  currentOsAnalysis: string;
  recommendations: Recommendation[];
  hardwareSummary: string;
}
