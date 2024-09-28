### Project Name: Simple Cloud Storage (AWS S3 Clone)

### **_Project Overview_**

Simple Cloud Storage is an AWS S3 clone that allows users to upload, download, and manage files securely. The system ensures security, integrity, and efficient storage management with features like deduplication, versioning, and access control.

### System Design:

#### Architecture Diagram:

**_User Authentication Service:_** For secure user login and registration.

**_Storage Service:_** Handles file upload, download, and storage management, including versioning, duplicate detection.

**_Metadata Service:_** Stores file-related metadata like tags and descriptions.

**_File Organization Service:_** Manages directories, similar to buckets in Amazon S3. The folder path will be virtual.

**_Access Control Service:_** Provides permissions for private, public, and shared file access.

### **_Database Design_**:

The database schema is designed using Prisma ORM with PostgreSQL as the database. Below are the models and their relationships:

#### User Model

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

#### File Model

```
model File {
  id             String           @id @default(uuid())
  originalName   String
  virtualPath    String
  filename       String
  userId         String
  description    String?          // Optional description field
  size           Int?             // Optional size field
  type           String?          // Optional type field
  createdAt      DateTime         @default(now())
  currenthash    String           @default("")
  currentVersion Int              @default(0)
  versions       FileVersion[]
  permissions    FilePermission[]
  metadata       Metadata[]

  User User @relation("FileOwner", fields: [userId], references: [id])
}
```

#### FileMetadata Model

```
model Metadata {
  id        String   @id @default(uuid())
  fileId    String
  key       String
  value     String
  createdAt DateTime @default(now())

  File File @relation(fields: [fileId], references: [id])

  @@unique([fileId, key]) // Ensures each file has unique metadata keys
}
```

#### FileVersion Model

```
model FileVersion {
  id        String   @id @default(uuid())
  fileId    String
  version   Int
  filename  String
  hash      String   @default("")
  createdAt DateTime @default(now())

  File File @relation(fields: [fileId], references: [id])
}
```

#### FilePermission Model

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

| Method | Endpoint                           | Description                        |
| ------ | ---------------------------------- | ---------------------------------- |
| GET    | api/v1/files                       | Get all files of logged in user    |
| POST   | api/v1/files/upload                | Upload Single file                 |
| GET    | api/v1/files/:id                   | Get details about single file      |
| PUT    | api/v1/files/:id                   | Update file details                |
| DELETE | api/v1/files/:id                   | Delete file details                |
| GET    | api/v1/files/:id/download          | Download the latest file           |
| GET    | api/v1/files/:id/versions          | Get all the versions               |
| GET    | api/v1/files/:id/restore/:version  | Restore a particular version       |
| GET    | api/v1/files/:id/download/:version | Download the specific version file |
| POST   | api/v1/files/:id/metadata          | Create metadata                    |
| GET    | api/v1/files/:id/metadata          | Get metadata                       |
| PUT    | api/v1/files/:id/metadata          | Update metadata                    |
| DELETE | api/v1/files/:id/metadata          | Delete metadata                    |
| GET    | api/v1/files/search                | search files by name, tags, etc.   |
| POST   | api/v1/files/:id/permissions       | Update permissions                 |
| GET    | api/v1/files/:id/permissions       | Get permission details             |
| GET    | api/v1/files/:id/versions          | Get desired version                |
| GET    | api/v1/files/duplicates            | Get all duplicate file details     |
| GET    | api/v1/files/:id/duplicates        | Get all duplicate file a file      |

### 5. Overall Approach:

#### **_Technologies Used_**:

#### Backend:

Node.js with Express.js and Typescript (non-blocking I/O for high concurrency).

#### Database:

PostgreSQL for relational data, ensuring strong consistency (e.g., user-file relationships and permissions).

#### Storage:

Local file system with file versioning and deduplication.

#### Authentication:

Passport.js for secure authentication, using JWT tokens for session management.

#### Logging and Monitoring:

Implemented logging with Winston, grafana, promotheus and loki.

#### API Documentation:

Swagger is used for API documentation.

#### Reasoning:

PostgreSQL was chosen due to its strong support for relational data, which is ideal for user-file relationships and complex queries like file searching and version management.

Node.js is ideal for high-performance, real-time applications with its event-driven, non-blocking architecture.

#### Design Patterns:

The application follows a monolithic architecture, with core functionalities User Authentication, File Storage, Metadata Management, all are tightly integrated within a single codebase. This approach ensures simplicity and easier deployment while maintaining scalability and maintainability.

File Deduplication helps optimize storage by avoiding redundant copies of the same file, improving storage efficiency and reducing costs. although not handled duplicate file storage, only user will be notified about the diuplication.

## Get Started

### Prerequisites

- **Node.js** (v18.x or above)
- **PostgreSQL** (v16 or above)
- **Docker** (if using Docker setup)
- **Git**

---

### 1. Local Setup (Without Docker)

#### Step 1: Clone the Repository

```bash
git clone https://github.com/cksadhukhan/cloud-storage-backend.git
cd cloud-storage-backend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Set up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your-secret-key"
NODE_ENV=development
PORT=8000
```

- Replace `user`, `password`, and `dbname` with your PostgreSQL credentials and database name.
- Set `JWT_SECRET` to a random secure key for token encryption.

#### Step 4: Set up PostgreSQL

Ensure PostgreSQL is installed and running. You can use a GUI tool like **pgAdmin** or run the following commands:

```bash
psql -U postgres
CREATE DATABASE dbname;
\q
```

#### Step 5: Migrate the Database

Run Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev --name init
```

#### Step 6: Run the Application

Start the server:

```bash
npm run dev
```

The server will be running at `http://localhost:8000`.

#### Step 8: Access Prisma Studio (Optional)

To manage and visualize your database records, you can use Prisma Studio:

```bash
npx prisma studio
```

---

### 2. Docker Setup

If you prefer running the project with Docker, follow these steps:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/cksadhukhan/cloud-storage-backend.git
cd cloud-storage-backend
```

#### Step 2: Set up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your-secret-key"
NODE_ENV=development
PORT=8000
```

Ensure the `DATABASE_URL` point to the correct service names as per the `docker-compose.yml`.

#### Step 3: Run Docker Compose

The repository includes a `docker-compose.yml` file that defines the services for Node.js, PostgreSQL, and Redis. To start the application, simply run:

```bash
docker-compose up --build
```

This will:

- Build the Node.js app
- Set up a PostgreSQL database
- Start the entire stack

#### Step 4: Apply Database Migrations

Once the services are running, open a new terminal and run:

```bash
docker-compose exec app npx prisma migrate dev --name init
```

This will initialize the database schema within the PostgreSQL container.

#### Step 5: Access the Application

The server will be running at `http://localhost:8000`.

---

### Useful Commands

#### Stopping Docker Services

```bash
docker-compose down
```

#### Rebuild the Services

```bash
docker-compose up --build
```

#### View Logs

```bash
docker-compose logs -f
```

---

### API Documentation Endpoint: `http://localhost:8000/api-docs`

---

#### Optional/Future-Scope:

- **_Redis_**: For caching
- **_RabbitMQ_**: for notification queue after file upload, deletion, and duplication found.
