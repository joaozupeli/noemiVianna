# Advocacia Noemi Vianna — Site Demonstrativo

Site demonstrativo de prospecção para **Advocacia Noemi Vianna**, escritório localizado em **Colombo-PR** (região metropolitana de Curitiba).

> ⚠️ **Este é um site de demonstração para prospecção comercial, NÃO é o site oficial do escritório.**

## Sobre o prospect

- **Nome:** Advocacia Noemi Vianna / Dra. Noemi Terezinha Vianna
- **Cidade:** Colombo — PR (Jardim Guaraituba)
- **Áreas de atuação:** Direito Previdenciário e Trabalhista (foco principal), Civil e Família
- **Experiência:** +39 anos de advocacia
- **Por que demo:** Escritório sem site próprio identificado — apenas listagens em diretórios telefônicos

## Contatos do escritório

| Canal | Informação |
|-------|------------|
| Telefone | (41) 3606-2565 |
| WhatsApp | (41) 99175-3824 |
| Endereço | Rua Nicolau Schleder do Carmo, 358, Bloco B, Sala 02 — Jardim Guaraituba, Colombo — PR, CEP 83410-165 |
| Horário | Segunda a Sexta, 09:00 – 17:30 |

## Como rodar

O gerenciador de pacotes é o **pnpm**:

```bash
pnpm install
pnpm run dev
```

Build de produção e pré-visualização:

```bash
pnpm run build
pnpm run preview
```

## Deploy na Vercel

O `vercel.json` já está configurado com build command, output directory e rewrites para SPA. Basta importar o repositório na Vercel.

## Personalização

Todo o conteúdo do site (textos, contatos, áreas de atuação, equipe, depoimentos) está em **`src/data/firm.js`**.

Para personalizar cores e fontes, edite:
- `src/assets/styles/variables.css` — tokens de cor e tipografia
- `index.html` — link do Google Fonts se mudar a fonte

## Base do template

Este site foi criado a partir do template [joaozupeli/advocproto](https://github.com/joaozupeli/advocproto).

## Stack

- Vue 3 (Composition API)
- Vue Router 4
- GSAP + ScrollTrigger
- Lenis (rolagem suave)
- Vite

## Observações

- **OAB:** Número não confirmado publicamente — marcado como "OAB/PR (consultar)"
- **E-mail:** Não encontrado — campo omitido
- **Redes sociais:** Não verificadas — campos omitidos
