import { Component, OnInit } from '@angular/core';
/* Generar PDF */
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { environment as env } from 'src/environments/environment';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import domtoimage from 'dom-to-image';
import { sha256 } from 'js-sha256';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { Funciones } from 'src/app/compartido/funciones';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-gen-cards',
  templateUrl: './gen-cards.component.html',
  styleUrls: ['./gen-cards.component.scss'],
})
export class GenCardsComponent implements OnInit {

  constructor(
    private _modal: ModalController,
    private _fun: Funciones,
    private _apiMongo: ApiMongoService) { }

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  list = [];
  list_main = [];
  key_table: any;
  item: any = { key: '' };
  nameFilter = '';

  listTypeDoc = [];
  listG_clie = [];
  listG_empl = [];
  listG_prod = [];
  listRole = [];
  listTypeProv = [];

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
    let hash1 = sha256('COOPECAN');
    this.hash1 = hash1.substr(0, 2) + hash1.substr(hash1.length - 3, 2);

    this.fechaValid = '12/' + (this.dateLocal.getFullYear() - 2000 + 4);
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

      let hash2 = data.data.dids[0].address.substr(0, 4) + data.data.dids[0].address.substr(data.data.dids[0].address.length - 5, 4);
      data.serial = this.hash1 + '-' + hash2 + '-' + this.dateLocal.getFullYear();

      this.listSelect.push(data);
    } else {
      let index = this.listSelect.findIndex(r => r.key == data.key);
      this.listSelect.splice(index, 1);
    }
    console.log('this.listSelect', this.listSelect);

    console.log(values.currentTarget.checked);
  }

  updateUsers() {
    this.listSelect.forEach(async (user) => {
      let dataDB: any;
      dataDB = user.data;
      dataDB.status = user.status;
      dataDB.name = user.name;
      dataDB.table = user.table;
      dataDB._id = user._id;

      dataDB.gen_card = true;

      this._apiMongo._create(env.COLLECTION.party, this.key_table, user.key, dataDB, true)
        .subscribe(res => {
          console.log('RESPUESTA DE GUARDADO', res);

        })
    });
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
    }else this.listSelect = [];
  }

  pdfObj = null;

  genCards() {

    this.listSelect

    if(this.listSelect.length==0) return;


    let contenido: any = [
      {
        columns: []
      }
    ];


    contenido.push({ text: 'Tarjetas de identidad - COOPECAN', alignment: 'center', margin: [10, 10], fontSize: 16, bold: true });

    let count = 0;
    this.listSelect.forEach(card => {

      let container = document.getElementById(card._id);
      domtoimage.toJpeg(container).then(dataUrl => {
        var img = new Image();
        img.src = dataUrl;
        contenido.push({ image: img.src, width: 262, margin: [10, 10] });
        count++;
        if (count == this.listSelect.length) {
          const docDefinition = {
            content: contenido
          }
          this.pdfObj = pdfMake.createPdf(docDefinition);
          this.pdfObj.download();
        }
      });

    });

    this.updateUsers();
  }


  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }

}
