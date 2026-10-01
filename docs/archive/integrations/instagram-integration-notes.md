# Notas de integração do Instagram

## Fontes oficiais consultadas

1. Meta, Instagram Platform Overview: https://developers.facebook.com/documentation/instagram-platform/overview
2. Meta, IG User Media: https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media
3. Meta, IG Media: https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media

## Achados relevantes

A documentação oficial da Meta informa que as APIs da Instagram Platform atendem contas profissionais, isto é, contas Business ou Creator. A integração pode usar Business Login for Instagram, com login do próprio Instagram, ou Facebook Login for Business, quando a conta está vinculada a uma Página do Facebook. Para uma conta própria gerenciada pelo proprietário, o acesso padrão pode ser suficiente; contas fora do controle da aplicação exigem acesso avançado, revisão da Meta e verificação empresarial.

A leitura de mídia recente usa o endpoint de mídia da conta profissional, com token de acesso e campos como `id`, `caption`, `media_type`, `media_url`, `permalink`, `thumbnail_url`, `timestamp` e `username`. A API pode omitir `media_url` em alguns vídeos por direitos autorais ou configurações de download; nesse caso, a aplicação deve usar `permalink` ou `thumbnail_url` como fallback.

A API não retorna mídia de contas pessoais. Portanto, um feed realmente dinâmico exige que os perfis usados sejam contas profissionais e que exista autenticação/credencial Meta válida. No estado atual da sessão, o conector Instagram existe, mas está desabilitado; não há autorização confirmada para ler as publicações dos perfis.

## Decisão de produto provisória

Não inventar posts, não raspar páginas públicas e não expor token no frontend. A implementação deve oferecer uma seção visual com links reais para os dois perfis e um fallback de portfólio baseado nos trabalhos audiovisuais já publicados, até que uma credencial Meta e o tipo profissional das contas sejam confirmados. Se a autorização for fornecida, o feed pode ser conectado pelo servidor, com cache, carregamento sob demanda e fallback por permalink/thumbnail.
