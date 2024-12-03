export const masks = {
  CPF (value : string) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }, 
  CNPJ (value : string) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  },
  PHONE (value : string) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
      .replace(/(-\d{4})\d+?$/, '$1')
  },
  PHONEDDI (value : string) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '+$1 $2')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
      .replace(/(-\d{4})\d+?$/, '$1')
  },
  CEP (value : string) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  },
  CEPINPUT (value : string) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{8})\d+?$/, '$1')
    },
  DATE (value : string) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{4})\d+?$/, '$1')
  },
  DATEWITHDASHES (value : string) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '$1-$2')
      .replace(/(-\d{2})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  },
  HOUR (value : string) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '$1:$2')
      .replace(/(:\d{2})\d+?$/, '$1')
  },
  NAME(value : string) {
    return value
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g,' ')
    .replace(/^\s+/g, '')
  },
  ADDRESS(value : string) {
    return value
    .replace(/[^a-zA-Z,-\d\s]/g, '')
    .replace(/\s+/g,' ')
    .replace(/^\s+/g, '')
  }




}
