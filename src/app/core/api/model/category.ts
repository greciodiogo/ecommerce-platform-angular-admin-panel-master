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
import { Product } from './product';
import { CategoryGroup } from './category-group';


export interface Category { 
    id: number;
    name: string;
    description: string;
    slug?: string;
    service_fee: number;
    parentCategory?: Category;
    childCategories: Array<Category>;
    groups: Array<CategoryGroup>;
    products: Array<Product>;
}

