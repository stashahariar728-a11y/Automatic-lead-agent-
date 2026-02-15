
export interface UserCriteria {
  niche: string;
  location: string;
  targetProblems: string;
  intendedService: string;
  leadScoreThreshold: number;
  businessStage: string;
}

export interface LeadReport {
  executiveSummary: string;
  leadScore: number;
  businessOverview: {
    name: string;
    industry: string;
    location: string;
    website: string;
    socialMedia: string;
    facebookLink: string;
    businessStage: string;
  };
  digitalAuditFindings: {
    branding: string;
    content: string;
    engagement: string;
    funnel: string;
    ads: string;
    website: string;
  };
  identifiedProblems: string[];
  growthOpportunities: string[];
  recommendedServices: string;
  outreachScripts: {
    shortDM: string;
    emailVersion: string;
  };
  sources?: { web: { uri: string; title: string } }[];
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  criteria: UserCriteria;
  reports: LeadReport[];
}
