# NEBULA Centro de Comando

🎯 **tracker.contvox.com**

Dashboard dinâmico para monitoramento de progresso em 5 áreas da vida, integrado ao sistema NEBULA.

## Funcionalidades

- 📊 **Progresso por Área** - Visualização 0-100% para cada área da vida
- 🎯 **5 Áreas de Vida** - Saúde Física, Social, Acadêmico, Carreira, Financeiro
- 📈 **Gráfico de Tendência** - Últimos 7 dias de evolução
- 🍩 **Gráfico de Distribuição** - Equilíbrio entre áreas (Doughnut Chart)
- ⚡ **Quick Wins** - Áreas que precisam de atenção imediata
- 🔄 **Auto-refresh** - Atualização automática a cada hora
- 🌙 **Dark Theme** - Interface minimalista e moderna

## Áreas Monitoradas

| Área | Ícone | Fontes de Dados |
|------|-------|-----------------|
| 💪 Saúde Física | Exercício, Médico, Nutrição |
| 👥 Social | Família, Amigos, Networking |
| 📚 Acadêmico | Inglês, Estudos, Leitura |
| 💼 Carreira | Trabalho, Projetos, Cursos |
| 💰 Financeiro | Orçamento, Investimentos |

## Tecnologias

- **Frontend:** HTML/CSS/JS vanilla + Chart.js (CDN)
- **Design:** Mobile-first, dark theme
- **Dados:** JSON estático gerado pelo NEBULA
- **Deploy:** GitHub Pages

## Sincronização

Os dados são gerados pelo CLI do NEBULA:

```bash
# Gerar dashboard e fazer deploy
python -m src.cli --command_center_deploy

# Ou gerar apenas HTML
python -m src.cli --command_center

# Ou exportar apenas JSON
python -m src.cli --command_center_json
```

## Deploy

1. Execute `--command_center_deploy` para gerar os arquivos
2. Faça commit e push para o GitHub
3. GitHub Pages serve automaticamente em tracker.contvox.com

## Estrutura

```
deploy/contvox-tracker/
├── CNAME                  # tracker.contvox.com
├── index.html             # Dashboard completo
├── command_center.json    # Dados do progresso
└── README.md              # Esta documentação
```

## Status de Progresso

Os status são calculados automaticamente:

| Status | Percentual | Cor |
|--------|------------|-----|
| 🔴 Crítico | < 30% | Vermelho |
| 🟡 Atrasado | < 60% | Amarelo |
| 🟢 No Caminho | < 90% | Verde |
| 🚀 Adiantado | ≥ 90% | Azul |

---

Parte do projeto **NEBULA** - Sistema de gestão pessoal e coaching.
