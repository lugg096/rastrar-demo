import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { environment as env } from 'src/environments/environment';

/* Lottie  */
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {

  private animationItem: AnimationItem;

  buttonConfim: string = '';
  textTitle: string = '';
  subtitle: string = '';
  type: string = '';// success | danger | alert
  bCancel = true;

  options: AnimationOptions ;

  constructor(
    private ngZone: NgZone,
    private _modal: ModalController,
    public _comp: IonicComponentsService) { }

  ngOnInit() { }


  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    setTimeout(() => {
      this.pause();
    }, 1500);
  }

  stop(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem.stop());
  }

  play(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem.play());
  }

  pause(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem.pause());
  }


  closeModal() {
    this._modal.dismiss();
  }

  confirm() {
    this._modal.dismiss({  confirm: true });
  }
}
