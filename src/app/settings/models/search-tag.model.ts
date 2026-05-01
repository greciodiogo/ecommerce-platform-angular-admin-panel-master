export interface SearchTag {
  id: number;
  tag: string;
  icon?: string;
  color?: string;
  order: number;
  active: boolean;
  click_count: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface SearchTagResponse {
  success: boolean;
  data: SearchTag | SearchTag[];
  message?: string;
}
