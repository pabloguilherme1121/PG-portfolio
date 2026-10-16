# Medição dos fluxos em celular físico

Estado em 15/10/2026: não executada. Nenhum aparelho está conectado ao ambiente de desenvolvimento. Emulação, CI e benchmark de runner não preenchem este registro.

## Preparação e registro

Use o build do SHA aprovado no CI, confirme a versão carregada e preserve favoritos/recordes existentes. Registre modelo, sistema, navegador/versão, modo navegador ou PWA, rede, orientação, bateria inicial, SHA e horário. Separe primeira abertura (cache frio) e reabertura (cache quente). Faça três repetições por fluxo e registre cada uma; não informe percentis a partir de três valores.

| Fluxo | Ação e critério observável |
| --- | --- |
| Central → produto → retorno | Abrir `#rede-projetos`, escolher produto, usar seu link de retorno. Verificar foco, scroll, legibilidade e ausência de cortes em vertical/paisagem. Se o link ainda não estiver publicado, marcar bloqueado. |
| Arcade: descobrir → jogar | Combinar Sem pressa + deslize, abrir 2048, fazer movimentos e voltar. Filtros devem permanecer; cronometre abertura até primeiro controle utilizável. |
| Arcade: Memória | Selecionar 12 pares e observação de 1,5 s; iniciar, pausar/retomar, girar e usar tela cheia/saída. Verificar acesso a todas as cartas e controles. |
| Arcade: dados | Criar um favorito e uma marca de teste, exportar backup, importar cópia válida, inválida e vazia. Conferir mensagens e preservação dos dados anteriores. |
| Portfólio: provas → contato | Abrir estudos, conferir produto/código e voltar; abrir briefing e preencher sem enviar. Verificar teclado virtual e campos visíveis. |
| Produtos de dados | Observatório: indicador → período/fonte. Eleições: busca → município → perfil. Mapa: ponto → procedência. Trajeto: consulta → decisão, sem iniciar deslocamento. |
| Offline preparado | Preparar os recursos conforme cada produto, ativar modo avião, reabrir e registrar o que funciona e a mensagem do que exige rede. Restaurar conexão no fim. |

Em jogos de ação, jogue por 60 segundos em cada orientação. Registre cortes, atrasos percebidos, ações duplicadas, aquecimento percebido e falhas. Tempo manual não é FPS; para tempo de frames use uma gravação de desempenho do navegador conectado por depuração remota e anexe o trace.

## Folha de resultados

Nenhuma linha abaixo foi medida. Preencha somente após executar no aparelho.

| Aparelho / navegador | SHA / rede / cache | Fluxo / repetição | Tempo até ação útil | Resultado e observações | Evidência |
| --- | --- | --- | --- | --- | --- |
| Pendente | Pendente | Pendente | Não medido | Não executado | Sem captura ou trace |
