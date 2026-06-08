# Especificação Técnica e Funcional: HelpDesk IFAL

## 1. Apresentação do Projeto

### O Problema
O IFAL enfrenta dificuldades para gerenciar chamados e suporte técnico de forma centralizada: solicitações são recebidas por canais dispersos (e‑mail, telefone, WhatsApp), sem histórico consolidado, priorização ou métricas. Isso causa atraso no atendimento, retrabalho, perda de informação e dificuldade de avaliação do desempenho da equipe técnica. Uma ferramenta de helpdesk centralizada padroniza registro, rastreamento e resolução de chamados, melhorando SLA, transparência e eficiência para alunos, professores e técnicos.

### Escopo do Projeto
* **O que está incluído:**
  * **Tela de login integrada:** Autenticação via Supabase restrita estritamente ao e-mail institucional do IFAL (`@ifal.edu.br` ou `@aluno.ifal.edu.br`).
  * **Dashboard de métricas:** Chamados abertos/fechados, tempos médios e prioridades.
  * **Abertura de chamados com Assistência de IA:** Formulário com categoria, descrição e anexos. Conta com um assistente de IA integrado que analisa a descrição em tempo real para sugerir a categoria correta e sugerir soluções rápidas antes do envio.
  * **Interação e Histórico:** Chat e linha do tempo dentro do chamado para interação direta entre o solicitante e o técnico através de comentários.
  * **Listagem de chamados:** Filtros por status, prioridade e solicitante.
  * **Visualização de detalhes do chamado:** Histórico de comentários, anexos e mudanças de status (Pendente, Em Andamento, Resolvido).
  * **Página da equipe:** Contatos, responsabilidades e atribuições.
  * **Integração com banco de dados Supabase:** Autenticação, tabelas e storage para anexos.

* **O que está excluído:**
  * Aplicativo mobile nativo (apenas responsividade web será considerada).
  * IA 100% autônoma que fecha chamados sozinha (a IA apenas auxilia o usuário e o técnico, mas a resolução final é humana).

* **Limitações conhecidas:**
  * Dependência de conexão com internet para acesso ao Supabase e APIs de IA.
  * Tentativas de cadastro com e-mails comerciais comuns (Gmail, Outlook) serão bloqueadas na validação.

---

## 2. Histórias de Usuário e Fluxos

* **Como Aluno ou Servidor (Solicitante), eu quero logar apenas com meu e-mail institucional para garantir a segurança e autenticidade do sistema.**
  * *Critérios de aceitação:* A tela de login valida se o domínio é corporativo do IFAL. Se for um e-mail externo, exibe uma mensagem de erro e bloqueia o acesso.

* **Como Aluno, eu quero abrir um chamado contando com a ajuda da IA para que minha solicitação vá para o setor certo mais rápido.**
  * *Critérios de aceitação:* Ao digitar a descrição do problema, a IA gera automaticamente uma sugestão de "Categoria/Tags". Existe a opção de anexar arquivos de evidência. O chamado recebe ID, timestamp e status inicial "Pendente".

* **Como Técnico de Suporte, eu quero interagir com o solicitante e alterar o status do chamado para indicar o progresso do atendimento.**
  * *Critérios de aceitação:* O técnico interage enviando comentários/respostas na página do chamado. Ao mudar o status (ex: para Em andamento ou Resolvido), o sistema registra o autor e o timestamp no histórico do chamado.

* **Como Solicitante ou Técnico, eu quero utilizar a interface de comentários para responder e tirar dúvidas sobre o chamado.**
  * *Critérios de aceitação:* Uma aba de interações permite uma conversa em formato de linha do tempo (estilo chat de suporte), onde ambas as partes trocam mensagens até a resolução do problema.

* **Como Coordenador, eu quero ver um dashboard de métricas para priorizar alocação de recursos.**
  * *Critérios de aceitação:* Dashboard mostra número de chamados abertos/fechados, tempo médio de resolução e chamados por prioridade.

---

## 3. Arquitetura e Tecnologias

### Visão geral em camadas
* **Frontend:** Páginas HTML5 estáticas, estilizadas com CSS3/Tailwind. Interatividade com JavaScript (ES6+), consumo das APIs do Supabase via `supabase-js` e integração com API de Inteligência Artificial para análise de texto.
* **Backend & Banco de Dados:** Serviço Serverless oferecido pelo Supabase (PostgreSQL). Regras de Validação (Triggers/Policies): Filtro no banco de dados para rejeitar qualquer criação de usuário cujo e-mail não termine com os sufixos institucionais do IFAL. Regras RLS (Row Level Security) para controlar acesso (usuários comuns só interagem em seus próprios chamados; técnicos acessam todos).

