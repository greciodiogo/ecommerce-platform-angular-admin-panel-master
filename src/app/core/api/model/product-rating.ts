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
import { User } from './user';
import { ProductRatingPhoto } from './product-rating-photo';
import { Product } from './product';


export interface ProductRating { 
    id: number;
    created: string;
    updated: string;
    user: User;
    product: Product;
    rating: number;
    comment?: string;
    photos: Array<ProductRatingPhoto>;
}

