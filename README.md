# FORESTY Restaurant

Single-project Next.js restaurant showcase app with App Router pages and API Route Handlers. The frontend, authentication, MongoDB CRUD operations, admin flows, delivery flows, notifications, and Cloudinary uploads all run from this Next.js project, so no separate Express deployment is required.

## Migration Plan

1. Move Express controllers and middleware into `src/app/api/**/route.js` handlers.
2. Share server-only logic through `src/lib/db.js`, `src/lib/auth.js`, `src/lib/cloudinary.js`, `src/lib/api-helpers.js`, `src/lib/schemas.js`, and `src/lib/models/*`.
3. Keep frontend UI components unchanged while pointing the axios client at relative `/api` routes.
4. Replace Socket.io-only behavior with serverless-safe polling where needed.
5. Deploy the single Next.js project to Vercel with MongoDB, JWT, and Cloudinary environment variables.

## File-by-File Changes

- `src/app/api/auth/*/route.js`: Next.js route handlers for login, registration, profile, forgot/reset password, and Google placeholder.
- `src/app/api/menu/*/route.js`: menu CRUD handlers using MongoDB and admin JWT protection.
- `src/app/api/orders/*/route.js`: customer/admin order create, read, assign, and status handlers.
- `src/app/api/delivery/*/route.js`: delivery-agent order and stats handlers.
- `src/app/api/users/*/route.js`: admin user management handlers.
- `src/app/api/notifications/*/route.js`: notification list and read handlers.
- `src/app/api/analytics/dashboard/route.js`: admin dashboard analytics handler.
- `src/app/api/upload/route.js`: Cloudinary upload handler using `formData()`.
- `src/lib/db.js`: cached Mongoose connection for Vercel serverless reuse.
- `src/lib/auth.js`: JWT generation, request authentication, and role checks.
- `src/lib/cloudinary.js`: Cloudinary SDK configuration.
- `src/lib/api-helpers.js`: shared audit logging helper.
- `src/lib/schemas.js`: shared Zod validation schemas.
- `src/lib/models/*`: unchanged MongoDB schema definitions moved into the Next.js app.
- `src/app/lib/api.js`: frontend axios client now uses `baseURL: '/api'`.
- `src/app/context/SocketContext.js`: retained compatibility provider with no external socket server.
- `src/app/context/NotificationContext.js`: uses `/api/notifications` polling.
- `src/app/my-orders/page.js`: uses `/api/orders` polling for serverless-safe order updates.
- `package.json`: app dependencies include `mongoose`, `jsonwebtoken`, `bcryptjs`, `cloudinary`, and `zod`; scripts run Next.js only.
- `next.config.mjs`: image remote patterns only; no proxy configuration.

## Deleted Backend Files

The separate `server/` backend should not be deployed. This checkout has no `server/` directory remaining. If an old copy exists elsewhere, delete it from the deploy target along with Express-only deployment files such as `server/package.json`, `server/index.js`, `server/routes/*`, `server/controllers/*`, `server/middleware/*`, `server/models/*`, and backend host config for Railway/Render.

## Final Project Structure

```text
FORESTY-RESTURANT/
  public/
  src/
    app/
      api/
        analytics/dashboard/route.js
        auth/*/route.js
        delivery/**/route.js
        menu/**/route.js
        notifications/**/route.js
        orders/**/route.js
        upload/route.js
        users/**/route.js
      admin/
      cart/
      context/
      delivery/
      lib/api.js
      login/
      my-orders/
      order/
      profile/
      register/
      page.js
      layout.js
      globals.css
    lib/
      models/
      api-helpers.js
      auth.js
      cloudinary.js
      db.js
      schemas.js
  next.config.mjs
  package.json
```

## Environment Variables

Create `.env.local` for local development and add the same values in Vercel Project Settings:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER/DATABASE?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Do not add `PORT`, `CLIENT_URL`, `BACKEND_URL`, `NEXT_PUBLIC_API_URL`, `RAILWAY_*`, `RENDER_*`, or Express server variables for this deployment.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

1. Registration: create a customer at `/register`, confirm a token and user are stored, then confirm `/api/auth/me` returns the profile.
2. Login: log in at `/login` as customer, admin, and delivery accounts and confirm role-based redirects.
3. CRUD: as admin, create, update, and delete menu items at `/admin/menu`; confirm data persists in MongoDB.
4. Orders: place an order as customer, manage status/assignment as admin, and view assigned orders as delivery.
5. Cloudinary: upload a menu image from the admin menu form and confirm the saved URL is a `res.cloudinary.com` URL.
6. Notifications/order updates: confirm notifications and order history refresh without a separate socket server.
7. Production: run `npm run build`, deploy only this Next.js project to Vercel, add the environment variables above, and verify the same flows on the Vercel URL.
