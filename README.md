### 1. Project Name: Simple Cloud Storage (AWS S3 Clone)

### 2. System Design:

#### Architecture Diagram:

### The system is composed of:

**_User Authentication Service:_** For secure user login and registration.

**_Storage Service:_** Handles file upload, download, and storage management, including versioning, duplicate detection.

**_Metadata Service:_** Stores file-related metadata like tags and descriptions.

**_File Organization Service:_** Manages directories, similar to buckets in Amazon S3. The folder path will be virtual.

**_Access Control Service:_** Provides permissions for private, public, and shared file access.

### Description:

Users upload files to their cloud storage. The system ensures security, integrity, and efficient storage management (with features like deduplication, versioning, and access control).

### 3. Database Design:

```
model User {
  id             String           @id @default(uuid())
  email          String           @unique
  password       String
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  files          File[]           @relation("FileOwner")
  FilePermission FilePermission[]
}
```

```
model File {
  id           String           @id @default(uuid())
  originalName String
  virtualPath  String
  filename     String
  userId       String
  createdAt    DateTime         @default(now())
  versions     FileVersion[]
  permissions  FilePermission[]
  metadata     FileMetadata?

  User User @relation("FileOwner", fields: [userId], references: [id])
}
```

```
model FileMetadata {
  id          String   @id @default(uuid())
  fileId      String   @unique
  mimetype    String
  size        Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  file        File     @relation(fields: [fileId], references: [id])
}
```

```
model FileVersion {
  id        String   @id @default(uuid())
  fileId    String
  version   Int
  filename  String
  createdAt DateTime @default(now())

  File File @relation(fields: [fileId], references: [id])
}
```

```
model FilePermission {
  id        String  @id @default(uuid())
  fileId    String
  userId    String
  canRead   Boolean @default(false)
  canWrite  Boolean @default(false)
  canDelete Boolean @default(false)

  File File @relation(fields: [fileId], references: [id])
  User User @relation(fields: [userId], references: [id])

  @@unique([fileId, userId])
}
```

### 4. Key APIs:

User Authentication:

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | api/v1/auth/register | Register the user |
| POST   | api/v1/auth/login    | Login the user    |

File Management:

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | api/v1/files                 | Get all files of logged in user  |
| POST   | api/v1/files/upload          | Upload Single file               |
| POST   | api/v1/files/multiple        | Upload multiple files            |
| GET    | api/v1/files/:id             | Get details about single file    |
| PUT    | api/v1/files/:id             | Update file details              |
| DELETE | api/v1/files/:id             | Delete file details              |
| POST   | api/v1/files/:id/metadata    | Create metadata                  |
| GET    | api/v1/files/:id/metadata    | Get metadata                     |
| DELETE | api/v1/files/:id/metadata    | Delete metadata                  |
| GET    | api/v1/files/search          | search files by name, tags, etc. |
| POST   | api/v1/files/:id/permissions | Update permissions               |
| GET    | api/v1/files/:id/permissions | Get permission details           |
| GET    | api/v1/files/:id/versions    | Get desired version              |
| GET    | api/v1/files/duplicates      | Get all duplicate file details   |

### 5. Overall Approach:

Technologies:

#### Backend:

Node.js with Express.js (non-blocking I/O for high concurrency).

#### Database:

PostgreSQL for relational data, ensuring strong consistency (e.g., user-file relationships and permissions).

#### Storage:

Local file system with file versioning and deduplication.

#### Caching

Implemented redis for in memory cache, to reduce database queries for frequent accessed files.

#### Authentication:

Passport.js for secure authentication, using JWT tokens for session management.

#### Reasoning:

PostgreSQL was chosen due to its strong support for relational data, which is ideal for user-file relationships and complex queries like file searching and version management.

Node.js is ideal for high-performance, real-time applications with its event-driven, non-blocking architecture.

#### Design Patterns:

The application follows a monolithic architecture, with core functionalities User Authentication, File Storage, Metadata Management, all are tightly integrated within a single codebase. This approach ensures simplicity and easier deployment while maintaining scalability and maintainability.

File Deduplication helps optimize storage by avoiding redundant copies of the same file, improving storage efficiency and reducing costs. although not handled duplicate file storage, only user will be notified about the diuplication.

#### Optional/Future-Scope:

(If I complete the above things)

- Logger setup: Using Grafana and Loki for logging and monitoring.
- API Documentation: Using Swagger for API documentation.
- RabbitMQ: for notification queue after file upload, deletion, and duplication found.
