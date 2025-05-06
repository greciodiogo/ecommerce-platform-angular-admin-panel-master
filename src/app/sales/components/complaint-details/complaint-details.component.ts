import { Component, Input } from '@angular/core';
import { Order } from '../../../core/api';
import { ReturnAddDialogComponent } from '../return-add-dialog/return-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complaint-details',
  templateUrl: './complaint-details.component.html',
  styleUrls: ['./complaint-details.component.scss'],
})
export class ComplaintDetailsComponent {
  @Input() complaint: Order | null = null;

}
