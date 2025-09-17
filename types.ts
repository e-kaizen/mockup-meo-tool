export interface Place {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  reviewSummary?: {
    text: string;
    languageCode: string;
  };
}

export interface MEOAnalysis {
  meoScore: number;
  strengths: string[];
  weaknesses: string[];
}

export interface PlaceResult {
  place: Place;
  analysis: MEOAnalysis;
  translatedReview?: string;
  gbpVerified: boolean;
}
