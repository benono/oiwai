# Album API Documentation

## 1. Get Pictures

### Endpoint

GET /api/v1/events/{event_id}/album

### Description

Retrieves all pictures for selected event.

### Response

```json
{
  "data": {
    "pictures": [
      {
        "id": "string",
        "userId": "string",
        "imageUrl": "string"
      }
    ]
  }
}
```

## 2. Post Pictures

### Endpoint

POST /api/v1/events/{event_id}/album

### Description

Post pictures for event album. (host and guests can post)

### Request Body

Content-Type: multipart/form-data

```json
{
  "pictures": [
    {
      "picture": "file"
    }
  ]
}
```

### Response

```json
{
  "success": boolean,
  "message": "string",
  "pictures": [
    {
        "imageUrl": "string"
    }
  ]
}
```

## 3. Delete Pictures

### Endpoint

DELETE /api/v1/events/{event_id}/album

### Description

Deletes pictures.
(Host can delete all pictures.)
(Guests can delete only pictures that they posted.)

### Request Body

```json
{
  "pictures": [
    {
      "id": "string"
    }
  ]
}
```

### Response

```json
{
  "success": boolean,
  "message": "string"
}
```

## 4. get Preview Picture by tag(after face-recognition)

### Endpoint

GET /api/v1/events/{event_id}/album/tags

### Description

Retrieves one preview picture from each face-recognition tags.

### Response

```json
{
  [
    {
        "tagId": 1,
        "previewImageUrl": "https://example.com/image.jpg",
    },
    {
        "tagId": 2,
        "previewImageUrl": "https://example.com/image.jpg",
    },
    {
        "tagId": 3,
        "previewImageUrl": "https://example.com/image.jpg",
    },
  ]
}
```

## 5. get All Pictures categorized by tag(after face-recognition)

### Endpoint

GET /api/v1/events/{event_id}/album/{tag_id}

### Description

Retrieves pictures organize by face-recognition tag.

### Response

```json
{
  [
  "tag1":[
    "imageUrl": "https://example.com/image.jpg",
    "imageUrl": "https://example.com/image.jpg",
  ],
  "tag2":[
    "imageUrl": "https://example.com/image.jpg",
    "imageUrl": "https://example.com/image.jpg",
    ]
  ]
}

```
