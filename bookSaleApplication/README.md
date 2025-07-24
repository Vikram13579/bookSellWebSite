# Book Sale Application Backend

This is a Spring Boot backend for a Book Sale Application, featuring user authentication, book management, cart operations, order processing, and user profile management.

## Features
- User registration, login, logout (JWT authentication)
- Book listing and details
- Cart management (add, remove, update, view)
- Order placement
- User profile view and update

## Tech Stack
- Java 17
- Spring Boot 3
- Spring Data JPA (Hibernate)
- Spring Security (JWT)
- H2 Database (in-memory, easy to switch to MySQL/Postgres)
- Lombok

## Getting Started

### Prerequisites
- Java 17+
- Maven

### Build & Run

```
mvn clean install
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

### API Endpoints
See the source code for full API details. Main endpoints:
- `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- `/api/books`, `/api/books/{id}`
- `/api/cart/add`, `/api/cart/remove/{itemId}`, `/api/cart`, `/api/cart/update/{itemId}`
- `/api/orders/buy`
- `/api/user/profile`

---

You can switch to MySQL/Postgres by editing `src/main/resources/application.properties`. 