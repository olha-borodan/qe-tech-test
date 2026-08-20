# API notes

Random things I noticed while writing the tests against Restful-Booker.
None of these are bugs in this repo — it's the API itself being weird —
but worth writing down since a real consumer would hit the same surprises.
Specs that assert the actual (wrong-looking) behaviour are linked below.

**Delete returns 201, not 204.** You'd expect `204 No Content` or maybe
`200` for a successful delete. Instead you get `201 Created`, which is a
strange choice for an operation that's removing something, not creating
it. [booking-deletion.spec.ts](../api/tests/booking-deletion.spec.ts)

**Health check also returns 201.** `GET /ping` is just "are you alive",
nothing gets created, and yet it's `201` too. Maybe the two are related —
feels like whatever framework this is built on defaults to 201 somewhere
and nobody overrode it. [health.spec.ts](../api/tests/health.spec.ts)

**Bad token gives 403, should be 401.** Every write endpoint (update,
partial update, delete) responds `403 Forbidden` when the token is
garbage. 403 means "I know who you are and you're not allowed" — but
nobody's authenticated here, so `401` is the right code. Consistent
across all three endpoints at least, so it's a deliberate (if wrong)
choice, not a fluke.

**Deleting/updating an id that doesn't exist returns 405, not 404.**
`PUT`, `PATCH`, `DELETE` on a nonexistent booking id all give `405
Method Not Allowed`. That's odd because the method absolutely is allowed
on that route — it's the id that's missing. What's interesting is `GET`
on a bad id gets this right and returns `404`. So it's not that the API
doesn't know how to 404, it just doesn't bother for anything past GET.

**Create needs no auth at all.** `POST /booking` works with zero token —
anyone can create a booking. Every other mutating endpoint (update,
patch, delete) requires one. Not sure if that's intentional (maybe
booking creation is meant to be public, like a customer-facing form) or
just an oversight, but it's inconsistent either way.

**Wrong password on /auth still returns 200.** Instead of `401`, a bad
login gets `200 OK` with `{ reason: "Bad credentials" }` in the body and
no token. So you can't just check the status code to know if login
worked — you have to parse the body every time.

**Missing-field validation is inconsistent between create and update.**
Send a booking payload with no `firstname` to `POST /booking` and you
get a `500` — looks like the server just falls over rather than
validating. Send the exact same broken payload to `PUT` on an existing
booking and it correctly returns `400`. Same shape, same missing field,
different endpoint, wildly different result.

**Empty PATCH is a silent no-op.** `PATCH` with `{}` as the body is
accepted, returns `200`, and the booking comes back unchanged. Not
wrong exactly, just worth knowing it doesn't reject a pointless request.
