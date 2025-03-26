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
import { ProductRating } from './product-rating';
import { Attribute } from './attribute';
import { ProductPhoto } from './product-photo';


export interface Product { 
    id: number;
    created: string;
    updated: string;
    name: string;
    price: number;
    visible: boolean;
    description: string;
    stock: number;
    attributes: Array<Attribute>;
    photos: Array<ProductPhoto>;
    photosOrder?: string;
    ratings: Array<ProductRating>;
}

