# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Autenticación y cookies

- **Login**: el backend devuelve un token en la respuesta JSON y también lo envía en una **cookie HttpOnly** (`auth_token`).
- **Logout**: al cerrar sesión se llama a la API para revocar el token y se elimina la cookie; además se limpia `localStorage` en el navegador.

### Cómo comprobar que las cookies funcionan

1. Abre las **DevTools** del navegador (F12).
2. Ve a la pestaña **Application** (Chrome) o **Storage** (Firefox).
3. En el panel izquierdo, expande **Cookies** y selecciona la URL de tu app (ej. `http://localhost:4200`).
4. **Después de hacer login**: deberías ver una cookie (por ejemplo `auth_token` si el backend la envía al mismo dominio).  
   Si el frontend está en `localhost:4200` y el backend en `localhost:8000`, la cookie la fija el dominio del backend (`localhost:8000`); en ese caso revisa las cookies bajo **http://localhost:8000**.
5. **Después de cerrar sesión**: esa cookie debe desaparecer o quedar vacía.

Si no ves la cookie, comprueba que las peticiones de login llevan `withCredentials: true` y que el backend responde con `Set-Cookie` y CORS permite credenciales (`Access-Control-Allow-Credentials: true`).

## Acceso a Carrito y Cerrar sesión

- **Carrito** (`/cart`): solo se puede entrar si estás **logueado**. Si al hacer clic en "Carrito" te lleva al login, inicia sesión primero.
- **Cerrar sesión**: limpia token y rol en el cliente y redirige a Inicio; aunque falle la petición al backend, la sesión local se cierra igual.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
