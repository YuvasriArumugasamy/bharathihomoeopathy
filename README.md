# Dr. Bharathi's Homeo Care

A React and Vite storefront with an Express and MongoDB API for homeopathic products, appointments, and clinic administration.

## Requirements

- Node.js and npm
- MongoDB connection string
- Backend environment values configured in `backend/.env` (see `backend/config` for required integrations)

## Run locally

Install frontend dependencies and start Vite from the repository root:

```powershell
npm install
npm run dev
```

In a second terminal, start the API:

```powershell
cd backend
npm install
npm run dev
```

The frontend uses `http://localhost:5000/api` for the local API by default. Set `VITE_API_URL` if the API runs at a different address.

## Production build

Build the frontend from the repository root:

```powershell
npm run build
```

Start the backend from `backend/` with:

```powershell
npm start
```

Do not commit `.env` files or credentials.
