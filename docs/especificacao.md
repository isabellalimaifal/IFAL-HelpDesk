# Especificação do Sistema — IFAL-HelpDesk

## 1. Apresentação do Projeto

- **O Problema (5%):**  
  O IFAL enfrenta dificuldades para gerenciar chamados e suporte técnico de forma centralizada: solicitações são recebidas por canais dispersos (e‑mail, telefone, WhatsApp), sem histórico consolidado, priorização ou métricas. Isso causa atraso no atendimento, retrabalho, perda de informação e dificuldade de avaliação do desempenho da equipe técnica. Uma ferramenta de helpdesk centralizada padroniza registro, rastreamento e resolução de chamados, melhorando SLA, transparência e eficiência para alunos, professores e técnicos.

- **Escopo do Projeto (5%):**  
  - O que está incluído:
    - Tela de login (autenticação via Supabase).
    - Dashboard de métricas (chamados abertos/fechados, tempos médios, prioridades).
    - Abertura de chamados (formulário com categoria, descrição, anexos opcionais).
    - Listagem de chamados (filtros por status, prioridade e solicitante).
    - Visualização de detalhes do chamado (histórico de comentários, anexos, mudanças de status).
    - Página da equipe (contatos, responsabilidades e atribuições).
    - Integração com banco de dados Supabase (autenticação, tabelas e storage para anexos).
  - O que está excluído:
    - Sistema de chat em tempo real (ex.: websocket / WebRTC).
    - Aplicativo mobile nativo (apenas responsividade web será considerada).
    - IA autônoma para resolução de chamados (assistentes automáticos não implementados).
  - Limitações conhecidas:
    - Dependência de conexão com internet para acesso ao Supabase.
    - Autenticação simplificada (fluxo básico JWT/session gerenciado pelo Supabase).
    - Escopo MVP focado em funcionalidades CRUD e métricas básicas, sem alta disponibilidade nem redundância avançada.

## 2. Histórias de Usuário e Fluxos (10%)

1) Como Aluno, eu quero abrir um chamado para que eu receba suporte técnico e tenha registro do histórico.  
   - Critérios de aceitação:
     - Existe formulário com título, categoria, descrição e opção de anexar arquivo.
     - Chamado criado aparece imediatamente na listagem do solicitante.
     - Chamado recebe ID, timestamp e status "Aberto".

2) Como Técnico de Suporte, eu quero alterar o status de um chamado para que eu possa indicar progresso (Em andamento, Pendente, Resolvido).  
   - Critérios de aceitação:
     - Técnico autenticado pode alterar status e adicionar comentário.
     - Mudança de status registra usuário e timestamp no histórico.
     - Dashboard reflete alteração na métrica de chamados por status.

3) Como Coordenador, eu quero ver um dashboard de métricas para priorizar alocação de recursos.  
   - Critérios de aceitação:
     - Dashboard mostra número de chamados abertos/fechados, tempo médio de resolução e chamados por prioridade.
     - É possível filtrar métricas por período (última semana/mês).

4) Como Membro da Equipe, eu quero listar e filtrar chamados para encontrar rapidamente solicitações relevantes.  
   - Critérios de aceitação:
     - Listagem com filtros por status, prioridade, solicitante, e busca por texto.
     - Paginação ou lazy-loading para grandes volumes.

5) Como Solicitante, eu quero visualizar o histórico completo do meu chamado para acompanhar o progresso e os comentários.  
   - Critérios de aceitação:
     - Página de detalhes exibe todas as interações, anexos e alterações de status ordenadas por data.

## 3. Arquitetura e Tecnologias (15%)

- Visão geral em camadas:
  - Frontend:
    - Páginas HTML5 estáticas, estilizadas com CSS3/Tailwind.
    - Interatividade com JavaScript (ES6+), consumo das APIs do Supabase via supabase-js.
    - Estrutura SPA simples (rotas client-side leves) ou páginas multipáginas estáticas conforme necessidade.
  - Backend:
    - Serviço Serverless oferecido pelo Supabase (autenticação, policies e RPCs via PostgreSQL).
    - Lógica serverless mínima (edge functions ou stored procedures) para operações sensíveis se necessário.
    - Node.js usado como ambiente de desenvolvimento e scripts auxiliares (seed, migrations locais).
  - Banco de Dados:
    - PostgreSQL gerenciado pelo Supabase.
    - Tabelas principais: users, chamados (tickets), comentarios, anexos, equipes, categorias.
    - Regras RLS (Row Level Security) e policies para controlar acesso (ex.: usuários só veem seus próprios chamados a menos que sejam técnicos).
- Integração com Supabase:
  - Arquivos de configuração sugeridos:
    - supabase-config.js — inicializa o cliente supabase com variáveis de ambiente (URL e PUBLIC/SECRET keys).
    - seed-data.js — script Node.js para popular tabelas iniciais (categorias, roles, usuário admin).
  - Fluxo de autenticação:
    - Frontend usa supabase.auth.signInWithPassword / signUp; tokens gerenciados pelo SDK.
    - Regras RLS aplicadas no banco para limitar operações por usuário/role.
  - Armazenamento de arquivos:
    - Supabase Storage para anexos; policies que só permitem acesso autenticado e links temporários para downloads.

## 4. Pilha Tecnológica e Justificativa (10%)

- Tecnologias listadas:
  - HTML5, CSS3, Tailwind CSS (opcional) — markup e estilo.
  - JavaScript (ES6+) — lógica no cliente, chamadas ao Supabase.
  - Supabase (Autenticação, PostgreSQL, Storage, Edge Functions) — backend gerenciado.
  - Node.js — ambiente para scripts de desenvolvimento (seed, lint, build) e possível execução local.
  - Docker — ambiente de desenvolvimento reproducível (opcional para supabase local).
- Justificativa:
  - Facilidade de deploy: app composto por arquivos estáticos que consomem Supabase simplifica deploy em serviços estáticos (Netlify, Vercel, GitHub Pages com CORS configurado).
  - Desenvolvimento ágil: usar Supabase elimina a necessidade de construir e operar um backend completo; permite focar na UX e regras de negócio.
  - Escalabilidade inicial: PostgreSQL gerenciado e Storage do Supabase suportam crescimento sem infra pesada.
  - Adequado para MVP: rápido para entregar com autenticação, regras de acesso e storage prontos; reduz complexidade operacional.

--- 

Anexos técnicos sugeridos (não incluídos aqui):
- Exemplo de supabase-config.js (uso de process.env.SUPABASE_URL e SUPABASE_KEY).
- seed-data.js para popular categorias, roles e um usuário admin.
- Esquema ER simplificado das tabelas principais.

Observação: documento gerado para uso como especificação funcional e técnica inicial; deverá ser revisado com stakeholders para detalhamento de requisitos não funcionais, SLAs e políticas de segurança.
