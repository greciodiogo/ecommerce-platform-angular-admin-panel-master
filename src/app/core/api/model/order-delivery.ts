/**
 * E-commerce platform API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.4.22
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Order } from './order';
import { DeliveryMethod } from './delivery-method';
import { Address } from './address';


export interface OrderDelivery { 
    id: number;
    order: Order;
    method: DeliveryMethod;
    deliveryStatus: string;
    address: string;
    city: string;
    postalCode?: string;
    country: string;
    addressEntity?: Address;
    price?: number;
}

