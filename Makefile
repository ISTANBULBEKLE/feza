## feza — one-command run / stop / test / build / clean
##
## Usage:
##   make            (alias for `make help`)
##   make dev        start the dev server on :3000
##   make stop       kill anything bound to :3000
##   make test       run vitest once
##   make build      production build
##   make init       fresh demo: clean + install + dev

SHELL := /bin/bash
PORT  ?= 3000

.PHONY: help dev stop install build test test-watch lint clean init pr-review storybook storybook-build lint-fix lint-check coverage sonar

help: ## list targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

dev: ## start dev server (Turbopack default in Next.js 16)
	@npm run dev -- -p $(PORT)

stop: ## kill anything bound to $(PORT)
	@-lsof -ti:$(PORT) | xargs kill -9 2>/dev/null || true
	@echo "feza: stopped (port $(PORT))"

install: ## install deps
	@npm install

build: ## production build
	@npm run build

test: ## run vitest once
	@npm run test

test-watch: ## vitest in watch mode
	@npm run test:watch

lint: ## eslint
	@npm run lint

clean: ## blow away build + node_modules
	@rm -rf .next node_modules
	@echo "feza: cleaned"

init: ## fresh demo: clean + install + dev
	@$(MAKE) clean && $(MAKE) install && $(MAKE) dev

pr-review: ## local invocation of the review-pr skill (PR=123 make pr-review)
	@if [ -z "$$PR" ]; then echo "usage: PR=<number> make pr-review"; exit 1; fi
	@claude /review-pr $$PR

storybook: ## [demo] run Storybook on :6006
	@npm run storybook

storybook-build: ## headless Storybook build (storybook-static/)
	@npm run build-storybook

lint-fix: ## [quality] apply ESLint auto-fixes
	@npm run lint:fix

lint-check: ## [quality] triaged lint via /eslint-check skill
	@claude /eslint-check

coverage: ## generate LCOV coverage report (consumed by Sonar)
	@npm run test:coverage

sonar: ## [quality] full SonarCloud pass via /sonar-scan skill
	@if [ -z "$$SONAR_TOKEN" ]; then echo "SONAR_TOKEN unset — see documents/SETUP.md"; exit 1; fi
	@claude /sonar-scan

.DEFAULT_GOAL := help
