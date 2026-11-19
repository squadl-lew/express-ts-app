# Product API Spec

## Create Product

Endpoint : POST /api/products

Request Body :

```json
{
  "name" : "Kopi Gula Aren",
  "category" : "Minuman",
  "description" : "Kopi susu gula aren",
  "buyPrice" : 8000,
  "sellPrice" : 10000,
  "stock" : 20
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "name" : "Kopi Gula Aren",
    "category" : "Minuman",
    "description" : "Kopi susu gula aren",
    "buyPrice" : 8000,
    "sellPrice" : 10000,
    "stock" : 20,
    "createdAt" : "2026-11-19T01:00:00.000Z",
    "updatedAt" : "2026-11-19T01:00:00.000Z"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "name must not blank, ..."
}
```

## Get Product

Endpoint : GET /api/products/:productId

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "name" : "Kopi Gula Aren",
    "category" : "Minuman",
    "description" : "Kopi susu gula aren",
    "buyPrice" : 8000,
    "sellPrice" : 10000,
    "stock" : 20,
    "createdAt" : "2026-11-19T01:00:00.000Z",
    "updatedAt" : "2026-11-19T01:00:00.000Z"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Product is not found"
}
```

## Update Product

Endpoint : PUT /api/products/:productId

Request Body :

```json
{
  "name" : "Kopi Gula Aren",
  "category" : "Minuman",
  "description" : "Kopi susu gula aren",
  "buyPrice" : 8000,
  "sellPrice" : 12000,
  "stock" : 20
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "name" : "Kopi Gula Aren",
    "category" : "Minuman",
    "description" : "Kopi susu gula aren",
    "buyPrice" : 8000,
    "sellPrice" : 12000,
    "stock" : 20,
    "createdAt" : "2026-11-19T01:00:00.000Z",
    "updatedAt" : "2026-11-19T01:00:00.000Z"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "name must not blank, ..."
}
```

## Remove Product

Endpoint : DELETE /api/products/:productId

Response Body (Success) :

```json
{
  "data" : "OK"
}
```

Response Body (Failed) :

```json
{
  "errors" : "Product is not found"
}
```

## Search Product

Endpoint : GET /api/products

Query Parameter :
- name : string, product name, optional
- category : string, product category, optional
- page : number, default 1
- size : number, default 10

Response Body (Success) :

```json
{
  "data" : [
    {
      "id" : 1,
      "name" : "Kopi Gula Aren",
      "category" : "Minuman",
      "description" : "Kopi susu gula aren",
      "buyPrice" : 8000,
      "sellPrice" : 10000,
      "stock" : 20,
      "createdAt" : "2026-11-19T01:00:00.000Z",
      "updatedAt" : "2026-11-19T01:00:00.000Z"
    },
    {
      "id" : 2,
      "name" : "Kopi Gula Aren",
      "category" : "Minuman",
      "description" : "Kopi susu gula aren",
      "buyPrice" : 8000,
      "sellPrice" : 10000,
      "stock" : 20,
      "createdAt" : "2026-11-19T01:00:00.000Z",
      "updatedAt" : "2026-11-19T01:00:00.000Z"
    }
  ],
  "paging" : {
    "current_page" : 1,
    "total_page" : 10,
    "size" : 10
  }
}
```
