import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { environment as env } from 'src/environments/environment';
import { sha256 } from 'js-sha256';

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

  item: any = { key: '' };
  nameFilter = '';

  list = [];
  list_main = [];
  title = '';
  label = '';

  listSelect = [];
  list_end = [];

  fechaValid = '';
  optionFilter = [
    { key: 'name', value: '', type: 'string' },
    { key: 'status', value: false, type: 'boolean' }
  ];

  dateLocal = null;
  hash1 = '';

  ngOnInit() {
    this.list = this.list_main;
    this.filter();
    console.log('list_main', this.list_main);
    this.dateLocal = new Date();
    let hash1: any = sha256('RASTRAR');
    this.hash1 = hash1.substr(0, 2) + hash1.substr(hash1.length - 3, 2);

    this.fechaValid = '12/' + (this.dateLocal.getFullYear() - 2000 + 4);
  }


  listFieldsFilter = [];

  filter2(valor_filter) {
    this.list = this.list_main.filter(a => {

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

    });
  }

  filter() {
    this.list = this.list_main.filter(a => {

      let filter1 = true;
      let filter2 = true;

      for (let index = 0; index < this.optionFilter.length; index++) {
        var itemf: any = this.optionFilter[index];

        if (itemf.type == 'string') {
          filter1 = a[itemf.key].toLowerCase().indexOf(itemf.value.toLowerCase()) != -1;
        }

        if (itemf.type == 'boolean') {
          if (this._fun.isVarInvalid(a.data.gen_card) || a.data.gen_card == false) filter2 = true;
          else filter2 = itemf.value;
        }
      }
      return filter1 && filter2;
    });
  }

  confirmCheck(data, values) {
    console.log('data', data);
    if (values.currentTarget.checked) {
      this.listSelect.push(data);
    } else {
      let index = this.listSelect.findIndex(r => r.key == data.key);
      this.listSelect.splice(index, 1);
    }
    console.log('this.listSelect', this.listSelect);

  }

  configParamas(params) {
    let lengthObj = Object.keys(params).length;
    let count = 0;

    for (const p1 in params) {
      if (typeof params[p1] === 'object' || params[p1] instanceof Object) params[p1] = this.configParamas(params[p1])
      else if (p1 == '$lte' || p1 == '$gt') params[p1] = Number(params[p1]);
      count++;
      if (count == lengthObj) return params;
    }
  }

  selectValid(data) {
    let index = this.listSelect.findIndex(r => r.key == data.key);
    if (index != -1) return true;
    else return false;
  }

  changeInput(value, index, type) {
    if (type == 'checkbox') value = value.detail.checked;
    this.optionFilter[index].value = value;
    if (this.listFieldsFilter.length > 0) this.filter2(value);
    else this.filter();
  }

  selectAll(value) {

    if (value.detail.checked) {
      this.listSelect = [...this.listSelect, ...this.list];
    } else this.listSelect = [];
  }


  closeModal() {
    this._modal.dismiss({ confirm: false, list: []});
  }

  confirm() {
    this._modal.dismiss({ confirm: true, list: this.listSelect });
  }



}
