# API Desafio Integração

API desenvolvida para simular o fluxo de integração entre **pedidos**, **documentos** e **exames**, considerando cenários em que essas informações podem chegar em momentos diferentes e precisam ser relacionadas corretamente.

A proposta foi manter a solução simples, funcional e fácil de validar, priorizando clareza de implementação e regras de negócio visíveis no código.

---

## Objetivo

A aplicação recebe três tipos principais de informação:

- **Pedidos**
- **Documentos**
- **Exames**

A partir disso, a API relaciona esses dados e atualiza o status de integração conforme a chegada das informações.

---

## Tecnologias utilizadas

- Node.js
- NestJS
- TypeORM
- MySQL
- Docker
- Swagger

---

## Estrutura adotada

A aplicação foi organizada em módulos do NestJS:

- `pedidos`
- `documentos`
- `exames`

Cada módulo possui seus próprios arquivos de:
- controller
- service
- dto
- entity

A decisão foi seguir uma estrutura modular direta, adequada ao escopo do desafio e fácil de manter.

---

## Sobre a arquitetura

A solução não foi implementada com Clean Architecture completa porque esse não era um requisito explícito do desafio.

A escolha foi manter uma organização mais objetiva, focando em:

- funcionamento correto da regra de negócio
- clareza na leitura do código
- simplicidade para execução e avaliação

Mesmo assim, a base atual permite evolução futura para uma separação mais avançada de camadas, caso necessário.

---

## Endpoints mínimos esperados

Conforme solicitado no desafio, foram implementados os seguintes endpoints:

- `POST /pedidos`
- `POST /documentos`
- `POST /exames`
- `GET /pedidos/:codigoPedido`
- `GET /documentos/:codigoPedido`
- `GET /exames/:accessionNumber`

Todos os endpoints podem ser testados via Swagger.

---

## Casos cobertos pela solução

A aplicação foi construída para atender os cenários principais do desafio, incluindo:

- pedido chegando sem exame correspondente
- pedido chegando já com exame correspondente
- documento chegando antes da integração
- exame chegando depois e atualizando o status do documento
- prevenção de duplicidade de documentos
- prevenção de duplicidade de exames por `accessionNumber`

---

## Documentação da API

A documentação interativa está disponível em:

```bash
http://localhost:3000/docs