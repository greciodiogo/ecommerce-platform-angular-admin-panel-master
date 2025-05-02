import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-aside-right',
  templateUrl: './aside-right.component.html',
  styleUrls: ['./aside-right.component.css']
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
    // this.close.emit();
    this.isOpen = false
  }

  // public getComponentSize(){
  //   if (this.componentSize=='short')
  //     return 'size_short'
  //   if (this.componentSize=='medium')
  //     return 'size_medium'
  // }

}
