import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'


export default function Terms() {
  return (
    <ScrollView>
      <Text>Declaração de Política de Privacidade 
A aplicação desenvolvida pelos alunos do IFSP fornece aos usuários a possiblidade de 
avaliar as ciclovias, permitindo identificar as mais próximas, relatar problemas na via e 
acompanhar eventos relacionados ao ciclismo, ajudando a melhorar a experiência e 
segurança dos ciclistas na cidade de São Paulo.  
O presente documento tem como objetivo descrever o tratamento de dados através das 
operações de obtenção, armazenamento, transmissão, acesso e utilização responsável das 
informações pessoais dos Usuários que se cadastrarem na aplicação “BiCity” com base 
na Lei nº 13.709/2018 (Lei Geral de Proteção de Dados). 
Nós não tratamos dados pessoais sensíveis como orientação sexual, religião, origem 
racial, étnica, afiliações políticas, genética, de saúde ou qualquer outro que possa ser 
classificado como sensível ao decorrer do fluxo da aplicação. 
I. Definições 
BiCity: a aplicação e Controlador dos dados, mencionada ao decorrer do texto como 
“nós”, “nossa”. 
Usuário: qualquer pessoa física ou jurídica que estabeleça envio/fornecimento de 
informações.  Qualquer menção a “você”, “seu” ou “sua” também diz respeito ao Usuário. 
II. Dados de Cadastro 
Durante o cadastro são obrigatórios e essenciais os seguintes dados pessoais de Usuário: 
• Nome 
• Endereço Físico (Logradouro) 
• E-mail 
• CPF/CNPJ 
III. Finalidade dos Dados 
Dados como CPF/CNPJ, Nome e E-mail são utilizados para identificar você no sistema, 
oferecer suporte, auxiliar na prevenção de fraudes, contas duplicadas e envio de 
comunicações importantes como avisos, alterações e notificações. O seu Endereço Físico 
é utilizado para encontrar eventos próximos. 
IV. Armazenamento dos Dados 
Os dados que coletamos de você são armazenados em serviços de nuvem confiáveis de 
parceiros que podem estar localizados no Brasil ou em outros países que ofereçam serviço 
de armazenamento em nuvem confiáveis e usualmente utilizados por empresas de 
tecnologia, tais como Estados Unidos da América (EUA) e em países da América Latina 
e da Europa. 
V. Compartilhamento dos Dados 
Os seus dados pessoais coletados podem ser compartilhados nos seguintes casos: 
• Com terceiros que prestam serviços essenciais, como APIs e plataformas em 
nuvem, para o funcionamento do aplicativo; 
• Com as autoridades públicas judiciais ou administrativas em caso de requisição 
para finalidades legais. 
Nós não vendemos seus dados pessoais a terceiros com finalidades comerciais, nem 
mesmo de marketing, sem o seu consentimento prévio e expresso. 
VI. Exclusão de Responsabilidade Por Terceiros 
Nós não nos responsabilizamos pelos serviços prestados por terceiros após o Usuário ser 
direcionado através dos links contidos na plataforma, o qual ocorrerá por conta e risco do 
Usuário, inclusive os sites direcionados serão regidos pelos próprios Termos de Uso e 
Políticas de Privacidade destes sites os quais deverão ser lidos pelo Usuário. O Usuário 
será o único responsável por entender os termos e condições de contratação dos produtos 
e serviços que serão oferecidos/contratados a partir das simulações realizadas no Site ou 
nas Plataformas, conforme aplicável. 
VII. Direitos do Usuário  
• Solicitar acesso aos dados tratados; 
• Corrigir dados incompletos, inexatos ou desatualizados; 
• Ter os dados não essenciais anonimizados, bloqueados ou eliminados; 
• Opor-se ao tratamento de suas informações pessoais ou restringi-lo, quando 
aplicável. 
VIII. Deveres do Usuário 
O Usuário sempre deverá prezar pela veracidade e exatidão das informações por ele 
disponibilizadas, assim como pela guarda de sua senha de acesso. Também é de sua inteira 
responsabilidade providenciar o próprio acesso à Internet e pagar todas as taxas de serviço 
eventualmente cobradas por terceiros com relação a tal acesso, providenciar seu próprio 
acesso a um endereço para envio de mensagens eletrônicas e pagar todas as taxas de 
serviço eventualmente cobradas por terceiros com relação a tal acesso. 
IX. Alterações na Declaração 
Em caso de alteração nesta Declaração de Política de Privacidade, o Usuário será 
notificado através do e-mail cadastrado ou será posto um aviso em nossa aplicação. 
X. Consentimento 
AO CADASTRAR-SE NA NOSSA APLICAÇÃO VOCÊ CONCORDA EXPRESSA E 
INTEGRALMENTE COM ESTA DECLARAÇÃO DE POLÍTICA DE PRIVACIDADE, 
COMO CONDIÇÃO INDISPENSÁVEL À UTILIZAÇÃO DE SUAS 
FUNCIONALIDADES E SERVIÇOS EM TOTALIDADE. Se você NÃO 
CONCORDAR com algum dos termos você deve evitar qualquer uso de nossa aplicação. 
Data da Versão do Documento: 02 de Fevereiro de 2025  </Text>
        <CustomButton title="Aceitar" handlePress={() => {router.replace('sign-up')}} />
        <CustomButton title="Recusar" handlePress={() => {router.back()}} />    
    
    </ScrollView>
  )
}