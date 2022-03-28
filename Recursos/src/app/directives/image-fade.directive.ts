import { Directive, HostListener, Input, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appImageFade]'
})
export class ImageFadeDirective {
  @Input('appImageFade') cover: any;
 
  constructor(
    private renderer: Renderer2,
    private domCtrl: DomController
  ) { }
 
  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
    const scrollTop: number = $event.detail.scrollTop;
    let newOpacity = Math.max(100 - (scrollTop/1.8), 0)

    let newPadding = 10 + (scrollTop/10);
    if (newPadding > 100) {
      newPadding = 100;
    }
 
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.cover, 'opacity', `${newOpacity}%`);
      this.renderer.setStyle(this.cover, 'padding-left', `${newPadding}%`);
      this.renderer.setStyle(this.cover, 'padding-right', `${newPadding}%`);
    });
  }
}
