
export const environment = {
  production: true,

  url: 'http://18.230.79.100:8082/',
  url2:'http://18.230.79.100:8082',

  url_STAMP: 'http://18.230.79.100:8085/',
  node: 'http://34.229.8.55:4545',

  ct: {
    contract: '',
    c_vc: '0xBf6303A23Be21bcE1B561017fA4fcdA851C46633',
    c_did: '0x56537ec50C9cE4fA1B63eC3A5AFDF9D51C950cE1',
    addressFrom: '0x771971F5841bC4E7caa2CE160fb1e66b81c7f0e6',//?
    privateKey: 'ec98753d154ea984d7c3fa1a2b939c2c6b6a51a756eb7960b1f6030eafa7e3a8'
  },
  

  /* TIPOS DE OPERACION */
  TIPO_OPERACION_ADD_DID: "addDID",
  TIPO_OPERACION_REVOKE_DID: "revokeDID",
  TIPO_OPERACION_ENABLE_DID: "enableDID",
  TIPO_OPERACION_GET_DID: "getDID",


  FOLDER_CERT: 'CERT_COOPECAN',

  auth_token: 'eyJhbGciOiJFQ0RTQSIsICJ0eXAiOiAiRVRIU0lHTiJ9.eyJpYXQiOjE2MTYyNzU4NTQxMDYsImV4cCI6MjUxNjE2Mjc1ODU0MTA2LCJkYXRhIjp7InNlY3JldF9ib2xldGgiOiJzZWNyZXRvMyIsInNlcnZlcl9pZCI6IjB4MTI0NTJBNGEyYTVEMWE0RmQyMmRhMDRmQjI1NDBDMENEMEY4NjliRiIsImNvbnRyYWN0IjoiMHg2QjVBM0JmN2NDRDlmMkZFMThDQjA2ZTZkMDEwOUYwYWVFOWFhYUQwIiwiY2xpZW50X2lkIjoiMHhkZmMwRUJiYTdGYzJmMzlGNkE3OTk4MzAzMkM4NkZFNDU3QzlEMDcwIn19.MHg4MDMyNmYxNjZmZmE0NjE1YmVjMDA2YzA4NGI2OTFjYjA1MTYxZjViZTZhMjAwYWM1MTZmMmFmZDM0NTNlMDk4NzA4MTg0OTI0MDkwZDJkOGYzNzBlOTdkZGQyYzYyNjU3YWRjZGJlZmE5NGRkOGEwOTY2MzE4MTQ1NmIwNGVhZjFj',
  auth_token_stamp:'eyJhbGciOiJFQ0RTQSIsICJ0eXAiOiAiRVRIU0lHTiJ3.eyJpYXQiOjE2MjYyOTIwMDQ2OTIsImV4cCI6MTcyNjI5MjAwNDY5MiwiZGF0YSI6eyJzZWNyZXRfYm9sZXRoIjoiVkFDVU5FIiwic2VydmVyX2lkIjoiMHg1RWQ0YTA5QkFhOTA2ODgzYzc0ODg5QjdkMjQyNjM3ZWQ2Rjg1MTBjIiwiY29udHJhY3QiOiIweGIzMTUxOTU1YTBGOTFGMzQwMjZGZjcwRURENzhjNjNmYzFhNmRCMjQiLCJjbGllbnRfaWQiOiIweDQzNGNhZGM5RUU1QzhDYTVCQzU0MEJiOTQ1NjExRTIwQzVhOTU3MTgifX0=.MHg2NWZmNjUyYzg0Y2I0MmZhYzg3NjMxOGI2MGI4ZTY5OGVlMWRmY2Y2NmFiNDFhZTQyNTBlMWYxY2E3MzVhYmRhN2UzNzIwN2E4Mjg3NWU3NmU2M2JiZjYxM2JkYjIxMDY4ZWJjMmVjOWVhMWI2NzFkNjY0MGU0NGYxZWMxZTQwNjFi',


  CREDENTIAL_APP: {
    client_id: "0xAeF5F9e6e63F711310e6122Ca12DD85d36910D1D",
    api_key: "0xf4ed4213624cadd343980c55da54257b10eb7d0f47255516868f58521553eb0f00977161b148bbcdca611a94f28e9c615cd1f762a1ca27bd7c32572dcb65400f1c",
    secret_shib: "0xd208de0792d2d7e6c96078c9fdc5f323bb9b5d11",
    domain_key: "0xf6ceb38bf0cab7d4a31bc3f4dd64814daf971c1653790487256313d761e50d13",
    contract: "0x8F6492b89137b79Ced4342D49F675Dc550B41AE5" //ContractVC 
  },

  /* ESTADOS DE CERTIFICADO */
  STATUS_REG: {
    DISABLED: 0,
    SAVED: 1,
    SIGNED: 2,
    UPLOADED: 3
  },

  /* TABLAS EN BD SQLITE  */
  TABLE: {
    USER: 'user',
    QR: 'qr',
    CERT: 'certificado',
    IMG: 'images',
    SCREEN: 'screen'
  },


  MSG: {

    TYPE_SUC: 'success',
    TYPE_ALERT: 'alert',
    TYPE_UPLOAD: 'upload',
    TYPE_SIGN: 'sign',
    TYPE_ERROR: 'danger',


    SUC_CREATE: 'El registro fue creado correctamente.',
    SUC_DELETE: 'El registro fue eliminado correctamente.',
    SUC_DISABLED: 'El registro fue deshabilitado correctamente.',
    SUC_ENABLED: 'El registro fue habilitado correctamente.',

    SUC_UPLOAD: 'Certificación completada correctamente.',
    SUC_SAVE: 'La información fue guardada correctamente.',
    SUC_UPDATE: 'La información fue actualizada correctamente.',

    ALERT_SAVE: 'Esta seguro en guardar información de certificado?',
    ALERT_UPDATE: 'Esta seguro en actualizar información de certificado?',
    ALERT_DELETE: 'Esta seguro de revocar esta identidad?',
    ALERT_EXIT_FORM: 'Esta seguro de salir del formulario sin guardar información?',

    ALERT_UPLOAD: 'Se usarán datos para esta acción. Esta seguro de continuar?',
    ERROR_SERV: 'Tuvimos problemas, vuelva a intentar por favor.',
    ERROR_GENERAL: 'Tuvimos problemas, vuelva a intentar por favor.',

    SUC_TITLE: 'Genial!',
    ALERT_TITLE: 'Alerta!',
    ERROR_TITLE: 'Error!',
  },



  /* Colecciones del sistema */
  COLLECTION: {
    tx: 'tx',
    party: 'party',
    resolve: 'resolve',
    screenUser: 'screenUser',
    general: 'general',
    object: 'object',
    document: 'document',
    trace: 'trace',
    traceDetail: 'traceDetail',
    monitor: 'monitor',
    merma: 'merma',
    credential:'credential'
  },


  /* Tablas del sistema */
  TABLE_SIS: {
    _config: '_config',

    role: 'role',
    tables: 'tables',
    type_user: 'type_user',
    type_doc_ident: 'type_doc_identity',
    g_clie: 'g_clie',
    g_empl: 'g_empl',
    g_prod: 'g_prod',


    employee: 'employee',
    producer: 'producer',
    customer: 'customer',

    action: 'action',
    orden: 'order',
    type_button: 'type_button',
    type_callToAction: 'type_callToAction',

    type_documents: 'type_documents',
    type_input: 'type_input',
    type_field: 'type_field',
    type_field_cert: 'type_field_cert',
    type_certificate: 'type_certificate',
    external: 'external',
    register: 'register',

    type_visibility: 'type_visibility',
    class_task: 'class_task',
    type_cert_register: 'type_cert_register',
    q_unid: 'unid_measure',
    type_product: 'type_product',
    type_via: 'type_via',
    country_source: 'country_source',
    country_target: 'country_target',
    airport: 'airport',
    seaports: 'seaports',
    type_quality: 'type_quality',

    field: 'field',
    task: 'task',
    process: 'process',
    screen: 'screen',
    report: 'report',
    traceDetail: 'traceDetail',


    DIDRegistry: 'DIDRegistry',
    VCRegistry: 'VCRegistry',
  },
};
