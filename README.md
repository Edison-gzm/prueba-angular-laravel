# Prueba técnica – Angular + Laravel

Aplicación fullstack: **frontend** en Angular y **backend** en Laravel con PostgreSQL. Incluye autenticación, gestión de usuarios, productos y compras.

---

## Requisitos previos

- **Docker** y **Docker Compose**
- (Opcional) **Node.js 20+** y **PHP 8.2** con Composer si prefieres ejecutar backend o frontend sin Docker

---

## Paso a paso para que todo funcione

### 1. Clonar o descargar el proyecto

Abre una terminal en la carpeta donde quieras el proyecto y entra en la raíz del repositorio (donde está `docker-compose.yml`):

```bash
cd prueba-angular-laravel
```

### 2. Configurar el backend (Laravel)

En la carpeta `backend/app` debe existir un archivo **`.env`**. Si no existe:

- **Windows (PowerShell o CMD):**  
  `copy backend\app\.env.example backend\app\.env`
- **Linux / macOS:**  
  `cp backend/app/.env.example backend/app/.env`

Si creaste `.env` desde `.env.example`, configura la base de datos para PostgreSQL (cuando uses Docker):

- `DB_CONNECTION=pgsql`
- `DB_HOST=postgres_db`
- `DB_PORT=5432`
- `DB_DATABASE=prueba_db`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`

Genera la clave de aplicación si hace falta:

```bash
docker-compose exec backend php artisan key:generate
```

### 3. Levantar los contenedores

Desde la **raíz del proyecto** (donde está `docker-compose.yml`):

```bash
docker-compose up -d
```

Se levantarán: **postgres**, **backend** (Laravel), **node** (Angular) y **pgAdmin**.

### 4. Instalar dependencias del backend

```bash
docker-compose exec backend composer install
```

### 5. Crear tablas y cargar datos de prueba

Ejecuta migraciones y seeders para tener la base de datos lista y datos dummy:

```bash
docker-compose exec backend php artisan migrate --seed
```

O bien, desde la raíz del proyecto en PowerShell:

```powershell
.\setup-db.ps1
```

Con esto tendrás:

- Tablas creadas en PostgreSQL  
- **3 usuarios de prueba** (ver tabla más abajo)  
- **10 productos** de ejemplo  

### 6. Iniciar el servidor Laravel (API)

El contenedor **backend** no inicia el servidor solo. En **una terminal** deja corriendo:

```bash
docker-compose exec backend php artisan serve --host=0.0.0.0
```

No cierres esta terminal; la API quedará en **http://localhost:8000**.

### 7. Instalar dependencias e iniciar el frontend (Angular)

En **otra terminal**, desde la raíz del proyecto:

```bash
docker-compose exec node sh -c "cd frontend && npm install && npm start"
```

O, si tienes Node instalado en tu máquina:

```bash
cd frontend/frontend
npm install
npm start
```

La aplicación Angular se abrirá en **http://localhost:4200**.

### 8. Probar la aplicación

- **Frontend:** http://localhost:4200  
- **API Laravel:** http://localhost:8000  
- **pgAdmin** (opcional): http://localhost:5050 (usuario: `admin@admin.com`, contraseña: `admin`)

**Usuarios de prueba** (contraseña para todos: **`Password1!`**):

| Email              | Rol   |
|--------------------|-------|
| admin@prueba.com   | admin |
| usuario@prueba.com | user  |
| maria@prueba.com   | user  |

Inicia sesión en el frontend con cualquiera de estos correos y la contraseña anterior para probar la app con datos ya cargados.

---

## Resumen de comandos (orden)

Desde la raíz `prueba-angular-laravel`:

| Paso | Comando |
|------|---------|
| 1 | `docker-compose up -d` |
| 2 | `docker-compose exec backend composer install` |
| 3 | `docker-compose exec backend php artisan key:generate` *(solo si no tienes APP_KEY en .env)* |
| 4 | `docker-compose exec backend php artisan migrate --seed` |
| 5 | En una terminal: `docker-compose exec backend php artisan serve --host=0.0.0.0` |
| 6 | En otra terminal: `docker-compose exec node sh -c "cd frontend && npm install && npm start"` |

---

## Estructura del proyecto

```
prueba-angular-laravel/
├── docker-compose.yml
├── setup-db.ps1
├── README.md                 ← estás aquí
├── backend/
│   ├── Dockerfile
│   └── app/                  ← código Laravel (API)
├── frontend/
│   └── frontend/             ← código Angular
└── ...
```

---

## Solución de problemas

- **Error de conexión a la base de datos:** Comprueba que los contenedores estén en marcha (`docker-compose ps`) y que en `backend/app/.env` tengas `DB_HOST=postgres_db` cuando uses Docker.
- **El frontend no llama a la API:** La API debe estar en **http://localhost:8000** y el servidor Laravel corriendo con `php artisan serve --host=0.0.0.0`.
- **Cookies / sesión:** El frontend está en `localhost:4200` y el backend en `localhost:8000`; las cookies las fija el backend. Si hay problemas de sesión, revisa las cookies en las herramientas de desarrollo para **http://localhost:8000**.
