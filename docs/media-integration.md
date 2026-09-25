# Mídias do portfólio

O GitHub Pages publica este projeto sob `/PG-portfolio/`. As referências a
`/manus-storage/` no código são resolvidas por `publicMediaPath` para essa base
durante o build. Coloque os arquivos originais e derivados em
`client/public/manus-storage/`, mantendo os nomes referenciados pelo código.

Antes de disponibilizar as mídias, `pnpm audit:assets` apresenta o inventário
ausente. Quando o primeiro arquivo for adicionado, o CI passa a exigir todos os
arquivos referenciados; execute `pnpm audit:assets --strict` para conferir a lista
antes de enviar. A imagem de abertura e o showreel ficam ocultos quando seus
arquivos principais ainda não existem no build estático; fotografias ausentes
recebem uma indicação visual explícita. O currículo só aparece quando o PDF
original está presente.

Não substitua trabalhos reais por conteúdo sintético. Para cada trabalho,
confirme autoria e associação entre título, arquivo, capa e formatos otimizados.
