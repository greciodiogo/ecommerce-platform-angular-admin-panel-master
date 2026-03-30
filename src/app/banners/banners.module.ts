import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BannersRoutingModule } from './banners-routing.module';
import { BannersComponent } from './banners/banners.component';
import { BannersListComponent } from './banners-list/banners-list.component';
import { BannerFormComponent } from './banner-form/banner-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    BannersComponent,
    BannersListComponent,
    BannerFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BannersRoutingModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
    DragDropModule,
  ],
})
export class BannersModule {}
