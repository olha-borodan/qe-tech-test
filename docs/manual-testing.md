# Manual testing

Before writing the automated suite, I explored the Restful-Booker API
manually in Postman — auth, ping, and all the booking CRUD endpoints. That
exploration is what surfaced most of what's written up below (the
403-vs-401, 405-vs-404, missing auth on create, etc.) — the automated tests
came after, to lock the real behaviour in and catch regressions.

None of these are bugs in this repo — it's the API itself being weird —
but worth writing down since a real consumer would hit the same surprises.

## Observations

| Area | Expected | Actual | Notes |
|---|---|---|---|
| `DELETE /booking/{id}` | `204` or `200` | `201 Created` | Odd choice for an operation that removes something rather than creating it. [booking-deletion.spec.ts](../api/tests/booking-deletion.spec.ts) |
| `GET /ping` (health check) | `200` | `201 Created` | Nothing is created by a liveness check. [health.spec.ts](../api/tests/health.spec.ts) |
| Invalid token on `PUT` / `PATCH` / `DELETE` | `401 Unauthorized` | `403 Forbidden` | 403 implies "authenticated but not allowed"; nobody's authenticated here. Consistent across all three endpoints, so it's deliberate, just wrong. |
| `PUT` / `PATCH` / `DELETE` on a nonexistent booking id | `404 Not Found` | `405 Method Not Allowed` | The method is allowed on the route — it's the id that's missing. `GET` on a bad id correctly returns `404`, so the bug is specific to write methods. |
| `POST /booking` (create) | requires a token, like other mutating endpoints | no token required | Every other write endpoint (update, patch, delete) enforces auth; create doesn't. Inconsistent either way, intentional or not. |
| `POST /auth` with wrong password | `401 Unauthorized` | `200 OK` with `{ reason: "Bad credentials" }`, no token | Status code alone doesn't tell you login failed — the body has to be parsed every time. |
| `POST /booking` with a required field missing (e.g. `firstname`) | `400 Bad Request` | `500 Internal Server Error` | `PUT` with the exact same missing field correctly returns `400`. Same validation rule, enforced on one endpoint and not the other. |
| `PATCH /booking/{id}` with `{}` | reject, or no-op | `200`, booking unchanged | Not wrong, just a silent no-op worth knowing about. |
