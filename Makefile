lint-frontend:
	make -C frontend lint

install:
	npm ci && npm -C frontend ci

start-frontend:
	npm -C frontend start

start:
	npm start

start-local:
	npm run start-local

build:
	npm run build --prefix frontend
