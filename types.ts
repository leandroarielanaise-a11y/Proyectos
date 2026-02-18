
export interface CandidateScores {
  knowledge: number;
  skills: number;
  seniority: number;
  languages: number;
  others: number;
  total: number;
}

export interface Candidate {
  id: string;
  name: string;
  surname: string;
  scores: CandidateScores;
  summary: string;
  recommendationReason: string;
  uniqueAttributes?: string;
  languagesDetail?: string;
  email?: string;
  phone?: string;
  experienceYears: number;
}

export interface AnalysisResult {
  candidates: Candidate[];
  bestCandidateId: string;
  overallRecommendation: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
