
export interface SystemSpecs {
  os: string;
  platform: string;
  userAgent: string;
  cores: number;
  memory?: number;
  screenResolution: string;
  isLaptop: boolean;
  batteryLevel?: number;
  isCharging?: boolean;
  userAge?: number;
  userExperience?: 'beginner' | 'intermediate' | 'pro';
}

export interface Recommendation {
  osName: string;
  overallScore: number;
  performanceScore: number;
  batteryScore: number;
  description: string;
  recommendationReason: string;
  downloadUrl: string;
  pros: string[];
  cons: string[];
  isTopPick?: boolean;
}

export interface ComparisonResult {
  currentOsAnalysis: string;
  recommendations: Recommendation[];
  hardwareSummary: string;
}
