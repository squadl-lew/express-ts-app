# Express + TypeScript + Jest — POS Sederhana

POS sederhana untuk management penjual, single user. Stack: Express + TypeScript, MySQL + Prisma 5, dokumentasi OpenAPI. Struktur folder dan gaya penulisan mengikuti [ProgrammerZamanNow/belajar-typescript-restful-api](https://github.com/ProgrammerZamanNow/belajar-typescript-restful-api).

## Setup

```bash
cp .env.example .env
# isi DATABASE_URL dengan MySQL kamu
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Server jalan di http://localhost:3000, dokumentasi OpenAPI di http://localhost:3000/api-docs

- `GET /` — hello message
- `GET /health` — `{ "status": "ok" }`

## Product API

- `POST /api/products` — buat product
- `GET /api/products?name=&category=&page=1&size=10` — cari product (pagination)
- `GET /api/products/:id` — ambil satu product
- `PUT /api/products/:id` — update product
- `DELETE /api/products/:id` — hapus product

Contoh body:

```json
{
  "name": "Kopi Gula Aren",
  "category": "Minuman",
  "description": "Kopi susu gula aren",
  "buyPrice": 8000,
  "sellPrice": 10000,
  "stock": 20
}
```

`buyPrice` adalah harga beli / modal, `sellPrice` adalah harga jual. Semua harga dalam Rupiah (Int).

Detail endpoint ada di `doc/product.md` dan `doc/openapi.yaml`.

## Build & test

```bash
npm run build
npm start
npm test
```

Catatan test: `test/product.test.ts` memakai mock PrismaClient karena tidak ada server MySQL di lingkungan test ini. Untuk test integrasi ke MySQL asli, jalankan migration ke database test, hapus `jest.mock` di test tersebut, dan gunakan `test/test-util.ts`.

## Struktur

```
prisma/
  schema.prisma   # Model Product, MySQL + Prisma 5
doc/
  openapi.yaml    # Dokumentasi OpenAPI
  product.md      # Spesifikasi API Product
src/
  main.ts
  application/    # web.ts, database.ts (PrismaClient), logging.ts (Winston)
  route/          # public-api.ts, api.ts
  controller/     # product-controller.ts
  service/        # product-service.ts
  validation/     # validation.ts, product-validation.ts (Zod)
  model/          # product-model.ts, page.ts
  middleware/     # error-middleware.ts
  error/          # response-error.ts
test/
  test-util.ts
  product.test.ts
  health.test.ts
```
