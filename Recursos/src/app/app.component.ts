import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  Plugins,
  StatusBarStyle,
} from '@capacitor/core';
import { AlertController, IonMenu, Platform } from '@ionic/angular';
import { Funciones } from './compartido/funciones';
import { ApiService } from './services/api.service';
import { StorageService } from './services/storage.service';
import { environment as env } from 'src/environments/environment';
const { StatusBar } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  @ViewChild('menu', { static: false }) public menu: IonMenu;
  constructor(
    public fun: Funciones,
    public router: Router,
    public alertController: AlertController,
    private storage: StorageService,
    private plt: Platform) {
    if (this.plt.is('capacitor')) {
      StatusBar.setStyle({ style: StatusBarStyle.Dark });
      StatusBar.setBackgroundColor({ color: "#04143c" })
    }
    this.config();
  }

  user: any = {
    name: '',
    email: ''
  };

  async config() {
    this.getToken();
    await this.storage.initVarSis();

    console.log('userSesion......1',this.storage.userSesion);
    
    this.user = this.storage.userSesion || {name: '',email: ''};
  }

  getToken() {
    /*  this.api.auth().subscribe(async (res: any) => {
       console.log('res', res);
       if (this.fun.isInvalidResApi(res.code)) {
         await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, res.message);
         return;
       }
       this.storage.setLocalStorage('TOKEN', res.data.token);
     })
  */
    this.storage.setLocalStorage('TOKEN', 'eyJhbGciOiJFQ0RTQSIsICJ0eXAiOiAiRVRIU0lHTiJ9.eyJpYXQiOjE2MjU1OTQwOTYyNzMsImV4cCI6MTg3NTU5NDA5NjI3MywiZGF0YSI6eyJzZWNyZXRfYm9sZXRoIjoiY29vcGVjYW40Iiwic2VydmVyX2lkIjoiMHgxMjQ1MkE0YTJhNUQxYTRGZDIyZGEwNGZCMjU0MEMwQ0QwRjg2OWJGIiwiY29udHJhY3QiOiIweDZCNUEzQmY3Y0NEOWYyRkUxOENCMDZlNmQwMTA5RjBhZUU5YWFhRDAiLCJjbGllbnRfaWQiOiIweDk2ZUZDQ2NFNERDYzM4ZDZlZkEwNWQ0OTJiQzI1QThEZmM0MDBlOTYifX0=.MHhkZTc2Y2VkNjBjNmMwNDAyMzEwNzcwMWYxMTQwNGNkMGUxZDViYTUwYmJmNDA1NmU0NmE5YjA3YjA1MTZlZjk0NzQ1ZTZhNWFmZmY0OTA2NWYxYzk2OTFkZWI3ZjA0M2U4OTJiOTkxNTkyOTNmMTE3ZWYxYmEwMWZjY2MzZmIxYTFj');
  }



  gohome() {
    this.router.navigate(['/home']);
  }

  async closeSesion() {
    let res: any = await this.fun.alertWarning('Esta seguro de cerrar sesión', 'Si, cerrar');
    if (this.fun.isVarInvalid(res)) return;
    console.log('res', res);
    this.storage.clearStorage();
    this.storage.initSesion = false;
    this.closeMenu();
    this.router.navigate(['/home']);
    console.log('this.storage.initSesion',this.storage.initSesion);
    
  }

  async closeMenu() {
    await this.menu.close();
  }


  willOpen() { }
}
