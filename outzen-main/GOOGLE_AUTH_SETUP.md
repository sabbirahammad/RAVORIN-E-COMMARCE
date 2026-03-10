Google auth was added in the `outzen-main` backend.

Required backend env:

- `GOOGLE_CLIENT_ID=your_google_oauth_web_client_id`
- `JWT_SECRET=your_jwt_secret`
- `MONGO_URI=your_mongodb_connection_string`

Backend files updated:

- `outzen-main/package.json`
- `outzen-main/models/userModel.js`
- `outzen-main/controllers/authController.js`
- `outzen-main/routes/authRoutes.js`

Install/update dependency before running:

```bash
npm install
```

Google Cloud Console setup:

1. Create or open a project.
2. Configure OAuth consent screen.
3. Create an `OAuth Client ID` for `Web application`.
4. Add Authorized JavaScript origins:
   - `http://localhost:5174`
   - your production frontend domain
5. Copy the client ID into:
   - backend env as `GOOGLE_CLIENT_ID`
   - frontend env as `VITE_GOOGLE_CLIENT_ID`
