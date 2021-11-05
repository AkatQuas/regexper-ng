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

IMAGE_NAME=regexper

#
# Tweak the variables based on your project.
#

# Current version of the project.

#
# Define all targets. At least the following commands are required:
#

SHELL:=/bin/bash
.DEFAULT_GOAL:=help
targets = help groupdhelp list-help start lint build test build-docker clean


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

##@ Development

start: ## start the project server
	npx webpack-dev-server

lint: ## lint
	npx eslint --fix .

##@ Build

build: lint ## build the static regexper website
	npx webpack

test: build ## test anything
	$(info $(RED)Testing$(NOFORMAT))
	$(info $(GREEN)Testing$(NOFORMAT))
	$(info $(YELLOW)Testing$(NOFORMAT))
	$(info $(BLUE)Testing$(NOFORMAT))
	$(info $(MAGENTA)Testing$(NOFORMAT))
	$(info $(CYAN)Testing$(NOFORMAT))
	$(info $(WHITE)Testing$(NOFORMAT))
	npx karma start --single-run

build-docker: ## build the static regexper website into docker
	docker build -t ${IMAGE_NAME} ./

##@ Cleanup

clean: ## Cleanup the project folders
	$(info Cleaning up things)
