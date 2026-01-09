# Documentation Website

This directory contains the Docusaurus-based documentation website for the Node.js Temporal PostgreSQL Boilerplate.

## Local Development

```bash
cd docs
npm install
npm start
```

This starts the development server at `http://localhost:3000`.

## Build

```bash
npm run build
```

This generates static content into the `build` directory.

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the `master` branch.

Visit the live documentation at: https://darshitvvora.github.io/node-temporal-postgres-boilerplate/

## Editing Documentation

- Homepage: `src/pages/index.tsx`
- Documentation pages: `docs/` directory
- Configuration: `docusaurus.config.ts`
- Sidebar: `sidebars.ts`

## Adding New Pages

1. Create a new `.md` file in the `docs/` directory
2. Add frontmatter with `sidebar_position`
3. The page will automatically appear in the sidebar

Example:

```markdown
---
sidebar_position: 5
---

# My New Page

Content here...
```
