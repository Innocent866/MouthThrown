# MouthThrown

Full-stack e-commerce platform — *everything you love, thrown your way.*

| Part | Stack | Folder |
|---|---|---|
| API | Express + MongoDB (Mongoose), JWT auth, Cloudinary uploads, Nodemailer | `/` (repo root) |
| Web storefront | React 18 + Vite, MUI, `motion/react`, `react-window` | `client/` |
| Mobile app | React Native (Expo) | `mobile/` |

## Quick start

### 1. API (repo root)

```bash
npm install
npm run dev          # http://localhost:5750
```

`.env` required keys:

```
MONGO_URI=...
JWT_SECRETE=...
cloud_name=... api_key=... api_secret=...        # Cloudinary
EMAIL_SERVICE=... EMAIL_USERNAME=... EMAIL_PASSWORD=... EMAIL_FROM=...
```

### 2. Web client

```bash
cd client
npm install
npm run dev          # http://localhost:5173 (proxies /api → :5750)
npm run build        # production bundle in client/dist
```

If the API is offline or the catalogue is empty, the storefront falls back to a
built-in demo catalogue so it is always browsable.

### 3. Mobile app

```bash
cd mobile
npm install
npm start            # Expo — scan the QR with Expo Go
```

Set `API_URL` in `mobile/src/api.js` to your machine's LAN IP when testing on a device.

## Performance techniques used (web client)

1. **List virtualization** — `react-window` grid in `components/VirtualProductGrid.jsx`; only visible rows mount.
2. **Lazy loading** — `React.lazy` routes in `App.jsx` + native `loading="lazy"` images.
3. **Memoization** — `React.memo` product cards, `useMemo`/`useCallback` for cart totals and handlers.
4. **Throttling & debouncing** — `useThrottledCallback` (scroll/resize) and `useDebouncedValue` (search) in `hooks.js`.
5. **Code splitting** — per-page chunks plus vendor `manualChunks` in `vite.config.js`.
6. **React Fragments** — used throughout to avoid wrapper nodes.
7. **Web Worker** — product filter/sort runs off the main thread (`filter.worker.js`).
8. **useTransition** — keeps the Shop search box responsive while results re-render.

## Contact

Customers reach the store by e-mail: the Contact page posts to `POST /api/contact`,
which forwards the message via Nodemailer; the footer newsletter posts to
`POST /api/subscribe/userSubscription`.
