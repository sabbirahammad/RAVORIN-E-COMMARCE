Google auth was added in the `my-react-app-main` frontend.

Required frontend env:

- `VITE_GOOGLE_CLIENT_ID=your_google_oauth_web_client_id`

Frontend files updated:

- `my-react-app-main/src/Pages/AuthPage.jsx`

How it works:

1. Google Identity Services button renders on `/auth`.
2. Google returns an ID token credential.
3. Frontend posts that credential to:
   - `POST /api/v1/auth/google`
4. Backend verifies the token, creates/logs in the user, and returns your app JWT.

Before running locally:

```bash
npm install
```

Then set:

- frontend `.env`:
  - `VITE_GOOGLE_CLIENT_ID=...`
- backend `.env`:
  - `GOOGLE_CLIENT_ID=...`
