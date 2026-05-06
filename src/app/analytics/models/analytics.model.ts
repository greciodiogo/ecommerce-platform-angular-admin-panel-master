export interface OverviewMetrics {
  totalDownloads: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  averageRating: number;
  totalReviews: number;
  retentionD1: number;
  retentionD7: number;
  retentionD30: number;
  growthPercentage: number;
}

export interface DownloadMetrics {
  android: number;
  ios: number;
  byDate: Array<{ date: string; count: number }>;
  byCountry: Array<{ country: string; count: number }>;
}

export interface RatingMetrics {
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentReviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  platform: 'android' | 'ios';
}

export interface VersionMetrics {
  distribution: Array<{
    version: string;
    percentage: number;
    count: number;
  }>;
  latestVersion: string;
  updateRate: number;
}

export interface AnalyticsData {
  overview: OverviewMetrics;
  downloads: DownloadMetrics;
  ratings: RatingMetrics;
  versions: VersionMetrics;
  dataSource: 'mock' | 'play-console' | 'firebase';
  lastUpdated: string;
}

export enum AnalyticsPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}
