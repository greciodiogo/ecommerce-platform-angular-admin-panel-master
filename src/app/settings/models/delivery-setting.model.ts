export interface DeliverySetting {
  key: string;
  value: number | string | boolean;
  type: 'number' | 'string' | 'boolean' | 'json';
  description: string;
}

export interface DeliverySettingResponse {
  success: boolean;
  data: DeliverySetting | DeliverySetting[];
  message?: string;
}
