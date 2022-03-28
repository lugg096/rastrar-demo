import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-list-select',
  templateUrl: './list-select.component.html',
  styleUrls: ['./list-select.component.scss'],
})
export class ListSelectComponent implements OnInit {

  constructor(
    private _apiMongo: ApiMongoService,
    private _fun: Funciones,
    private _modal: ModalController) { }


  nameFilter = '';
  list_main = [];
  pageOfItems: Array<any>;
  list = [];
  load = false;

  type_text = '';
  key_table = '';
  item: any;
  collection: any;

  isUser = false;
  filter_list = false;

  optionFilter = [
    { key: 'name', value: '', type: 'string' },
    { key: 'status', value: false, type: 'boolean' }
  ];

  ngOnInit() {
    console.log('key_table', this.key_table);
    this.getList();
  }

  selectinput(item) {
    this.item = item;
  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  async confirm(item) {
    await new Promise(f => setTimeout(f, 300));
    this._modal.dismiss({
      confirm: item
    });
  }


  listFieldsFilter = [];

  filter2(valor_filter) {
    this.list = this.list_main.filter(a => {

 /*      if (this._fun.isEmpty(a.data.dids)) {
        this.isUser = true;
        return false;
      } */

      let bandera = 0;

      for (let index = 0; index < this.listFieldsFilter.length; index++) {
        var itemf: any = this.listFieldsFilter[index];

        let valor = itemf.split('.');
        let value: any = a[valor[0]];
        for (let i_1 = 1; i_1 < valor.length; i_1++) {
          const elem = valor[i_1];
          let array = elem.split('[');
          console.log('array', array);

          if (array.length > 1) {
            console.log('IS ARRAY', value[array[0]]);

            value = value[array[0]][array[1]];
          } else value = value[elem];

        }
        console.log('Value', value);
        /*  filter1 = ; */
        if (value.toLowerCase().indexOf(valor_filter.toLowerCase()) != -1) bandera++;
        console.log('filter1', value.toLowerCase().indexOf(valor_filter.toLowerCase()) != -1);

        if (index == (this.listFieldsFilter.length - 1)) {
          console.log('bandera', bandera);

          if (bandera > 0) return true;
          else return false;
        }
      }

      /* return filter1 && filter2; */
    });
  }

  filter() {
    this.list = this.list_main.filter(a => {

      /* VALIDA QUE TENDA DID */
 /*      console.log('a.data.dids', this._fun.isEmpty(a.data.dids));
      if (this._fun.isEmpty(a.data.dids)) {
        this.isUser = true;
        return false;
      }
 */
      let filter1 = true;
      let filter2 = true;

      for (let index = 0; index < this.optionFilter.length; index++) {
        var itemf: any = this.optionFilter[index];

        if (itemf.type == 'string') {
          filter1 = a[itemf.key].toLowerCase().indexOf(itemf.value.toLowerCase()) != -1;
        }

        if (itemf.type == 'boolean') {
          if (a[itemf.key]) filter2 = true;
          else filter2 = itemf.value;
        }
      }
      return filter1 && filter2;
    });
  }

  async getList() {
    this.load = true;
    try {
      /*  const res: any = await this._apiMongo.get(this.collection, this.key_table, 'items'); */
      let res: any;
      if (this.filter_list) res = await this._apiMongo.filter(this.collection, this.key_table, this.filter_list);
      else res = await this._apiMongo.get(this.collection, this.key_table, 'items');

      console.log('res', res);
      if (this._fun.isEmpty(res.result)) {
        this.load = false;
        return;
      }

      this.list_main = this.list = this._fun.sortJSON(res.result[0][this.key_table], 'name', true);
      console.log('this.list_main', this.list_main);
      /* return; */
      this.list = this.list_main;
      console.log(' this.list ', this.list);

      /*   this.filter(); */

      this.load = false;
    } catch (error) {
      this.load = false;
      await this._fun.alertError(error);
    }
  }

  changeInput(value, index, type) {
    if (type == 'checkbox') {
      value = value.detail.checked;
    }

    this.optionFilter[index].value = value;
    if (this.listFieldsFilter.length > 0) this.filter2(value);
    else this.filter();


  }



}
