# PG Sprint Lab · v1.0

Planejador pessoal de estudos, programação e produção audiovisual, sem conta e sem backend.

## O que funciona
- Criar, editar, concluir e excluir até 150 tarefas; filtros e pesquisa.
- Temporizador de foco com pausa e reinício (o navegador deve permanecer ativo; não promete alarmes em segundo plano).
- Métricas de tarefas e minutos estimados.
- Armazenamento no `localStorage`; verifica snapshot antes de salvar para evitar sobrescrita silenciosa entre abas.
- Exportação e importação JSON v1 com validação; CSV protegido contra fórmula.
- Layout responsivo e navegação por teclado; sem rastreadores nem dependências npm.

## Testes
`node --test tests/*.test.mjs` (Node >=20). Smoke de interação Chromium em contexto HTML injetado (navegação localhost bloqueada no ambiente de produção): 320, 390, 768, 1280 px sem overflow e sem pageerror. Teste real HTTPS e Android físico ainda não certificados.

## Desenvolvimento
`python -m http.server 8000` na pasta do projeto, abrir `http://localhost:8000` no navegador local. A versão `standalone.html` não necessita de servidor, mas armazenamento em `file://` pode variar entre navegadores.

## Privacidade e limites
Dados não saem do dispositivo; o armazenamento local não é criptografado e pode ser apagado pelo navegador. Faça backups regulares. Sem sincronização multiaparelho; Vercel Hobby somente uso pessoal/não comercial.

## PG Lab integrado (v1.1)

A navegação superior liga Shotlist, QA Lab, Creator Kit, Sprint e Budget; cada produto mantém armazenamento local e backup independente. O CSV contém um resumo de trabalho ou financeiro sem modificar o esquema JSON v1. Nenhum dado é enviado automaticamente entre aplicativos.
