# PG Budget Lab · v1.0

Estimador pessoal de despesas e entradas para produções audiovisuais e projetos, sem backend ou assinatura.

## O que funciona
- Nome do projeto e até 150 itens de despesa/entrada.
- Preços unitários em centavos inteiros, quantidade, soma exata, saldo previsto e filtros.
- Edição, exclusão, impressão/"Salvar em PDF" do navegador, CSV e backup JSON com validação.
- `localStorage` com proteção contra sobrescrita silenciosa entre abas.
- Design responsivo, sem recursos remotos ou tracking.

## Testes
`node --test tests/*.test.mjs`; smoke Chromium com HTML injetado em 320,390,768,1280 px sem overflow/pageerror. Ainda pendentes: visita à URL real HTTPS, Firefox/WebKit e Android físico.

## Limitações
Não calcula impostos, juros, tributos, notas fiscais ou contratos. Valores são estimativas e não substituem análise financeira/proposta comercial. Não armazene dados sensíveis; o `localStorage` não é criptografado. Vercel Hobby é para uso pessoal/não comercial.

## PG Lab integrado (v1.1)

A navegação superior liga Shotlist, QA Lab, Creator Kit, Sprint e Budget; cada produto mantém armazenamento local e backup independente. O CSV contém um resumo de trabalho ou financeiro sem modificar o esquema JSON v1. Nenhum dado é enviado automaticamente entre aplicativos.
