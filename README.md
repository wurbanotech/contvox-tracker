# NEBULA Habits Tracker

🔥 **tracker.contvox.com**

Frontend web mobile-first para tracking de hábitos, integrado ao sistema NEBULA.

## Funcionalidades

- ✅ **Checklist de hábitos** - Marque hábitos diários com um toque
- 🔥 **Streaks** - Acompanhe sequências de dias consecutivos
- 📊 **Score** - Nota de 0-100% por hábito (últimos 30 dias)
- 📅 **Calendário** - Visualização mensal com cores por conclusão
- 📈 **Gráficos** - Histórico diário/semanal
- 🎯 **Desafios** - Challenges de 7/15/30/75 dias
- 📝 **Resumo diário** - Para análise por IA

## Tecnologias

- **Frontend:** HTML/CSS/JS vanilla (zero dependencies)
- **Design:** Mobile-first, minimalista, dark theme
- **Dados:** JSON estático + LocalStorage
- **Deploy:** Cloudflare Pages / GitHub Pages

## Sincronização

Os dados são gerados pelo CLI do NEBULA e exportados para `habits_data.json`:

```bash
# Exportar dados para o frontend
python -m src.cli --habit_export

# O arquivo é criado em: output/habits_data.json
# Copie para deploy/contvox-tracker/habits_data.json e faça commit
```

## Deploy

1. Configure o repositório para deploy no Cloudflare Pages ou GitHub Pages
2. Aponte o CNAME `tracker.contvox.com` para o serviço
3. O site carrega `habits_data.json` automaticamente

## Estrutura

```
deploy/contvox-tracker/
├── CNAME              # tracker.contvox.com
├── index.html         # App completo (single file)
├── habits_data.json   # Dados exportados do NEBULA
└── README.md          # Esta documentação
```

## Modo Offline

O app usa LocalStorage para cache, permitindo visualização mesmo offline.
As alterações locais são salvas no navegador até a próxima sincronização.

---

Parte do projeto **NEBULA** - Sistema de gestão pessoal e coaching.
