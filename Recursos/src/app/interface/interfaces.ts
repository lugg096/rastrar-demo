export class User {
  id?: number;

  key: string;
  name: string;
  status: string;

  pin: string;
  publicKey: string;
  privateKey: string;//encriptada
  did: string;
  email: string;
  grupo: string;
  idens: string;
  password: string;
  phone: string;
  properties: string;
  role: string;
  screens: string;

  constructor() {
    this.pin = ''; this.publicKey = ''; this.privateKey = '';
    this.status = ''; this.key = ''; this.name = ''; this.did = '';
    this.email = ''; this.grupo = ''; this.idens = ''; this.password = '';
    this.phone = ''; this.properties = ''; this.role = ''; this.screens = '';
  }
}

export class UserUpdate {
  id?: number;
  key: string;
  name: string;
  status: string;
  did: string;
  email: string;
  grupo: string;
  idens: string;
  phone: string;
  properties: string;
  role: string;

  constructor() {
    this.status = ''; this.key = ''; this.name = ''; this.did = '';
    this.email = ''; this.grupo = ''; this.idens = '';
    this.phone = ''; this.properties = ''; this.role = '';
  }
}

export class Screen {
  id?: number;

  key: string;
  name: string;
  status: string;

  action: string;
  certificateType: string;
  fields: string;
  description: string;
  imagenUrl: string;
  user: string;

  constructor() {
    this.key = ''; this.name = ''; this.status = '';
    this.action = ''; this.certificateType = ''; this.fields = '';
    this.description = ''; this.imagenUrl = ''; this.user = '';
  }
}

export interface Parameter {
  id?: number,
  code: string,
  name: string,
  grupo: string,//GROUP palabra clave sqlite
  value: string
}

export interface Image {
  id?: number,
  id_cert: string,
  path: string,
  nameFile: string,
  webPath: string,
  status_upload: number,
  status: number
}


export interface QR {
  id?: string,
  desc: string,
  objective_cert: string,
  f_emision: string,
  f_vencimineto: string,
  trxid: string,
  imgTypeSreen: string,
  emisor_ident: string,
  dataCredential: string,
  status: string
}

export interface Certificado {
  id?: number,
  code: string,
  codeReg: string,
  title: string,
  frecord: string,
  fsend: string,
  data: string,
  emisor_did: string,
  emisor_name: string,
  emisor_role: string,
  tx?: string,
  status: number,
  contract_card: string,
  code_card: string,
  certificateType: string,
  code_almc: string,
  f_emision: string,
  objective_cert: string
}