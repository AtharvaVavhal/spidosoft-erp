# SpidoSoft ERP — Backend (foundation)

Java 21 · Spring Boot 3.5.16 · Maven (wrapper) · Spring Web · Validation · Data JPA · Springdoc OpenAPI ·
MapStruct · Lombok · JUnit 5.

> **Status: Phase 3 foundation.** Only `/api/system/health` and `/api/system/version` are implemented.
> Item, Customer and Supplier modules contain **contracts only**: DTOs, mapper, service and controller
> interfaces. There are no entities, repositories, implementations or migrations. The mapping module is a
> placeholder: **persistence model intentionally deferred.** See `docs/10-database-requirements-validation.md`
> §10 for what blocks each module.

## Run

Requires JDK 21. On this machine JDK 21 is installed via Homebrew alongside JDK 17, so set `JAVA_HOME`
explicitly:

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
./mvnw verify            # compile + tests
./mvnw spring-boot:run   # http://localhost:8080
```

| URL | What |
|---|---|
| `GET /api/system/health` | `{ status: "UP", database: "NOT_CONFIGURED" \| "UP" \| "DOWN" }` |
| `GET /api/system/version` | name, version, build time, Java and Spring Boot versions |
| `/api/docs` · `/api/docs/ui` | OpenAPI JSON · Swagger UI (disable with `ERP_API_DOCS_ENABLED=false`) |

Every response uses the envelope `{ success, data, error, timestamp }`. Errors carry a stable `code`
(`ErrorCode`), field `violations`, `path` and `requestId`. The request id is also returned in the
`X-Request-Id` header and logged on every line.

## Profiles and database

| Profile | Behaviour |
|---|---|
| `nodb` (default) | DataSource/JPA auto-configuration excluded. Starts with no database. |
| `db` | Placeholders only: `ERP_DB_URL`, `ERP_DB_USERNAME`, `ERP_DB_PASSWORD`, `ERP_DB_DRIVER`. `ddl-auto: none`. |

The **database engine is TBD**, so no JDBC driver is declared. Before the `db` profile can be used,
Spidosoft must confirm the engine and supply the schema; then add the matching driver dependency.
Never enable schema generation.

## Package layout (`com.spidosoft.erp`)

| Package | Contents |
|---|---|
| `application` | `SystemController` (health, version) |
| `common` | `PageQuery`, `@Tbd` (marks code waiting on a Spidosoft decision) |
| `config` | `ErpProperties`, CORS `WebConfig`, `RequestIdFilter` (correlation id + request log), `OpenApiConfig` |
| `exception` | `ErrorCode`, `ErpException`, `ResourceNotFoundException`, `PendingConfirmationException`, `GlobalExceptionHandler` |
| `response` | `ApiResponse`, `ApiError`, `FieldViolation`, `PageResponse` |
| `validation` | `ColumnLimits` (confirmed column type limits), `ValidationGroups` |
| `item`, `customer`, `supplier` | `dto`, `mapper`, `service`, `controller` — contracts only |
| `mapping` | Placeholder interfaces only — persistence model intentionally deferred |

Search for `@Tbd` to list every place that changes once Spidosoft answers `docs/10` §9.
