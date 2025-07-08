import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AddressApiService } from './api/address-api.service';
import { AttributeTypesApiService } from './api/attribute-types-api.service';
import { AuthApiService } from './api/auth-api.service';
import { CartsApiService } from './api/carts-api.service';
import { CategoriesApiService } from './api/categories-api.service';
import { CodesApiService } from './api/codes-api.service';
import { DefaultApiService } from './api/default-api.service';
import { DeliveryMethodsApiService } from './api/delivery-methods-api.service';
import { FaqsApiService } from './api/faqs-api.service';
import { FeedbackApiService } from './api/feedback-api.service';
import { ImportExportApiService } from './api/import-export-api.service';
import { NotificationsApiService } from './api/notifications-api.service';
import { OperationLogsApiService } from './api/operation-logs-api.service';
import { OrdersApiService } from './api/orders-api.service';
import { PagesApiService } from './api/pages-api.service';
import { PaymentMethodsApiService } from './api/payment-methods-api.service';
import { ProductRatingsApiService } from './api/product-ratings-api.service';
import { ProductsApiService } from './api/products-api.service';
import { PromotionsApiService } from './api/promotions-api.service';
import { ReturnsApiService } from './api/returns-api.service';
import { SettingsApiService } from './api/settings-api.service';
import { ShopkeepersalesApiService } from './api/shopkeepersales-api.service';
import { ShopsApiService } from './api/shops-api.service';
import { UsersApiService } from './api/users-api.service';
import { WishlistsApiService } from './api/wishlists-api.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
