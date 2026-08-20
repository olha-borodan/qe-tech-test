# Manual testing

Before writing the automated suite, I explored the Restful-Booker API
manually in Postman — auth, ping, and all the booking CRUD endpoints. That
exploration is what surfaced most of what's written up in
[api-notes.md](api-notes.md) (the 403-vs-401, 405-vs-404, missing auth on
create, etc.) — the automated tests came after, to lock the real behaviour
in and catch regressions.

The collection and environment are in [postman/](postman/) if you want to
poke at the API yourself:

- `postman/restful-booker.postman_collection.json`
- `postman/test.postman_environment.json`

## Setup

1. Import both files into Postman.
2. Select the `test` environment.
3. Set `api_url` to `https://restful-booker.herokuapp.com`.
4. Run **auth → create-token** first — it saves the returned token into the
   `token` environment variable automatically.
5. Run **booking → create-booking** — it saves the returned id into
   `booking_id`, which the update/patch/delete requests use.

`token` and `booking_id` are populated by test scripts on those two
requests, so there's nothing to fill in by hand beyond `api_url`.
