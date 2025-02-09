const ENDPOINTS = {
    USUARIO_LOGIN: '/login/do',
    USUARIO_RECUPERAR_SENHA: '/login/recover',
    USUARIO_CADASTRO: '/usuario/create',
    USUARIO_GET: '/usuario/get',
    USUARIO_VALIDAR_CPF: '/usuario/validate/cpf',

    TOKEN_VALIDAR: '/token/sendToken',
    TOKEN_CHECK: '/token/isValidToken',

    NIVEL_GET: '/nivel-habilidade/list',
    NIVEL_POST: '/nivel-habilidade/create',

    TIPO_EVENTO_GET: '/tipo-evento/list',
    TIPO_EVENTO_POST: '/tipo-evento/create',

    EVENTO_GET: '/evento/list',
    EVENTO_GET_BY_RADIUS: '/evento/listByRadius',
    EVENTO_GET_BY_ID: '/evento/get',
    EVENTO_POST: '/evento/create',
    EVENTO_PUT: '/evento/update',

    ENDERECO_CEP_GET: '/endereco/getByCep',
    ENDERECO_VIACEP_GET: 'https://viacep.com.br/ws/',
    ENDERECO_LAT_LONG_GET: '/endereco/getLatAndLonByCepAndNumber',
    ENDERECO_CEP_BY_LAT_LONG_GET: '/endereco/getCepByLatAndLon',

} as const;

export default ENDPOINTS;



