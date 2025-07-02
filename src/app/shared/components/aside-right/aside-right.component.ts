import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-aside-right',
  templateUrl: './aside-right.component.html',
  styleUrls: ['./aside-right.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ right: '0', opacity: 1 })),
      state('out', style({ right: '-250px', opacity: 0 })), // match .size_medium width
      transition('out => in', [
        animate('300ms cubic-bezier(0.4,0,0.2,1)')
      ]),
      transition('in => out', [
        animate('200ms cubic-bezier(0.4,0,0.2,1)')
      ]),
    ])
  ]
})
export class AsideRightComponent implements OnInit {
  @Input() componentTitle: string = ""
  @Input() componentIcon: string = ""
  @Input() componentDesc: string = ""
  @Input() componentSize: string = "medium"
    /**
   * Flag que indica se o FAQ está aberto.
   * @type {boolean}
   */
  @Input() hasHeader: boolean = true
  @Input() isOpen: boolean = false

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    // this.getComponentSize()
  }
  
  onClose(){
    this.isOpen = false;
    this.close.emit(); // Notify parent!
  }

  // public getComponentSize(){
  //   if (this.componentSize=='short')
  //     return 'size_short'
  //   if (this.componentSize=='medium')
  //     return 'size_medium'
  // }

}
