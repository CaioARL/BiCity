const ENDPOINTS = {
    USUARIO_LOGIN: '/login/do',
    USUARIO_RECUPERAR_SENHA: '/login/recover',
    USUARIO_CADASTRO: '/usuario/create',
    USUARIO_GET: '/usuario/get',

    NIVEL_GET: '/nivel-habilidade/list',
    NIVEL_POST: '/nivel-habilidade/create',

    ENDERECO_CEP_GET: '/endereco/getByCep',
    ENDERECO_LAT_LONG_GET: '/endereco/getLatAndLonByCepAndNumber',

} as const;

export default ENDPOINTS;



