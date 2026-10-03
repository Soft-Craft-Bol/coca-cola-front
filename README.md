# Coca-Cola Event Intelligence · Frontend

React 19 + TypeScript + Vite + React Router + Recharts + Zustand + Lucide.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
```

## Backend
El frontend consume la API Spring Boot (`../cocacola/cocacola`). Configura la URL en `.env`:

```
VITE_API_URL=http://localhost:8080/api
```

Arranca primero el backend (`mvn spring-boot:run`); al iniciar carga usuarios demo, el catálogo de productos y 3 eventos de ejemplo.
Todo el acceso HTTP pasa por `src/shared/services/api.ts` (token JWT en `Authorization: Bearer`, errores `{ "message": "..." }`; ante un 401 cierra la sesión).

Usuarios demo: admin@cocacola.com / admin123, organizador@cocacola.com / org123, marketing@cocacola.com / mkt123.
Registro público (sin login): `/registro/:eventId`.

## Estructura
```
src
├── app        (routes, providers, store)
├── features   (auth, users, events, participants, checkin, activities, surveys, dashboard, reports)
├── shared     (components, hooks, utils, services, constants, types)
├── layouts · assets · styles · main.tsx
```
Los tipos de los DTOs del backend están en `src/shared/types/index.ts`.
