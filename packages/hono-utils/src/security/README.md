# Security

## Resources

- [The Copenhagen Book](https://thecopenhagenbook.com/)
- [Lucia Auth](https://lucia-auth.com/)
- [AuthJs](https://authjs.dev/)
- [Better-Auth](https://www.better-auth.com/)

## Why a Lower-Level Auth Approach?

- [Oh, Auth Doesn't Have to Suck?](https://www.youtube.com/watch?v=S37uRvBr65k)

We chose to build on lower-level primitives rather than using highly abstracted auth solutions (like [AuthJs](https://authjs.dev/), [Better-Auth](https://www.better-auth.com/), etc.). This approach:

- Provides better control and understanding of the auth flow
- Allows flexible composition of auth components
- Maintains simplicity by avoiding unnecessary abstractions
- Makes it easier to debug and maintain long-term
- Supports non-standard auth flows (e.g., Bluesky's authentication, which deviates from standard OAuth and isn't supported by AuthJs)

This aligns with the philosophy of tools like Lucia Auth that provide essential building blocks while letting developers maintain control over the implementation.

## Session Strategies Comparison

- [Session Vs JWT: The Differences You May Not Know!](https://www.youtube.com/watch?v=fyTxwIa-1U0)
- [Authentication: JWT usage vs session](https://stackoverflow.com/questions/43452896/authentication-jwt-usage-vs-session)
- [JWT should not be your default for sessions](https://evertpot.com/jwt-is-a-bad-default/)

### Server-side Sessions

- Server maintains session state in a storage (e.g. database)
- Session ID stored on client (typically in cookies), server validates against storage
- Pros:
  - Easy server-side session invalidation (by removing session from storage)
  - Complete control over sessions on the server
- Cons:
  - Additional storage required
  - Extra server & database load for each request
  - More complex horizontal scaling

### Client-side Sessions with JWT

- Stateless tokens containing encoded user information
- Session state stored on client in signed token (typically in cookies)
- Server verifies token signature
- Pros:
  - No server-side storage needed (to verify session)
  - Can include useful claims (e.g. expiration, ..)
  - Easier horizontal scaling
- Cons:
  - Cannot truly invalidate tokens before expiration
    -> Session invalidation requires additional logic (e.g. cookie removal)
  - Need to balance token expiration time
  - Need secure client-side token storage strategy (e.g. httpOnly cookies)

### Implementation Decision

We chose client-side sessions using JWTs with the following details:

- JWTs stored in httpOnly cookies
- 30-day expiration time
- Session ends by removing cookie
- Signed with server's private key

Rationale:

- Eliminates database queries for session verification
- Cookies provide secure storage and transport:
  - httpOnly prevents JavaScript access (XSS)
- Simple to implement and maintain
- Easy to scale horizontally

Future Security Enhancements (if needed):

- Reduce token lifetime (e.g. by introducing refresh token)
- Add timestamp-based token invalidation (e.g. mark all tokens of a user that were created before a certain time as invalid, but requires constant database queries)
