# Otimização de desempenho — 13/11/2026

Versão preparada: `script.js?v=20261113-1`.
Base da comparação: `7d95090`, versão pública `20261112-17`.

## Alterações

- Preparação dos efeitos de entrada de seções distantes quando elas ficam a
  2000 px da tela. Os pins e seus espaços continuam criados na abertura.
  Até 1024 px e sem IntersectionObserver, a preparação continua imediata.
- Os destinos do menu e de fragmentos são preparados antes da navegação.
- Leituras iniciais dos transforms de caracteres/words são agrupadas antes
  de GSAP escrever os estilos de entrada.
- Um refresh feito pelo ScrollTrigger cancela o refresh próprio já pendente,
  evitando repetir o mesmo cálculo no quadro seguinte.
- A preparação tardia dos textos da dobra04, com fontes já carregadas, não
  força a remedição global de textos que estejam no meio de uma animação.
- GSAP, ScrollTrigger, SplitText e Lenis são servidos localmente, com exatamente
  os mesmos bytes e versões. Origens e hashes: `assets/vendor/SOURCES.md`.
- Minificação de sintaxe e identificadores locais do JavaScript no build,
  preservando nomes de funções. CSS continua com a transformação anterior.
- Cache imutável e gzip configurados para as bibliotecas com nomes versionados.
- Compressão gzip nível 6 no Nginx: o CSS minificado cai de 47.476 bytes no
  nível 1 para 35.456 bytes no nível 6, sem mudar um byte do CSS descomprimido.
  A referência ao CSS foi versionada novamente para renovar o cache.

Não foram alterados os valores das animações (durações, easing, deslocamentos,
scrub, pin, start/end e ações), o CSS de layout, as imagens ou o preloader.

## Comparação de comportamento

O teste `scripts/verify-home-motion.cjs` serve os arquivos locais por interceptação
de requisições em Chrome headless. Nenhuma requisição de publicação ou envio de
formulário é realizada. A origem HTTPS de produção é simulada para também testar
a exibição do aviso de cookies em uma visita nova.

| Cenário | Resultado |
| --- | --- |
| Desktop 1350 × 940, código-fonte | 108 gatilhos e 15 pins antes/depois; sem diferenças |
| Desktop 1440 × 940, build minificado | 108 gatilhos e 15 pins; posições, opções e durações iguais |
| Desktop 1920 × 1080, build minificado e saltos pelo menu | 108 gatilhos e 15 pins; sem diferenças, inclusive nos destinos Sobre, Contato, Serviços e Portfólio |
| Celular 390 × 844, build minificado final | 107 gatilhos e 13 pins; sem diferenças, inclusive na repetição após a correção final |

São comparados a altura e a largura da página, os start/end calculados, as opções dos
gatilhos, as durações e os estados de transform/opacity/visibility em posições
de Serviços, Projetos e Pilares. Não foram registrados erros JavaScript nos
cenários acima. Também foram inspecionadas capturas da home e de Serviços.

O teste em 1920 px identificou uma remedição de textos durante a animação;
ela foi corrigida e o cenário completo foi repetido com sucesso. A tabela não
afirma uma comparação pixel a pixel de todos os quadros das animações aleatórias.

## Medição desktop final em servidor local HTTP/2

Lighthouse 13.4.1, Chrome 157, preset desktop padrão: 1350 × 940, RTT simulado
40 ms, 10.240 Kbps, multiplicador de CPU 1. Execuções sequenciais, sem alterar
a preferência de movimento. Servidor HTTPS/HTTP2 ligado somente a 127.0.0.1,
com os arquivos reais do build e respostas gzip nível 6. O suporte HTTP/2 do
domínio público foi confirmado separadamente, por requisição de rede.

| Execução | Nota desktop local | TBT | Speed Index | FCP | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 95 | 30 ms | 1,1 s | 0,4 s | 1,5 s | 0 |
| 2 | 95 | 20 ms | 1,1 s | 0,4 s | 1,5 s | 0 |
| 3 | 95 | 40 ms | 1,1 s | 0,4 s | 1,5 s | 0 |
| 4 — build final e cache versionado | 95 | 30 ms | 1,1 s | 0,4 s | 1,4 s | 0 |

A quarta execução terminou sem erros JavaScript e sem recursos ausentes.

**A nota 95 foi obtida localmente. Ainda não é uma nota do PageSpeed público.**
O ambiente local não reproduz CDN, servidor PHP/Nginx, latência real e a versão
do Lighthouse usada pelo Google. A configuração de throttling é o preset
desktop normal; não há redução artificial de movimento ou ocultação de conteúdo
para a auditoria.

Um diagnóstico anterior com requisições interceptadas, sem gzip real, registrou
890 → 290 ms de TBT e 3,1 → 1,6 s de Speed Index ao trocar o JavaScript antigo
pelo otimizado. Esse diagnóstico não é comparável numericamente ao teste final
HTTP/2 e não foi usado como resultado público.

O JS gerado passou de 83.857 para 70.989 bytes (gzip: 19.332 para 18.145 bytes).
`node --check` passou para os scripts alterados; `php -l` passou para os três
templates com a referência versionada. Nginx/Docker não estão disponíveis para
um teste de execução do container neste ambiente.

## Publicação e verificação pendentes

O site público ainda respondeu com `20261112-17` na consulta desta sessão.
A pasta `.git` está somente leitura neste ambiente; commit/push não foram feitos.
A meta de 95 está confirmada no teste local; a confirmação no Google permanece
pendente de publicação e nova medição pública.

Comandos para publicar pelo repositório configurado, em um terminal com escrita
normal no Git, após revisar o diff:

```powershell
git add index.html script.js scripts/build-frontend.cjs scripts/verify-home-motion.cjs scripts/VALIDACAO-DESEMPENHO.md nginx.conf orcamento.php partials/head.php partials/footer.php assets/vendor
git commit -m "Otimiza preparacao das animacoes sem alterar seu comportamento"
git push origin main
```

Depois do deploy, conferir a referência `20261113-1` e as quatro bibliotecas
locais antes de executar novos testes desktop no PageSpeed. Comparar mais de
uma execução e verificar novamente as animações na versão publicada.

## Repetir a comparação de comportamento

Requer Chrome e `puppeteer-core`. Informar o caminho do módulo em
`PUPPETEER_MODULE` caso ele não esteja na resolução normal do Node.

```text
node scripts/verify-home-motion.cjs CAMINHO_DO_SCRIPT_BASE PASTA_DE_RESULTADOS
```

Opções: `VIEWPORT_WIDTH`, `VIEWPORT_HEIGHT`, `CHECK_ANCHORS=1`, `CHROME_PATH`.
Para testar o build: `AFTER_SCRIPT`, `AFTER_INDEX` e `AFTER_STYLE` apontam para
os arquivos gerados. O teste salva JSON, comparação e capturas antes/depois.
