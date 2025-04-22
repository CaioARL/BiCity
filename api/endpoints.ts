const ENDPOINTS = {
    USUARIO_LOGIN: '/login/',
    USUARIO_RECUPERAR_SENHA: '/login/recover',
    USUARIO_CADASTRO: '/usuario',
    USUARIO_PUT: '/usuario/',
    USUARIO_GET: '/usuario/',
    USUARIO: '/usuario',
    USUARIO_VALIDAR_CPF: '/usuario/cpf/validate',
    USUARIO_VALIDAR_CNPJ: '/empresa/is/active/cnpj',
    USUARIO_VALIDAR: '/usuario/validate',
    USUARIO_GET_IMAGE: '/usuario/foto/file',

    PROBLEMA_GET_BY_RADIUS: '/problema/radius',
    PROBLEMA_GET_BY_ID: '/problema/',
    PROBLEMA_POST: '/problema/',    
    PROBLEMA_GET: '/problema/',
    PROBLEMA_CHECK: '/problema/check',    
    
    TIPO_PROBLEMA_GET: '/tipo/problema/',

    AVALIACAO_INFRAESTRUTURA: '/avaliacao/infraestrutura/',
    AVALIACAO_GET: '/avaliacoes',
    AVALIACAO_POST: '/avaliacao/avaliar',


    TOKEN_VALIDAR: '/token/',
    TOKEN_CHECK: '/token/validate',

    NIVEL_GET: '/nivel/habilidade/',
    NIVEL_POST: '/nivel/habilidade/create',

    TIPO_EVENTO_GET: '/tipo/evento/',
    TIPO_EVENTO_POST: '/tipo/evento/',


    EVENTO_GET: '/evento/',
    EVENTO_GET_BY_RADIUS: '/evento/radius',
    EVENTO_GET_BY_ID: '/evento/',
    EVENTO_POST: '/evento/',
    EVENTO_PUT: '/evento/',
    EVENTO_GET_BY_USUARIO: '/evento/usuario/',

    ENDERECO_CEP_GET: '/endereco/get/by/cep',
    ENDERECO_VIACEP_GET: 'https://viacep.com.br/ws/',
    ENDERECO_LAT_LONG_GET: '/endereco/get/LatAndLon/by/cepAndNumber',
    ENDERECO_CEP_BY_LAT_LONG_GET: '/endereco/get/cep/by/LatAndLon',


    INFRAESTRUTURA_GET: '/infraestrutura/geojson',


} as const;

export default ENDPOINTS;



