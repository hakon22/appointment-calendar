lint-frontend:
	make -C frontend lint

install:
	npm ci && npm -C frontend ci

start-frontend:
	npm -C frontend start

start:
	npx pm2 start "npm run start" && npm run snap --prefix frontend && pm2 delete 0 && pm2 start src/reCash.js && npm run start

start-local:
	npm run start-local

build:
	npm run build --prefix frontend

re-cash:
	npm run snap --prefix frontend
