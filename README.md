# 📝 Secure Notes (React + TypeScript + Vite)

Frontend for a secure one-time note app, built with Vite + React + TypeScript. It creates encrypted notes via the API and reads them once and Burns after reading.


## ⭐Capabilities

**📝 Create Note:** textarea + expiry selector → calls API → shows shareable link.
**🔥 Read Once:** opens /n/:id, fetches the note once, displays plaintext, then the link is useless.
**⚠️ Error codes:**
  - 404 not found/expired
  - 500 generic network/server errors handled gracefully

**📋 Copy link:** one‑click copy to clipboard.
**🎯 Routing:** React Router with / (create) and /n/:id (read).

---
## 🏗️Structure

```
src/
├─ api/http.ts                            # API wrapper
├─ assets/*.css                           # Styling
├─ pages/ (CreateNote.tsx, ReadNote.tsx)  # Ppages
├─ App.tsx                                # routes
├─ main.tsx                               # entry point
└─ Dockerfile
```
---
## 🖇️API Integration

**API URL:** uses VITE_API_BASE_URL for API Base url.
**Guarded useEffect:** used to prevents double fetch (React StrictMode).
**Endpoints:**
- **POST /api/notes**  returns  ```{ id, url }```
- **GET /api/notes/:id** returns  ```{ message }```

---
## 🌐Build and Serve
In Docker, the app is built with Vite and served via Nginx.

From inside privnotecloneClient folder:

```bash
# build image, tag it "privnote-web"
docker build -t privnote-web .
```

Run it:

```bash
docker run -p 8080:80 \
  -e VITE_API_BASE_URL="http://localhost:3000" \
  privnote-web
```

---
## ⚙️Technical Notes

**🧱 Stack:** Vite + React + TypeScript
**🧭 Routing:** React Router — ```/``` (CreateNote), ```/n/:id``` (ReadNote)
**🔌 HTTP:** Minimal fetch wrapper in ```services/http.ts``` with JSON parsing and error mapping (adds status to errors)
**⚙️ Config (.env):** ```VITE_API_BASE_URL``` for  API base (eg http://localhost:3000). Use '' for same‑origin calls behind a reverse proxy, then fetch('/api/...').