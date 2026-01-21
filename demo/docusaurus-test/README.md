# Docusaurus Test

This directory contains tooling to test the SDK API documentation integration with the [Camunda Docs](https://github.com/camunda/camunda-docs) Docusaurus site.

## Prerequisites

1. Clone the camunda-docs repository to `~/camunda/camunda-docs`:
   ```bash
   cd ~/camunda
   git clone https://github.com/camunda/camunda-docs.git
   ```

2. Install dependencies for camunda-docs:
   ```bash
   make install
   ```

## Usage

### Generate and integrate SDK docs

Generate the SDK markdown documentation and copy it into camunda-docs:

```bash
make integrate
```

This will:
- Generate markdown docs from the SDK TypeScript source
- Copy them to `camunda-docs/docs/apis-tools/typescript/sdk-api-docs/`
- Fix internal links for the Docusaurus environment
- Update the sidebars.js to include the SDK API Reference section

### Start the dev server

```bash
make start
```

Then open http://localhost:3000 in your browser. Navigate to **APIs & Tools > TypeScript > SDK API Reference** to view the integrated SDK documentation.

### Build the static site

```bash
make build
```

### Serve the built site

```bash
make serve
```

### Clean build artifacts

```bash
make clean
```

## Makefile targets

| Target | Description |
|--------|-------------|
| `install` | Install npm dependencies for camunda-docs |
| `generate-sdk-docs` | Generate SDK markdown docs from TypeScript source |
| `copy-sdk-docs` | Copy SDK docs into camunda-docs and fix links |
| `integrate` | Run both generate and copy (full integration) |
| `start` | Start the Docusaurus development server |
| `build` | Build the static site |
| `serve` | Serve the built static site |
| `clean` | Remove build artifacts and SDK docs from camunda-docs |
