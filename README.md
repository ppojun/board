# 회원가입 JWT 및 게시글 CRUD API

## 기능목록

- 회원가입(PW 암호화 후 저장)
- DB연동 (SQLLITE)
- 로그인 (JWT 발급)
- 게시글 CRUD (헤더로 JWT 인증)
- 에러처리, LOGGER, CONFIG ETC

## 구조

![Screenshot](./images/capture.png)

## API TEST

### REST CLIENT 변수 세팅

- API TESTER로 VSCODE의 REST CLIENT 이용했습니다.

```
@local=http://localhost:3000
@token=로그인 후 JWT발급받아 이용
```

### 1. [회원가입] REQUEST

```
POST {{local}}/user/signup
Content-Type: application/json

{
    "username": "jshong",
    "password": "123456"
}
```

### 1. [회원가입] REQPONSE

- SUCCESS:

```
HTTP/1.1 201 Created
X-Powered-By: Express
Date: Sat, 30 Apr 2022 10:29:20 GMT
Connection: close
Content-Length: 0
```

- ERROR: username 중복에러시 500 서버 에러로 처리가 아닌 ERROR 코드 잡아서 처리

```
HTTP/1.1 409 Conflict
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 67
ETag: W/"43-bvU5hJ7vN5ptmGJpSCIhkVNclIU"
Date: Sat, 30 Apr 2022 10:31:07 GMT
Connection: close

{
  "statusCode": 409,
  "message": "Existing username",
  "error": "Conflict"
}
```

### 2. [로그인] REQUEST

```
POST {{local}}/user/signin
Content-Type: application/json

{
    "username": "jshong",
    "password": "123456"
}
```

### 2. [로그인] RESPONSE

- SUCCESS: JWT토큰 발급

```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 173
ETag: W/"ad-HvA6pSRtHsEOPchwDpTHtfffF+E"
Date: Sat, 30 Apr 2022 10:31:39 GMT
Connection: close

{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpzaG9uZyIsImlhdCI6MTY1MTMxNDY5OSwiZXhwIjoxNjUxNDAxMDk5fQ.xeu3g-tJWZvD-xHnplHlN2UW8ytdoWUt6Nw2G73_pBY"
}
```

- ERROR: 로그인 에러

```
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 66
ETag: W/"42-LL0g8AbNfZfP000h6tSwwUnFfFM"
Date: Sat, 30 Apr 2022 10:34:41 GMT
Connection: close

{
  "statusCode": 401,
  "message": "login failed",
  "error": "Unauthorized"
}
```

### 3. [JWT토큰인증테스트] REQUEST

```
POST {{local}}/user/test
Content-Type: application/json
Authorization: Bearer {{token}}
```

### 3. [JWT토큰인증테스트] RESPONSE

- SUCCESS

```
HTTP/1.1 201 Created
X-Powered-By: Express
Date: Sat, 30 Apr 2022 10:40:18 GMT
Connection: close
Content-Length: 0
```

- ERROR

```
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 43
ETag: W/"2b-hGShxOkieaAVDloBubJVM+h58D8"
Date: Sat, 30 Apr 2022 10:40:53 GMT
Connection: close

{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 4. [게시글작성] REQUEST

```
POST {{local}}/boards
Content-Type: application/json
Authorization: Bearer {{token}}

{
    "title":"TEST TITLE",
    "description":"TEST description"
}
```

### 4. [게시글작성] RESPONSE

- SUCCESS

```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 202
ETag: W/"ca-mwemM/wi2h4nWbRfg4mbDF5wsBQ"
Date: Mon, 02 May 2022 01:42:00 GMT
Connection: close

{
  "title": "TEST TITLE",
  "description": "TEST description",
  "status": "PUBLIC",
  "user": {
    "id": 1,
    "username": "jshong",
    "password": "$2a$10$Uvl4m26QNfSh/4ai2akEcesiuQgtpOe0b/AZhTe8EnY4IXmokAwha",
    "boards": []
  },
  "id": 1
}
```

### 5. [모든게시물검색] REQUEST

```
GET {{local}}/boards
Content-Type: application/json
Authorization: Bearer {{token}}
```

### 5. [모든게시물검색] RESPONSE

- SUCCESS

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 82
ETag: W/"52-SfJCYAYb9ArS36xQ0tumP4yaz8k"
Date: Mon, 02 May 2022 01:43:44 GMT
Connection: close

[
  {
    "id": 1,
    "title": "TEST TITLE",
    "description": "TEST description",
    "status": "PUBLIC"
  }
]
```

### 6. [게시글ID로게시글검색] REQUEST

```
GET {{local}}/boards/1
Content-Type: application/json
Authorization: Bearer {{token}}
```

### 6. [게시글ID로게시글검색] RESPONSE

- SUCCESS

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 80
ETag: W/"50-PRsCyMifrVIxjwxq1h/5X1nkLEQ"
Date: Mon, 02 May 2022 02:00:06 GMT
Connection: close

{
  "id": 1,
  "title": "TEST TITLE",
  "description": "TEST description",
  "status": "PUBLIC"
}
```

### 7. [게시글업데이트] REQUEST

```
PATCH  {{local}}/boards/1/status
Content-Type: application/json
Authorization: Bearer {{token}}

{
    "status":"private"
}
```

### 7. [게시글업데이트] RESPONSE

- SUCCESS

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-bsFlRG6RS2aRaAfGbDpMbjlwUFk"
Date: Mon, 02 May 2022 02:01:54 GMT
Connection: close

{
  "id": 1,
  "title": "TEST TITLE",
  "description": "TEST description",
  "status": "PRIVATE"
}
```

### 8. [게시글삭제] REQUEST

```
DELETE {{local}}/boards/1
Content-Type: application/json
Authorization: Bearer {{token}}
```

### 8. [게시글삭제] RESPONSE

- SUCCESS

```
HTTP/1.1 200 OK
X-Powered-By: Express
Date: Mon, 02 May 2022 02:02:15 GMT
Connection: close
Content-Length: 0

```
