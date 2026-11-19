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
  "errors" : "Validation Error : ..."
}
```

## Get Product

Endpoint : GET /api/products/:id

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
  "errors" : "Product not found"
}
```

## Update Product

Endpoint : PUT /api/products/:id

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

Response Body (Success) : sama seperti Create Product.

## Remove Product

Endpoint : DELETE /api/products/:id

Response Body (Success) :

```json
{
  "data" : "OK"
}
```

## Search Product

Endpoint : GET /api/products?name=Kopi&category=Minuman&page=1&size=10

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
    }
  ],
  "paging" : {
    "current_page" : 1,
    "total_page" : 1,
    "size" : 10
  }
}
```
