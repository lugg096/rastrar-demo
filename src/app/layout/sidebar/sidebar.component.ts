import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data-service.service';
import { Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Funciones } from 'src/app/compartido/funciones';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() appPages: any
  constructor(
    private _fun: Funciones,
    private _auth: AuthService,
    public router: Router,
    private _dataService: DataService,) { }


  selectPage = '';
  nameUser = '';
  roleUser = '';

  ngOnInit() {
    this.getUser();
    this.configData();
    this.btnMenu(null);
  }

  configData() {

    if (this.router.url == '/procesos' || this.router.url == '/task' || this.router.url == '/pantalla' || this.router.url == '/campos' || this.router.url == '/acciones' || this.router.url == '/param') this.selectPage = '/config';
    else this.selectPage = this.router.url;

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        console.log('event1', event.url);
        if (event.url == '/procesos' || event.url == '/task' || event.url == '/pantalla' || event.url == '/campos' || event.url == '/acciones' || event.url == '/param') this.selectPage = '/config';
        else this.selectPage = event.url;
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        /*   console.log('event2',event); */
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator
        console.log(event.error);
      }
    });
  }

  getUser() {
    this._auth.getUser().subscribe(res => {
      if (this._fun.isVarInvalid(res)) return;

      if (res.name.length > 16) {
        let n: any = res.name.split(' ');
        this.nameUser = n[0] + ' ' + n[1] || '';
      } else this.nameUser = res.name;


      this.roleUser = res.data.role.value;
    })
  }

  perfil() {
    this.router.navigate(['/profile']);
  }

  async navigateRouter(page) {
    this.router.navigate([page]);
  }


  showMenu(event) {
    console.log('event', event.target);
    event.target.parentElement.parentElement.classList.toggle('showMenu');
  }

  btnMenu(event) {
    let sidebar = document.querySelector(".sidebar");
    console.log('sidebar', sidebar);
    sidebar.classList.toggle('close');
    this._dataService.eventBtnMenu.next(true);
  }

}
