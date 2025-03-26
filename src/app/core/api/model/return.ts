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
import { Order } from './order';

export interface Return {
  id: number;
  created: string;
  updated: string;
  order: Order;
  message?: string;
  status: Return.StatusEnum;
}
export namespace Return {
  export type StatusEnum =
    | 'open'
    | 'accepted'
    | 'rejected'
    | 'cancelled'
    | 'completed';
  export const StatusEnum = {
    Open: 'open' as StatusEnum,
    Accepted: 'accepted' as StatusEnum,
    Rejected: 'rejected' as StatusEnum,
    Cancelled: 'cancelled' as StatusEnum,
    Completed: 'completed' as StatusEnum,
  };
}
