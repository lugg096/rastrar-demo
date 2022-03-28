import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-porcent',
  templateUrl: './porcent.component.html',
  styleUrls: ['./porcent.component.scss'],
})
export class PorcentComponent implements OnInit {

  @ViewChild('por', { read: ElementRef }) por: ElementRef;
  @Input() currentMessage: any;
  @Input() sku: any = '';
  @Input()  porcent: number = 0;

  constructor(private renderer: Renderer2) { }

  ngOnInit() { }

  ngAfterViewInit() {
  /*   this.porcent = message; */
      this.renderer.setStyle(this.por.nativeElement, 'stroke-dashoffset', `calc(440 - (440 * ${ this.porcent }) / 100) `);

    this.currentMessage.subscribe(message => {
      console.log('ESTE MENSAJE LLEGO', message);
      this.porcent = message;
      this.renderer.setStyle(this.por.nativeElement, 'stroke-dashoffset', `calc(440 - (440 * ${message}) / 100) `);
    });
  }

}
