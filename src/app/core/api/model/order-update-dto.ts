/**
 * E-commerce platform API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.4.8
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { OrderItemDto } from './order-item-dto';
import { OrderPaymentDto } from './order-payment-dto';
import { OrderDeliveryDto } from './order-delivery-dto';

export interface OrderUpdateDto {
  items?: Array<OrderItemDto>;
  fullName?: string;
  contactEmail?: string;
  contactPhone?: string;
  message?: string;
  status?: OrderUpdateDto.StatusEnum;
  delivery?: OrderDeliveryDto;
  payment?: OrderPaymentDto;
}
export namespace OrderUpdateDto {
  export type StatusEnum =
    | 'pending'
    | 'failed'
    | 'confirmed'
    | 'open'
    | 'cancelled'
    | 'delivered'
    | 'refunded';
  export const StatusEnum = {
    Pending: 'pending' as StatusEnum,
    Failed: 'failed' as StatusEnum,
    Confirmed: 'confirmed' as StatusEnum,
    Open: 'open' as StatusEnum,
    Cancelled: 'cancelled' as StatusEnum,
    Delivered: 'delivered' as StatusEnum,
    Refunded: 'refunded' as StatusEnum,
  };
}
