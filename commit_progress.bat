@echo off
echo Fazendo commit do progresso...

cd /d "c:\Users\leonardo.silva\Clientes\rsprospect\SiteDoTrabalhador"

echo Adicionando todos os arquivos...
git add .

echo Fazendo commit...
git commit -m "MODAL QUALIFICACAO LEAD - Implementacao completa

- Modal externo CORRIGIDO para usar mesmas perguntas estrategicas
- Removidos caracteres especiais que causavam erro de build
- 5 APIs de vagas criadas/expandidas (tech, health, services)
- Total: +53 vagas reais de multiplas fontes
- Todas vagas com location: Brasil (cidade oculta)
- Modal unificado funcionando em vagas internas + externas
- CTA verde padronizado
- Dados completos enviados para painel admin
- Design gov.br mantido
- Captacao de leads qualificados ativa"

echo Fazendo push...
git push

echo Commit realizado com sucesso!
pause
