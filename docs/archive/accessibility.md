# Acessibilidade e qualidade

## Princípios preservados

A interface mantém navegação por teclado, anéis de foco visíveis, rótulos explícitos, regiões com `aria-live` para feedback, `prefers-reduced-motion` para animações não essenciais e textos alternativos em imagens relevantes.

## Responsividade

A Home mantém comportamento mobile-first, incluindo menu móvel, vídeo vertical em viewport estreita, galeria compacta, controles de lightbox e calendário adaptável. As validações específicas ficam em `scripts/validate/validate-responsive.mjs` e nos demais scripts da pasta de validação.

## Motion e interação

Animações devem permanecer curtas e funcionais. Estados de carregamento, erro, sucesso e indisponibilidade precisam ser percebidos sem depender somente de cor ou movimento. O lightbox deve continuar oferecendo retorno de foco, controles acionáveis e suporte a redução de movimento.

## Regressão mínima antes de publicar

A cada mudança estrutural, execute os testes unitários e o build. Para alterações da Home, rode também as validações de galeria, lightbox, responsividade, showreel, social e currículo quando o comportamento correspondente for afetado.

A acessibilidade não é tratada como uma etapa posterior: qualquer novo componente deve nascer com nome acessível, foco visível, estado anunciado quando necessário e uma alternativa funcional para usuários que não usam ponteiro ou movimento.
