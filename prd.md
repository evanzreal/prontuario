# Documento de Requisitos do Produto (PRD)

## 1. Visão Geral do Produto
**Nome do Produto:** [Nome do seu PWA – a definir]
**Descrição:** Um Progressive Web App (PWA) desenvolvido para psicólogos, que permite gravar áudios de sessões, enviá-los a um webhook conectado a um agente de IA para transcrição e modelagem em um formato de prontuário pré-definido, e armazenar o prontuário finalizado de forma segura no Google Drive ou Google Planilhas.
**Objetivo:** Automatizar e simplificar a documentação de sessões de psicoterapia, garantindo segurança, eficiência e conformidade com padrões de proteção de dados.

## 2. Público-Alvo
**Usuários Principais:** Psicólogos que buscam uma solução prática e segura para registrar e organizar suas sessões.
**Necessidades dos Usuários:**
- Interface simples e intuitiva.
- Processamento rápido de áudios e transcrições.
- Armazenamento seguro de informações sensíveis.
- Integração com ferramentas confiáveis, como Google Drive ou Google Planilhas.

## 3. Requisitos Funcionais

### 3.1. Fluxo de Primeiro Acesso
**Abrir App:**
- O usuário acessa o PWA por meio de um navegador.
- O app deve ser responsivo, funcionando em dispositivos móveis e desktops.

**Página de Boas-Vindas:**
- Exibe uma mensagem introdutória explicando o propósito do aplicativo.
- Inclui um botão para iniciar o processo de login.

**Login com Google:**
- Autenticação segura via Google OAuth 2.0.
- Apenas usuários autenticados podem prosseguir.

**Escolher Formato de Prontuário:**
- Apresenta uma lista de formatos de prontuário pré-definidos.
- Permite ao usuário selecionar um formato padrão para suas transcrições.

**Gravar e Enviar Áudio:**
- Interface para gravação de áudio diretamente no app, com opções para pausar, reiniciar ou finalizar.
- O áudio é convertido para o formato compatível com o WhatsApp (ex.: Opus ou MP3).
- Após a gravação, o áudio é enviado ao webhook especificado.

**Receber a Transcrição no Modelo Correto:**
- O agente de IA (via webhook) transcreve o áudio e formata a transcrição no modelo de prontuário escolhido.
- A transcrição formatada é exibida no app para revisão.

**Aprovar Transcrição e Enviar para o Banco de Dados:**
- O usuário pode revisar e editar a transcrição, se necessário.
- Um botão de aprovação finaliza o processo.
- O prontuário é enviado ao Google Drive ou Google Planilhas, conforme configurado.

### 3.2. Fluxo de Acesso Cotidiano
**Abrir App:**
- Se o usuário já estiver logado (mantendo a sessão ativa), o app redireciona diretamente para a página principal.
- Caso contrário, exibe a página de login.

**Página Principal:**
- Exibe um botão para iniciar uma nova gravação.
- (Opcional: mostrar histórico de prontuários, se desejado no futuro.)

**Gravar e Enviar Áudio:**
- Segue o mesmo processo do fluxo de primeiro acesso.

**Receber a Transcrição no Modelo Correto:**
- Segue o mesmo processo do fluxo de primeiro acesso.

**Aprovar Transcrição e Enviar para o Banco de Dados:**
- Segue o mesmo processo do fluxo de primeiro acesso.

## 4. Requisitos Não Funcionais
**Segurança:**
- Criptografia de ponta a ponta para áudios e transcrições.
- Comunicação via HTTPS em todas as interações.
- Não armazenar dados sensíveis (áudios ou transcrições) localmente após o envio.
- Conformidade com regulamentações como LGPD (Brasil) ou GDPR (se aplicável).

**Desempenho:**
- Carregamento rápido e leve, mesmo em conexões lentas.
- Processamento eficiente de gravações e envio de áudios.

**Usabilidade:**
- Interface intuitiva, amigável para usuários não técnicos.
- Design responsivo adaptado a diferentes tamanhos de tela.

**Confiabilidade:**
- Garantir que os áudios sejam enviados e transcritos sem erros.
- Implementar retries automáticos em caso de falhas de conexão.

## 5. Integrações
- Google OAuth: Autenticação segura do usuário.
- Webhook: Envio de áudios para o agente de IA.
- Google Drive ou Google Planilhas: Armazenamento dos prontuários finalizados.
- Agente de IA: Transcrição e modelagem dos áudios no formato escolhido.

## 6. Considerações de Segurança
**Autenticação e Autorização:**
- Apenas usuários autenticados via Google podem acessar o app.
- Tokens de autenticação armazenados de forma segura (ex.: cookies HttpOnly ou local storage criptografado).

**Proteção de Dados:**
- Áudios e transcrições não devem ser mantidos em metadados ou caches após o envio.
- Dados em trânsito e em repouso devem ser criptografados.
- O webhook e o agente de IA devem seguir padrões de segurança equivalentes.

**Privacidade:**
- Coletar apenas os dados necessários para o funcionamento do app.
- Oferecer opção para o usuário excluir seus prontuários, se desejar.

## 7. Fluxo de Dados
1. O psicólogo grava o áudio no PWA.
2. O áudio é enviado ao webhook no formato compatível com o WhatsApp.
3. O webhook repassa o áudio ao agente de IA.
4. O agente de IA transcreve o áudio e modela a transcrição no formato de prontuário selecionado.
5. A transcrição formatada retorna ao PWA.
6. O psicólogo revisa, aprova ou edita a transcrição.
7. O prontuário finalizado é enviado ao Google Drive ou Google Planilhas.

## 8. Requisitos Técnicos
**Frontend:** PWA construído com HTML, CSS e JavaScript (ex.: frameworks como React ou Vue.js).
**Backend:** Necessário para gerenciar autenticação, integrações com Google APIs e comunicação com o webhook.
**APIs:**
- Google OAuth API para login.
- Google Drive API ou Google Sheets API para armazenamento.
- Webhook para interação com o agente de IA.

## 9. Próximos Passos
1. Definir os formatos de prontuário disponíveis para escolha.
2. Especificar detalhes técnicos do webhook e do agente de IA.
3. Criar protótipos da interface para validação com usuários.
4. Planejar a arquitetura do sistema e escolher tecnologias específicas. 