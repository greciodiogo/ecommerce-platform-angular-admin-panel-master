export interface DeliveryZone {
  id: number;
  name: string;
  slug?: string;
  price: number;
  latitude?: number;
  longitude?: number;
  radius_km?: number;
  is_zone: boolean;
  visible: boolean;
  parentAddressId?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    total: number;
    perPage: number;
    page: number;
    lastPage: number;
  };
}

export interface DeliveryZoneResponse {
  success: boolean;
  data: DeliveryZone;
  message?: string;
}
