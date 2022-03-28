import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Funciones } from '../compartido/funciones';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data-service.service';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {

  constructor(

    private _dataService: DataService,
    private _fun: Funciones,
    private authService: AuthService) { }



  appPages = [];

  options = [
    { title: 'Usuarios', code: 'use', url: '/users', icon: 'people' },
    { title: 'Roles', code: 'rol', url: '/roles', icon: 'shield-checkmark' },
    
    { title: 'Pantallas', code: 'scr', url: '/pantalla', icon: 'today-outline' },
 /*    { title: 'Campos', code: 'fie', url: '/campos', icon: 'grid-outline' }, */
    { title: 'Acciones', code: 'acc', url: '/acciones', icon: 'repeat-outline' },
    { title: 'Parámetros', code: 'par', url: '/param', icon: 'apps' }
  ];

  sections = [
    { title: 'Administración', code: 'section' },
    { title: 'Configuración', code: 'section' }
  ];

  role: any;
  menuClose = false;

  ngOnInit() {
    this.getUser();
    this._dataService.eventBtnMn().subscribe(data => {
      if (this._fun.isVarInvalid(data)) return;
      console.log('data', data);
      this.menuClose = !this.menuClose;
    });
  }



  async getUser() {
    this.role = await this.authService.loadUser();

    let data = this.role.data.conf_web;
    let data2 = [
      {
        "name": "Lista de QR",
        url: '/list-qr',
        icon: 'archive-outline',
        "modules": []
      },
      {
        "name": "Usuarios",
        url: '/users',
        icon: 'people',
        "modules": []
      },
      {
        "name": "Roles",
        icon: 'shield-half-outline',
        url: '/roles',
        "modules": []
      },

      {
        "name": "Configuración",
        url: '/config',
        icon: 'build-outline',
        "modules": [
          { name: 'Pantallas', url: '/pantalla', icon: 'today-outline' },
          { name: 'Acciones', url: '/acciones', icon: 'repeat-outline' },
          { name: 'Parámetros', url: '/param', icon: 'apps' }
        ]
      }
    ]

    this.appPages = data2;

    console.log('data', data);

      /*   for (let x = 0; x < data.length; x++) {
          for (let y = 0; y < data[x].modules.length; y++) {
            let md = data[x].modules[y];
            let mdOpc = this.options.filter(m => m.code == md.code && md.value);
            if (y == 0 && md.value) this.appPages.push(this.sections[x]);
            if (!this._fun.isEmpty(mdOpc)) this.appPages.push(mdOpc[0]);
          }
    
          if ((x + 1) == data.length) {
            this.appPages.push({ title: 'Mi usuario', code: 'section' });
            this.appPages.push({ title: 'Perfil', code: 'pro', url: '/profile', icon: 'person-circle' });
          }
        } */

  }


  /*  async getUser() {
     this.role = await this.authService.loadUser();
 
     let data = this.role.data.conf_web;
     console.log('data', data);
 
     for (let x = 0; x < data.length; x++) {
       for (let y = 0; y < data[x].modules.length; y++) {
         let md = data[x].modules[y];
         let mdOpc = this.options.filter(m => m.code == md.code && md.value);
         if (y == 0 && md.value) this.appPages.push(this.sections[x]);
         if (!this._fun.isEmpty(mdOpc)) this.appPages.push(mdOpc[0]);
       }
 
       if ((x + 1) == data.length) {
         this.appPages.push({ title: 'Mi usuario', code: 'section' });
         this.appPages.push({ title: 'Perfil', code: 'pro', url: '/profile', icon: 'person-circle' });
       }
     }
 
   } */
}
