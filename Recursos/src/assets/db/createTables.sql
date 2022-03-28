CREATE TABLE IF NOT EXISTS user(
    pin TEXT,
    publicKey TEXT,
    privateKey TEXT,
    status TEXT,
    key TEXT PRIMARY KEY,
    name TEXT,
    did TEXT,
    email TEXT,
    grupo TEXT,
    idens TEXT,
    password TEXT,
    phone TEXT,
    screens TEXT,
    properties TEXT,
    role TEXT
);
CREATE TABLE IF NOT EXISTS screen(
    key TEXT PRIMARY KEY,
    name TEXT,
    status TEXT,
    action TEXT,
    certificateType TEXT,
    description TEXT,
    imagenUrl TEXT,
    fields TEXT,
    user TEXT
);
CREATE TABLE IF NOT EXISTS parameter(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT,
    name TEXT,
    grupo TEXT,
    valor TEXT,
    status INTEGER
);
CREATE TABLE IF NOT EXISTS qr(
    id TEXT PRIMARY KEY,
    desc TEXT,
    objective_cert TEXT,
    f_emision TEXT,
    f_vencimineto TEXT,
    trxid TEXT,
    imgTypeSreen TEXT,
    emisor_ident TEXT,
    dataCredential TEXT,
    status INTEGER
);
CREATE TABLE IF NOT EXISTS certificado(
    id TEXT PRIMARY KEY,
    code TEXT,
    codeReg TEXT,
    title TEXT,
    objective_cert TEXT,
    frecord TEXT,
    fsend TEXT,
    data TEXT,
    dataScreen TEXT,
    emisor_did TEXT,
    emisor_name TEXT,
    emisor_role TEXT,
    emisor_ident TEXT,
    titular_name TEXT,
    titular_adrx TEXT,
    tx TEXT,
    contract_card TEXT,
    code_card TEXT,
    certificateType TEXT,
    code_almc TEXT,
    f_emision TEXT,
    img_cert TEXT,
    img_ipfs TEXT,
    status INTEGER
);
CREATE TABLE IF NOT EXISTS images(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cert TEXT,
    path TEXT,
    nameFile TEXT,
    webPath TEXT,
    status_upload INTEGER,
    status INTEGER
);