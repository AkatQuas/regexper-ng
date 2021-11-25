# The old school Makefile, following are required targets. The Makefile is written
# to allow building multiple images. You are free to add more targets or change
# existing implementations, as long as the semantics are preserved.
#
#
# The makefile is also responsible to populate project version information.
#

#
# These variables should not need tweaking.
#

VERSION_BY_DATE = $(shell date +v"%Y%m%d")
USER_ID=$(shell id -u)
CWD = $(shell pwd)

NOFORMAT=$(shell tput sgr0)
RED:=$(shell tput setaf 1)
GREEN=$(shell tput setaf 2)
YELLOW=$(shell tput setaf 3)
BLUE=$(shell tput setaf 4)
MAGENTA=$(shell tput setaf 5)
CYAN=$(shell tput setaf 6)
WHITE=$(shell tput setaf 7)

define ensure_npm
cd $(1) && if [ ! -d "node_modules" ];then npm install;fi
endef

define ensure_npx
if ! command -v $(1) > /dev/null; then echo "installing $(1) globally use npm" && npm install -g $(1); fi
endef

define clean_npx
if command -v $(1) > /dev/null; then npm uninstall -g $(1); fi
endef

IMAGE_NAME=regexper
EXTENSION_DIR=$(CWD)/extensions

#
# Tweak the variables based on your project.
#

# Current version of the project.

#
# Define all targets. At least the following commands are required:
#

SHELL:=/bin/bash
.DEFAULT_GOAL:=help
targets = help groupdhelp list-help setup start lint build test build_docker build_extensions pack_extensions clean_tools clean


# All targets.
.SILENT: $(targets)
.PHONY: $(targets)

help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n\nTargets:\n"} /^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

groupdhelp:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

list-help: ## List all commands
	awk -F":.*##" '/^[a-zA-Z0-9_-]+:.*?##/ { printf $$1 " " }' $(MAKEFILE_LIST) | pbcopy

##@ Utils

##@ Setup

setup: ## install node_modules
	$(call ensure_npm, $(CWD))
	$(call ensure_npm, $(CWD)/extensions)
	$(call ensure_npx, vsce)

##@ Development

start: setup ## start the project server
	NODE_ENV=development npx webpack_dev-server --open

lint: setup ## lint
	npx eslint --fix $(CWD)/src

##@ Build

build: lint ## build the static regexper website
	NODE_ENV=production npx webpack

test: build ## test anything
	$(info $(RED)Testing$(NOFORMAT))
	$(info $(GREEN)Testing$(NOFORMAT))
	$(info $(YELLOW)Testing$(NOFORMAT))
	$(info $(BLUE)Testing$(NOFORMAT))
	$(info $(MAGENTA)Testing$(NOFORMAT))
	$(info $(CYAN)Testing$(NOFORMAT))
	$(info $(WHITE)Testing$(NOFORMAT))
	npx karma start --single-run

build_docker: setup ## build the static regexper website into docker
	docker build -t ${IMAGE_NAME} ./

build_extensions: setup ## build the static regexper assest for extensions media
	npx webpack --config webpack.vsce.js

pack_extensions: setup build_extensions ## pack extensions using vsce
	cp $(CWD)/static/favicon.ico $(EXTENSION_DIR)/media/icon.ico
	$(call ensure_npm, $(EXTENSION_DIR))
	cd $(EXTENSION_DIR) && (rm -rf dist || true) && npx webpack --mode production --no-devtool && vsce package --no-yarn --out $(CWD)

clean_tools: ## clean tools if you need it
	$(call clean_npx, vsce)

##@ Cleanup

clean: ## Cleanup the project folders
	$(info Cleaning up things)
