# Things To Buy API Documentation

## 1. Get Things To Buy

### Endpoint

GET /api/v1/events/{event_id}/things-to-buy

### Description

Retrieves event's things to buy. (only host can access)

### Response

```json
{
  "data": {
    "thingsToBuy": [
      {
        "id": "string",
        "name": "string",
        "price": number,
        "quantity": number,
        "isPusrchased": boolean
      }
    ]
  },
  "budget": number // check if need totalAmount and remnant
}
```

## 2. Create Things To Buy

### Endpoint

POST /api/v1/events/{event_id}/things-to-buy/init

### Description

Creates a thing to buy for an event when it's empty. (only host can access)

### Request

```json
{
  "budget": number,
  "item": {
    "name": "string",
    "price": number,
    "quantity": number
  }
}
```

### Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "thingsToBuy": [
      {
        "id": "string",
        "name": "string",
        "price": number,
        "quantity": number,
        "isPurchased": boolean
      }
    ],
    "budget": number // TODO: check if need totalAmount and remnant
  }
}
```

## 3. Add Item To Things To Buy

### Endpoint

POST /api/v1/events/{event_id}/things-to-buy

### Description

Adds an item to things to buy. (only host can access)

### Request

```json
{
  "budget": number,
  "item": {
    "name": "string",
    "price": number,
    "quantity": number
  }
}
```

### Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "thingsToBuy": [
      {
        "id": "string",
        "name": "string",
        "price": number,
        "quantity": number,
        "isPurchased": boolean
      }
    ]
  }
}
```

## 4. Update Item

### Endpoint

PUT /api/v1/events/{event_id}/things-to-buy/{item_id}

### Description

Updates an item in things to buy. (only host can access)

### Request

```json
{
  "item": {
    "name": "string",
    "price": number,
    "quantity": number
  }
}
```

### Response

```json
{
  "success": true,
  "message": "string"
}
```

## 5. Delete Item

### Endpoint

DELETE /api/v1/events/{event_id}/things-to-buy/{item_id}

### Description

Deletes an item from things to buy. (only host can access)

### Response

```json
{
  "success": true,
  "message": "string"
}
```
