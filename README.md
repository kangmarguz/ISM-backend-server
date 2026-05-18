# Server

Backend API for the van reservation system.

## Stack

- Node.js
- Express 5
- Prisma
- PostgreSQL
- JWT
- bcrypt
- cookie-parser
- cors
- morgan

## Main Responsibilities

- User registration
- User login and logout
- Token authentication
- Role-based authorization
- Admin user creation
- User role and active status management
- Password reset and password update
- Van booking creation
- Booking status update
- Booking history retrieval and deletion

## API Base Path

All route files in `server/routes` are loaded dynamically and mounted under:

```text
/api
```

## Main Endpoints

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `POST /api/create-user`
- `GET /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/active`
- `PATCH /api/users/:id/password`
- `POST /api/users/reset/:id`
- `GET /api/booking`
- `POST /api/booking`
- `PATCH /api/booking/:id`
- `GET /api/history/:id`
- `DELETE /api/history/:id`

## Environment

Create `server/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
JWT_SECRET=your_jwt_secret
DEFAULT_USER_PASSWORD=changeme123
SALTED_ENCODE=10
ISM_SERVER_PORT=3333
NODE_ENV=development
```

## Run

```bash
cd server
npm install
npm run dev
```

## Database

Prisma currently defines:

- `User`
- `Task`
- `TaskImages`

The current booking flow appears to reuse the `Task` model for reservation data.

## Notes

- The server falls back to port `3000` if `ISM_SERVER_PORT` is not set.
- The frontend is currently configured to call `http://localhost:3333/api`.
- Some backend naming still reflects older `product` and `task` terminology.
