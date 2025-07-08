import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OperationLog } from '../../model/operation-log.model';

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  styleUrls: ['./log-detail.component.scss'],
})
export class LogDetailComponent {
  @Input() log!: OperationLog;
  @Output() cancel = new EventEmitter<void>();
} 