# Documento do Projeto — Projeto Cinema

Objetivo
- Sistema web estático (HTML + CSS + JS) para controlar filmes, salas, sessões e venda de ingressos.
- Dados persistidos em localStorage.
- UI baseada em Bootstrap para acelerar o desenvolvimento.

Estrutura de pastas proposta
- index.html
- DOCUMENTO_PROJETO.md
- css/
  - style.css            (estilos próprios)
  - bootstrap-override.css
- js/
  - app.js               (bootstrap da aplicação + inicialização)
  - api/
    - storage.js         (get/save localStorage)
    - filmesApi.js
    - sessoesApi.js
    - salasApi.js
    - vendasApi.js
  - ui/
    - filmesUi.js
    - sessoesUi.js
    - salasUi.js
    - vendasUi.js
  - components/
    - navbar.js
    - filmeCard.js
- pages:
  - filmes.html
  - sessoes.html
  - salas.html
  - vendas.html

Páginas principais e responsabilidades
- index.html: homepage com navegação (ficará fora das pastas).
- filmes.html: formulário para cadastro de filmes + lista (usa filmesUi.js + filmesApi.js).
- sessoes.html: criar / listar sessões (relacionar filme + sala).
- salas.html: cadastro/edição de salas (cadeiras, capacidade).
- vendas.html: escolher sessão e cadeiras, efetuar venda (atualiza vendas e marca assentos).

Boas práticas e interligação
- api/* contém funções puras para CRUD via localStorage (ex.: addFilm, getFilms).
- ui/* contém renderização e handlers (ex.: bind do form, render list).
- components/* contém elementos reutilizáveis (ex.: criação de card de filme, modal de seleção de assento).
- Cada página inclui: bootstrap (CDN), css/style.css, js/app.js (defer) e script específico da página que chama os módulos (defer).

Incluir Bootstrap (exemplo no head)
- Usar CDN (Bootstrap 5):
  - CSS: https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css
  - JS bundle (opcional, para components): https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js

Fluxo de trabalho / tarefas (sprint mínimo)
1. Estruturar pastas e mover app.js para js/app.js.
2. Criar storage.js com helper getData/saveData.
3. Implementar filmesApi.js e filmes.html (form + list).
4. Criar filmesUi.js para render e handlers.
5. Repetir para salas, sessões e vendas.
6. Testes manuais e ajustes de UX com Bootstrap.

Como rodar localmente
- Não tem build. Abra index.html no navegador ou:
  - VS Code: instalar Live Server → "Go Live".
  - Terminal (Windows): abrir pasta do projeto e executar:
    - npx serve
    - ou npx http-server
- Recarregue a página após mudanças em arquivos JS/CSS.

Exemplos rápidos de arquivos (ver diretório js/ api/ ui/):
- storage.js: funções getData / saveData.
- filmesApi.js: exporta addFilm, getFilms, removeFilm.
- filmesUi.js: captura form, chama filmesApi e renderiza lista.

Observações finais
- Trabalhe página a página; comece por filmes para ter a modelagem de dados.
- Mantenha APIs simples e pure functions para facilitar testes.
- Posso gerar os arquivos base (filmes.html, storage.js, filmesApi.js, filmesUi.js) para você — quer que eu crie esses arquivos agora?
