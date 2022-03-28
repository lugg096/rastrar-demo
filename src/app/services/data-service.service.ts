import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  public dataSend: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }


  public eventBtnMenu: BehaviorSubject<any> = new BehaviorSubject(null);
  eventBtnMn() {
    return this.eventBtnMenu.asObservable();
  }

  getData(){
    return this.dataSend.asObservable();
  }

  public dataSendForm: BehaviorSubject<any> = new BehaviorSubject(null);
  getDataForm(){
    return this.dataSendForm.asObservable();
  }

  public dataGeneration: BehaviorSubject<any> = new BehaviorSubject(null);
  getDataGeneration(){
    return this.dataGeneration.asObservable();
  }
  
  

}
