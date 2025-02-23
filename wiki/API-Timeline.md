# Timeline API Documentation

## 1. Get Timelines

### Endpoint

GET /api/v1/events/{event_id}/timelines

### Description

Retrieves event's timeline. (both host and guest can access)

### Response

```json
{
  "data": {
    "timelines": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "start_time": "string",
        "end_time": "string"
      }
    ]
  }
}
```

### Behavior

- Sort by start_time
- If start_time is the same, sort by end_time (TODO check if this is correct)

## 2. Create Timeline

### Endpoint

POST /api/v1/events/{event_id}/timelines

### Description

Creates a timeline for an event. (only host can access)

### Request

```json
{
  "timelines": [
    {
      "title": "string",
      "description": "string",
      "start_time": "string",
      "end_time": "string"
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "timelines": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "start_time": "string",
        "end_time": "string"
      }
    ]
  }
}
```

## 3. Update Timeline

### Endpoint

PUT /api/v1/events/{event_id}/timelines/{timeline_id}

### Description

Updates a timeline for an event. (only host can access)

### Request

```json
{
  "title": "string",
  "description": "string",
  "start_time": "string",
  "end_time": "string"
}
```

### Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    "timeline": {
      "id": "string",
      "title": "string",
      "description": "string",
      "start_time": "string",
      "end_time": "string"
    }
  }
}
```

## 4. Delete Timeline

### Endpoint

DELETE /api/v1/events/{event_id}/timelines/{timeline_id}

### Description

Deletes a timeline for an event. (only host can access)

### Response

```json
{
  "success": true,
  "message": "string"
}
```

## 5. Get Timelines (AI)

→ 　 Pending

### Status Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Success               |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Not Found             |
| 500         | Internal Server Error |

## Notes

- All API responses are returned in JSON format