### Fluxo de Funcionamento (Como o negócio funciona na prática)
1. **Autenticação Institucional:** O usuário (aluno/técnico) acessa a tela de login e insere suas credenciais. O sistema valida via Supabase Auth se o e-mail pertence ao domínio do IFAL. Se sim, o acesso é liberado.
2. **Abertura de Chamado com Auxílio de IA:** O aluno preenche o formulário. Conforme escreve a descrição, a IA analisa o texto e autocompõe as melhores tags/categorias. O aluno revisa, anexa arquivos se necessário e envia. O chamado entra como *Pendente*.
3. **Triagem e Atendimento do Técnico:** O técnico visualiza o chamado no painel, altera o status para *Em Andamento* (o que fica registrado no histórico) e assume o caso.
4. **Interação e Conversa:** Técnico e aluno utilizam o campo de comentários interno do chamado para conversar, tirar dúvidas e enviar novas informações, funcionando como um canal direto e centralizado.
5. **Resolução e Fechamento:** Após solucionar o problema, o técnico insere o parecer final, muda o status para *Resolvido* e o dashboard do coordenador atualiza as métricas de desempenho em tempo real.

---

## 4. Pilha Tecnológica e Justificativa

* **Tecnologias listadas:**
  * HTML5, CSS3, Tailwind CSS — Interface limpa e responsiva.
  * JavaScript (ES6+) — Consumo do Supabase e requisições da IA.
  * Supabase (Autenticação, PostgreSQL, Storage) — Backend gerenciado e controle de acesso estrito (RLS).
  * API de IA (Ex: OpenAI/Gemini API) — Motor de inteligência para categorização de chamados.

* **Justificativa:**
  * **Segurança Institucional:** O Supabase permite criar regras direto no banco (triggers) que impedem cadastros externos, blindando o sistema.
  * **Agilidade com IA:** A inclusão de uma API de IA leve no frontend resolve o problema de chamados categorizados erroneamente sem inflar o custo de desenvolvimento.
  * **Centralização da comunicação:** Substituir o e-mail/WhatsApp por uma aba de comentários atrelada ao ID do chamado garante auditoria, eficácia e histórico para a gestão do IFAL.
 
  * ---

## 5. Roadmap (Próximos Passos)

### Planejamento de Evolução do Sistema

O sistema HelpDesk foi desenvolvido de forma modular, permitindo a adição de novas funcionalidades conforme as necessidades da instituição. As próximas versões previstas incluem:

### Fase 1: Notificações por E-mail

* **Objetivo:** Melhorar a comunicação com os usuários.
* **Funcionalidade:** Envio automático de e-mails sempre que houver alteração no status do chamado.
* **Benefícios:**
  - Acompanhamento em tempo real do atendimento.
  - Redução da necessidade de acessar constantemente a plataforma.
  - Maior transparência no processo de suporte.

### Fase 2: Dashboard e Gráficos de Desempenho

* **Objetivo:** Fornecer indicadores para gestão dos atendimentos.
* **Funcionalidade:** Criação de um painel administrativo com gráficos e métricas.
* **Indicadores previstos:**
  - Quantidade de chamados abertos e resolvidos.
  - Tempo médio de atendimento.
  - Desempenho individual dos técnicos.
  - Volume de demandas por categoria.
* **Benefícios:**
  - Melhor acompanhamento da equipe.
  - Apoio à tomada de decisões.
  - Identificação de gargalos nos atendimentos.

### Fase 3: Chat Interno em Tempo Real

* **Objetivo:** Centralizar a comunicação entre usuário e técnico.
* **Funcionalidade:** Implementação de um sistema de mensagens integrado ao chamado.
* **Benefícios:**
  - Comunicação mais rápida.
  - Registro completo das conversas.
  - Maior eficiência na resolução de problemas.
  - Redução da dependência de aplicativos externos.

### Perspectivas Futuras

* Integração com aplicativos móveis.
* Sistema de avaliações de atendimento.
* Geração automática de relatórios gerenciais.
* Uso ampliado de Inteligência Artificial para sugestões de soluções e respostas automáticas.

---
