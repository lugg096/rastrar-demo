import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-conctact',
  templateUrl: './conctact.component.html',
  styleUrls: ['./conctact.component.scss'],
})
export class ConctactComponent implements OnInit {

  constructor() { }

  @Input() data: any;
  @Input() user: any;
  @Input() viewDemo_pre: any;


  credSub: any = {
    portada: '',
    producers: [],
    sections: []
  };

  dataContact: any = {

    
    "businessName": {
      "width_bootstrap": "col-6",
      "name": "Descripción del negocio",
      "type": "input",
      "code": "businessName",
      "value": ""
  },

    "businessDesc": {
        "width_bootstrap": "col-6",
        "name": "Descripción del negocio",
        "type": "input",
        "code": "businessDesc",
        "value": ""
    },
    "logoUrl": {
        "width_bootstrap": "col-6",
        "name": "Logo de negocio",
        "type": "input",
        "code": "logoUrl",
        "value": ""
    },
    "facebook": {
        "width_bootstrap": "col-6",
        "name": "Facebook",
        "type": "input",
        "code": "facebook",
        "value": ""
    },
    "instagram": {
        "width_bootstrap": "col-6",
        "name": "Instagram",
        "type": "input",
        "code": "instagram",
        "value": ""
    },
    "linkedin": {
        "width_bootstrap": "col-6",
        "name": "Linkedin",
        "type": "input",
        "code": "linkedin",
        "value": ""
    },
    "youtube": {
        "width_bootstrap": "col-6",
        "name": "Youtube",
        "type": "input",
        "code": "youtube",
        "value": ""
    },
    "correo": {
        "width_bootstrap": "col-6",
        "name": "Correo",
        "type": "input",
        "code": "correo",
        "value": "prueba@gmai.com"
    },
    "web": {
        "width_bootstrap": "col-6",
        "name": "Pagina web oficial",
        "type": "input",
        "code": "web",
        "value": "http://www.nescafe.com.pe/"
    }
}


  ngOnInit() {
    console.log('data', this.data);
    console.log('user', this.user);
    console.log('viewDemo_pre', this.viewDemo_pre);

    this.credSub = this.data.data.dataCred.credential.verifiableCredential[0].credentialSubject;
    console.log('credSub', this.credSub);

    this.init()
  }

  init() {
    let sections = this.data.data.dataCred.credential.verifiableCredential[0].credentialSubject.sections;
    let jsonData: any = {}
    sections.forEach(sec => {
      if (sec.section.code == 'contact') {

        for (let index = 0; index < sec.fields.length; index++) {
          const field = sec.fields[index];
          jsonData[field.code] = field
          if (index == (sec.fields.length - 1)){
          this.dataContact = jsonData;
            console.log('this.dataContact',this.dataContact);
          } 
        }


      }

    });

    for (let index = 0; index < sections.length; index++) {
      let sec = sections[index];

      console.log('credSub', this.credSub);

    }

  }

}
