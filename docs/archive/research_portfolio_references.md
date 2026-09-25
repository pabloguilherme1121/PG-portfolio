# Referências iniciais para auditoria do portfólio

## Fontes consultadas

1. [JournoPortfolio — Videographer Portfolio Examples](https://www.journoportfolio.com/examples/videographers/): reúne exemplos de profissionais híbridos que combinam vídeo, fotografia, desenvolvimento web, marketing e narrativa.
2. [ScreenSkills — Build your portfolio](https://www.screenskills.com/starting-your-career/building-your-portfolio/): recomenda um portfólio ou showreel curto como evidência de criatividade e capacidade profissional.
3. [Interaction Design Foundation — How to Write Great Case Studies for Your UX Design Portfolio](https://ixdf.org/literature/article/how-to-write-great-case-studies-for-your-ux-design-portfolio): recomenda organizar cada projeto como uma história, com contexto, processo, solução, resultados e aprendizados; enfatiza mostrar resultados cedo para leitores com pouco tempo.
4. [Colorlib — 19 Best Videographer Websites](https://colorlib.com/wp/videographer-websites/): registra padrões recorrentes em portfólios de vídeo: CTA acima da dobra, grade de trabalhos, lightbox, filtros, cabeçalho fixo, feed social e caminhos separados para portfólio, negócio e contato.

## Achados aplicáveis ao projeto

A combinação mais consistente entre as referências é: uma abertura visual forte, poucos caminhos de entrada, CTA de contato visível, portfólio filtrável e evidência contextualizada. Recursos de alto impacto para Pablo são um showreel curto ou destaque visual, projetos com contexto e resultado antes do texto longo, filtros por intenção do visitante e separação explícita entre contratação, repertório audiovisual e trajetória em tecnologia.

A pesquisa também indica que efeitos de alto custo, como vídeos e parallax em excesso, devem ser usados seletivamente. Para velocidade, a prioridade é poster/thumbnail leve, carregamento progressivo, lazy loading, evitar autoplay em redes móveis e preservar uma rota de contato acessível sem exigir que a pessoa percorra toda a página.

## Hipóteses para validar no código atual

- A primeira tela precisa deixar mais explícito o próximo passo para contratação ou conversa.
- A galeria já tem muitos recursos; a revisão deve reduzir fricção e destacar os modos mais úteis, não adicionar complexidade indiscriminada.
- Cases com contexto, método e aprendizado já existem e podem ser aproximados do padrão de resultados antes do processo.
- Os canais de contato estão fortes; a melhoria provável é hierarquia e contexto, não duplicação de botões.
- A velocidade deve ser medida no navegador após as alterações, especialmente por causa de vídeos, imagens e componentes lazy.

## Escopo de skills não aplicadas automaticamente

Financial-analysis, stock-analysis, excel-generator, video-generator, manus-api, youtube-video-research, tts-prompter, music-prompter, similarweb-analytics e skill-creator não são necessários para implementar uma auditoria de UX e portfólio baseada no site atual. Podem ser usados depois se o proprietário solicitar dados financeiros, analytics de tráfego, criação de mídia, pesquisa audiovisual primária, voz, música, integração de API ou criação de uma skill reutilizável específica.


## Observações de referências abertas no navegador

### Adam Hausten

A homepage combina navegação curta com Portfolio, AI Creations, Contact, Store, CV e um CTA direto “Talk to Me Here”. O trabalho destacado aparece cedo em uma lista de projetos com data, título, contexto e mídia variada; a mesma página conecta portfolio completo, contato e um formulário. O posicionamento híbrido é explícito: vídeo, áudio, web, IA e produção aérea são apresentados como meios para comunicar uma ideia. O aprendizado aplicável é usar a multidisciplinaridade como proposta de valor, sem esconder o caminho de contratação.

### Jannis Große

A homepage organiza o trabalho por Stories, Photo, About e Publikationen. O conteúdo aparece como uma coleção editorial com publicações, veículos, datas e títulos, em vez de apenas uma grade visual. O aprendizado aplicável para Pablo é oferecer um modo “repertório” que mostre contexto e credibilidade do registro, especialmente em projetos audiovisuais e sociais, sem exigir texto longo em todos os cards.

## Síntese refinada

As referências confirmam que o portfólio de Pablo já tem recursos avançados, mas a próxima melhoria de qualidade deve aumentar a clareza de escolha: “ver trabalho”, “entender o serviço” e “falar com Pablo” precisam ser caminhos visíveis e distintos. A velocidade deve ser protegida evitando transformar toda a homepage em uma experiência de vídeo autoplay; o vídeo deve ser reservado para destaque/showreel e o restante deve usar poster, lazy loading e interação sob demanda.


## Auditoria visual da versão atual

A homepage apresenta uma identidade forte e coerente com Arquivo Profundo: fundo grafite, azul controlado, linha vertical de progresso, metadados monoespaçados, símbolo PG e hero editorial. O contraste entre a headline grande e os blocos assimétricos cria reconhecimento imediato.

O principal risco visual é a perda de densidade narrativa após as primeiras seções: há áreas muito extensas e escuras com pouca evidência visível. A linha vertical funciona bem como espinha, mas pode carregar mais informação com marcadores, coordenadas e conexão explícita de cada capítulo. As seções de trabalho devem parecer arquivos de evidência, com contexto, processo, ferramentas e resultado antes de se comportarem como uma grade de cards.

Prioridades derivadas: reduzir espaços sem conteúdo, elevar um projeto principal ou showreel como prova de trabalho, tornar os caminhos “ver trabalhos”, “entender serviços” e “falar agora” mais explícitos, e preservar o azul apenas para progresso, ações, estados ativos e metadados críticos.
