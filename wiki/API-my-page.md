# My page API Documentation

## 1. Get Events Information

### Endpoint

GET /api/v1/me/events

### Description

Retrieves logged-in user's events information.

### Response

```json
{
  "events": [
    {
      "id": "string",
      "isHost": "boolean",
      "title": "string",
      "thumbnailUrl": "string",
      "startTime": "datetime",
      "endTime": "datetime"
    }
  ]
}
```

## 2. Get User Information

### Endpoint

GET /api/v1/me

### Description

Retrieves logged-in user information and family members

### Response

```json
{
  "user": {
    "id": "string",
    "name": "string",
    "profileImageUrl": "string",
    "email": "string",
    "userFamilies": [
      {
        "id": "string",
        "profileImageUrl": "string",
        "name": "string"
      }
    ]
  }
}
```

## 3.Update User

### Endpoint

PATCH /api/v1/me

### Description

Updates logged-in user's profile information.

### Request Body

Content-Type: multipart/form-data

| Parameter     | Type    | Required | Description                    |
| ------------- | ------- | -------- | ------------------------------ |
| name          | string  | No       | User's name                    |
| profile_image | file    | No       | New profile image file         |
| remove_image  | boolean | No       | If true, remove existing image |

### Response

```json
{
  "success": boolean,
  "message": "string",
  "user": {
    "id": "string",
    "name": "string",
    "profileImageUrl": "string | null"
  }
}
```

### Behavior

- If only `name` is provided: Updates only the name
- If `profile_image` is provided: Updates the image and returns new URL
- If `remove_image` is true: Removes existing image and sets URL to null
- If neither is provided: Returns 400 Bad Request

## 4. Delete User

### Endpoint

DELETE /api/v1/me

### Description

Deletes logged-in user.

### Response

```json
{
  "success": boolean,
  "message": "string"
}
```

## 5. Add Family Member

### Endpoint

POST /api/v1/me/family

### Description

Adds a family member to logged-in user's family.

### Request Body

Content-Type: multipart/form-data

| Parameter     | Type   | Required | Description            |
| ------------- | ------ | -------- | ---------------------- |
| name          | string | Yes      | Family member's name   |
| profile_image | file   | No       | New profile image file |

### Response

```json
{
  "success": boolean,
  "message": "string",
  "familyMember": {
    "id": "string",
    "name": "string",
    "profileImageUrl": "string | null"
  }
}
```

## 6. Update Family Member

### Endpoint

PATCH /api/v1/me/family/{family_id}

### Description

Updates logged-in user's family member's information.

### Request Body

Content-Type: multipart/form-data

| Parameter     | Type    | Required | Description                    |
| ------------- | ------- | -------- | ------------------------------ |
| name          | string  | No       | Family member's name           |
| profile_image | file    | No       | New profile image file         |
| remove_image  | boolean | No       | If true, remove existing image |

### Response

```json
{
  "success": boolean,
  "message": "string",
  "familyMember": {
    "id": "string",
    "name": "string",
    "profileImageUrl": "string | null"
  }
}
```

### Behavior

- If only `name` is provided: Updates only the name
- If `profile_image` is provided: Updates the image and returns new URL
- If `remove_image` is true: Removes existing image and sets URL to null
- If neither is provided: Returns 400 Bad Request

## 7. Delete Family Member

### Endpoint

DELETE /api/v1/me/family/{family_id}

### Description

Deletes a family member from logged-in user.

### Response

```json
{
  "success": boolean,
  "message": "string"
}
```

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
