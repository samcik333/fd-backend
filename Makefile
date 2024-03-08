# Makefile for managing simple npm tasks in a Node.js project

# Default command when you just run `make`
all: install

# Install dependencies
install:
	npm install

# Start the application in production mode
start:
	npm start

# Start the application in development mode
dev:
	npm run dev

# Help command to display available commands
help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make start    - Start the application in production mode"
	@echo "  make dev      - Start the application in development mode"
	@echo "  make help     - Display this help"

.PHONY: all install start dev help
