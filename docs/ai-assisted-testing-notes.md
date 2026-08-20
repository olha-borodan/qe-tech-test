# A note on AI-assisted test writing

I used an AI assistant to draft parts of this suite, including
`api/tests/booking-update.spec.ts`. It's worth being upfront about what it
got wrong and what I had to fix, since that's part of the QE work too —
reviewing AI output is not the same as trusting it.

## What the AI got wrong

**1. Assumed textbook REST status codes instead of checking the real API.**

The first draft asserted `401` for an invalid token and `404` for updating a
nonexistent booking id — the "correct" REST answers. Neither is what
Restful-Booker actually returns. Running the tests against the real API
immediately failed both, which is exactly the point of running tests instead
of just reading them. I fixed the expected values to `403` and `405` and
left comments in the spec noting the mismatch, since a future reader would
make the same wrong assumption otherwise:

```ts
// Expected: 401 Unauthorized. Actual: 403 Forbidden.
expect(response.status(), 'update without a valid token returns 403 (401 expected)').toBe(403);
```

**2. No assertion messages.**

The draft had bare `expect(...).toBe(...)` calls. Fine when a test is green,
useless when it's red in CI at 2am and you're trying to figure out which of
five assertions in the file failed. I added a message to every `expect`.

**3. Shared booking id across tests.**

The first version created one booking in the whole `describe` block and
reused its id in every test. Since several tests mutate that booking (PUT,
PATCH), later tests were silently depending on the mutated state left behind
by earlier ones — test order mattered, which it shouldn't. I moved booking
creation into `beforeEach` so every test starts from a known, isolated state.

**4. Partial-field comparison hid a real bug.**

The original "update returns the updated booking" test only checked that
`firstname` matched the new value. That would still pass even if the API
silently dropped every other field from the response. I changed it to
`toEqual` against the full updated object, which is a stronger and more
honest contract check.