# Express + TypeScript + Jest

Starter Express dengan TypeScript dan Jest (ts-jest + supertest).

## Menjalankan

```bash
npm install
npm run dev
```

Server jalan di http://localhost:3000

- `GET /` — hello message
- `GET /health` — `{ "status": "ok" }`

## Build & test

```bash
npm run build
npm start
npm test
```

## Struktur

```
src/
  app.ts      # Express app (bisa di-import untuk test)
  index.ts    # Entry point, listen di PORT (default 3000)
tests/
  app.test.ts # Test GET / dan GET /health
```
