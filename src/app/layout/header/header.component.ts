import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Funciones } from 'src/app/compartido/funciones';
import { DataService } from 'src/app/services/data-service.service';
declare let window: any;
var img: any;
var clickStream$ = new Subject<Event>();

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string;

  constructor(
    private _dataService: DataService,
    private _fun: Funciones,
    private zone: NgZone,
    public _storage: StorageService,
    private _router: Router,
    private _auth: AuthService) { }

  name: string;
  menu: Array<any> = [];
  breadcrumbList: Array<any> = [];

  imgMet = 'mm0';
  accounts = [];
  menuClose = false;


  ngOnInit() {
    this.menuClose = false;
    this._dataService.eventBtnMn().subscribe(data => {
      if (this._fun.isVarInvalid(data)) return;
      console.log('data', data);
      this.menuClose = !this.menuClose;
    });
    this.getUser();

  /*   if (window.ethereum.isConnected() && typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress !== null) {
      console.log('MetaMask is installed!');
      if (typeof window.ethereum != "undefined" || !window.ethereum.isMetaMask) {
        this.goMMConnect();
      }
    } else {
      console.log('MetaMask not is installed!');
    }

    clickStream$.subscribe((accounts: any) => {
      if (Array.isArray(accounts)) {
        this.accounts = accounts[0];
        if (accounts.length == 0) {
          this.imgMet = 'mm0';
          console.log('NIGUNO');
        }
        else this.imgMet = 'mm1';
        this.zone.run(() => {
          console.log('force update the screen');
        });
      }
    });

    window.ethereum.on('accountsChanged', function (accounts) {
      clickStream$.next(accounts);
    }); */
  }

  async goMMConnect() {
    console.log('MOSTRAR CONECCION');

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    window.owner = window.ethereum.selectedAddress //0x0Ca82c887265a45F81ea19Ba0b77479F1E81B919
    console.log('CUENTA SELECCIONADA', window.ethereum.selectedAddress)
    this.accounts = window.ethereum.selectedAddress;
    console.log('MetaMask not is installed!');
    this.imgMet = "mm1";
  }

  async closeSesion() {
    await this._auth.logout();
  }

  nameUser = '';
  roleUser = '';

  getUser() {
    this._auth.getUser().subscribe(res => {
      if(this._fun.isVarInvalid(res))return;
        this.nameUser = res.name;
        this.roleUser = res.data.role.value;
    })
  }

  perfil() {
    this._router.navigate(['/profile']);
  }

}
