import { Component, OnInit, Renderer2 } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private _dataService: DataService,
    private renderer: Renderer2) { }

  ngOnInit(): void {
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
