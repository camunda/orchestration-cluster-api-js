# Makefile for testing documentation integration with camunda-docs

CAMUNDA_DOCS_DIR := ../../../camunda-docs
SDK_ROOT := ../..
SDK_DOCS_SRC := $(SDK_ROOT)/docs-md
SDK_DOCS_DEST := $(CAMUNDA_DOCS_DIR)/docs/apis-tools/typescript/oca-client-docs

.PHONY: install start build clean generate-sdk-docs copy-sdk-docs integrate

# Install dependencies for camunda-docs
install:
	cd $(CAMUNDA_DOCS_DIR) && npm ci

# Generate the SDK markdown docs
generate-sdk-docs:
	cd $(SDK_ROOT) && npm run docs:api:md

# Copy SDK docs into camunda-docs and fix broken links
copy-sdk-docs:
	@echo "Copying SDK docs to $(SDK_DOCS_DEST)..."
	rm -rf $(SDK_DOCS_DEST)
	mkdir -p $(SDK_DOCS_DEST)
	cp -r $(SDK_DOCS_SRC)/* $(SDK_DOCS_DEST)/
	@echo "Fixing broken markdown links..."
	@# Replace _media/CONTRIBUTING.md links with GitHub URL
	find $(SDK_DOCS_DEST) -name "*.md" -exec sed -i '' \
		's|_media/CONTRIBUTING.md|https://github.com/camunda/orchestration-cluster-api-js/blob/main/CONTRIBUTING.md|g' {} \;
	@# Remove _media folder as it's no longer needed
	rm -rf $(SDK_DOCS_DEST)/_media
	@echo "Fixing sidebar doc IDs..."
	@# Fix the sidebar IDs to use correct Docusaurus path
	sed -i '' 's|../../../docs-md/@camunda8/|apis-tools/typescript/oca-client-docs/@camunda8/|g' $(SDK_DOCS_DEST)/typedoc-sidebar.cjs
	sed -i '' 's|../../../docs-md/|apis-tools/typescript/oca-client-docs/|g' $(SDK_DOCS_DEST)/typedoc-sidebar.cjs
	@echo "Integrating sidebar into camunda-docs..."
	@# Add SDK API docs reference to the TypeScript section in sidebars.js if not already present
	@if ! grep -q "oca-client-docs/typedoc-sidebar" $(CAMUNDA_DOCS_DIR)/sidebars.js; then \
		sed -i '' 's|"apis-tools/typescript/eventual-consistency",|"apis-tools/typescript/eventual-consistency",\n            {\n              type: "category",\n              label: "Orchestration Cluster API Client Reference",\n              items: require("./docs/apis-tools/typescript/oca-client-docs/typedoc-sidebar.cjs"),\n            },|' $(CAMUNDA_DOCS_DIR)/sidebars.js; \
		echo "Sidebar updated."; \
	else \
		echo "Sidebar already contains SDK API docs reference."; \
	fi

# Full integration: generate and copy SDK docs
integrate: generate-sdk-docs copy-sdk-docs
	@echo "SDK docs integrated into camunda-docs at docs/apis-tools/typescript/oca-client-docs/"

# Start the Docusaurus dev server
start:
	cd $(CAMUNDA_DOCS_DIR) && npm run start

# Build the static site
build:
	cd $(CAMUNDA_DOCS_DIR) && npm run build

# Serve the built site
serve:
	cd $(CAMUNDA_DOCS_DIR) && npm run serve

# Clean build artifacts
clean:
	rm -rf $(CAMUNDA_DOCS_DIR)/build
	rm -rf $(CAMUNDA_DOCS_DIR)/node_modules/.cache
	rm -rf $(SDK_DOCS_DEST)
