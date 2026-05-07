# Authentication Flow

Linkhub uses [better-auth](https://better-auth.com) with email + password and an httpOnly session
cookie. The Vue client lives at `lib/auth-client.ts`; the server-side configuration is at
`server/lib/auth.ts`; every `/api/auth/*` request flows through the catch-all handler at
`server/api/auth/[...all].ts`.

## Sign-up

```mermaid
sequenceDiagram
  actor U as User
  participant FE as register.vue
  participant AC as auth-client (better-auth/vue)
  participant API as POST /api/auth/sign-up/email
  participant Auth as betterAuth() handler
  participant DB as Postgres

  U->>FE: submits form (name, username, email, password)
  FE->>AC: signUp.email({ email, password, name, username })
  AC->>API: HTTP POST with JSON body
  API->>Auth: auth.handler(toWebRequest(event))
  Auth->>DB: INSERT user (incl. custom username/bio/avatarUrl)
  Auth->>DB: INSERT account (provider=credential, hashed password)
  Auth->>DB: INSERT session
  Auth-->>API: 200 + Set-Cookie better-auth.session_token
  API-->>AC: { token, user }
  AC-->>FE: resolved promise (no error field)
  FE->>FE: navigateTo('/dashboard')
```

The `username` field flows through better-auth as an `additionalFields` entry (server-side, in
`server/lib/auth.ts`). `bio` and `avatarUrl` are configured `input: false` so a malicious client
can't set them on signup; they're managed via the profile endpoints.

## Sign-in

```mermaid
sequenceDiagram
  actor U as User
  participant FE as login.vue
  participant AC as auth-client
  participant API as POST /api/auth/sign-in/email
  participant DB as Postgres

  U->>FE: submits (email, password)
  FE->>AC: signIn.email({ email, password })
  AC->>API: HTTP POST
  API->>DB: SELECT user, account by email
  API->>API: verify password hash
  alt password OK
    API->>DB: INSERT session
    API-->>AC: 200 + Set-Cookie + { token, user }
    AC-->>FE: { error: null }
    FE->>FE: navigateTo(redirect ?? '/dashboard')
  else bad password
    API-->>AC: 401 INVALID_EMAIL_OR_PASSWORD
    AC-->>FE: { error: { message } }
    FE->>FE: render <Message severity="error">
  end
```

## Session check (every page load)

```mermaid
sequenceDiagram
  participant FE as Page / AppHeader
  participant AC as auth-client
  participant API as GET /api/auth/get-session
  participant DB as Postgres

  FE->>AC: await authClient.useSession(useFetch)
  AC->>API: GET (cookie forwarded by useFetch during SSR)
  API->>DB: SELECT session WHERE token=?
  alt session valid
    API->>DB: SELECT user
    API-->>AC: { session, user }
  else missing/expired
    API-->>AC: null
  end
  AC-->>FE: ref<Session | null>
```

## Route protection

`middleware/auth.ts` runs on every navigation to a `definePageMeta({ middleware: 'auth' })` page
(currently `/dashboard`):

```ts
const { data: session } = await authClient.useSession(useFetch)
if (!session.value) {
  return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
}
```

`middleware/guest.ts` is the inverse — applied to `/login` and `/register` so a signed-in user
gets bounced to `/dashboard` instead of seeing the auth forms again.

## Sign-out

```mermaid
sequenceDiagram
  actor U as User
  participant FE as Header / logout.vue
  participant AC as auth-client
  participant API as POST /api/auth/sign-out
  participant DB as Postgres

  U->>FE: click Logout
  FE->>AC: signOut()
  AC->>API: POST (Content-Type: application/json)
  API->>DB: DELETE session
  API-->>AC: 200 + Set-Cookie cleared
  AC-->>FE: resolved
  FE->>FE: navigateTo('/login')  (or '/' from /logout page)
```

## Authenticated API requests

Server routes that require auth go through `requireUser(event)` from `server/lib/session.ts`:

```ts
const me = await requireUser(event)
// throws createError({ statusCode: 401 }) if no session
```

`requireUser` calls `auth.api.getSession({ headers: event.headers })` — the standard better-auth
helper for reading the session out of an h3 event. There's no second copy of cookie/JWT logic
anywhere in the codebase.
