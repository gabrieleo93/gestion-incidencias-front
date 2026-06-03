# Gestión de Incidencias Frontend

Frontend desarrollado con **Angular 17** para consumir una API REST de gestión de incidencias creada con **Spring Boot**.

El proyecto forma parte de una aplicación full stack orientada a la gestión de usuarios e incidencias internas. Permite iniciar sesión, almacenar el token JWT, consultar incidencias y crear nuevas incidencias desde una interfaz web.

---

## Tecnologías utilizadas

* Angular 17
* TypeScript
* HTML
* CSS
* Angular Router
* Reactive Forms
* HttpClient
* JWT
* LocalStorage
* Git / GitHub

---

## Funcionalidades implementadas

* Login de usuario contra API Spring Boot.
* Validación de formulario con Reactive Forms.
* Consumo de endpoint `POST /api/auth/login`.
* Almacenamiento de token JWT en `localStorage`.
* Interceptor HTTP para enviar automáticamente el token en las peticiones.
* Navegación entre pantallas con Angular Router.
* Listado de incidencias desde el backend.
* Creación de nuevas incidencias desde formulario Angular.
* Comunicación real con backend protegido por JWT.

---

## Backend utilizado

Este frontend consume la API:

```text
gestion-incidencias-api
```

Backend desarrollado con:

* Java 17
* Spring Boot
* Spring Security
* JWT
* MySQL
* Swagger
* JPA

URL local del backend:

```text
http://localhost:8082
```

---

## Estructura principal del proyecto

```text
src/app
│
├── core
│   ├── interceptors
│   └── services
│
├── features
│   ├── auth
│   │   └── login
│   │
│   └── incidencias
│       ├── listado-incidencias
│       └── crear-incidencia
│
├── models
│
├── app.component.html
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

---

## Modelos principales

### AuthRequest

Representa los datos enviados al backend para iniciar sesión.

```ts
export interface AuthRequest {
  email: string;
  password: string;
}
```

### AuthResponse

Representa la respuesta del backend después de iniciar sesión.

```ts
export interface AuthResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  nombre: string;
  email: string;
  rol: 'USER' | 'ADMIN' | 'TECNICO';
}
```

### Incidencia

Representa una incidencia recibida desde el backend.

```ts
export interface Incidencia {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA' | 'CERRADA';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  fechaCreacion: string;
  fechaActualizacion: string | null;
  fechaCierre: string | null;
  usuarioCreadorId: number;
  nombreUsuarioCreador: string;
}
```

### IncidenciaRequest

Representa los datos enviados al backend para crear una incidencia.

```ts
export interface IncidenciaRequest {
  titulo: string;
  descripcion: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  usuarioCreadorId: number;
}
```

---

## Rutas principales

| Ruta                 | Descripción                      |
| -------------------- | -------------------------------- |
| `/login`             | Pantalla de inicio de sesión     |
| `/incidencias`       | Listado de incidencias           |
| `/incidencias/nueva` | Formulario para crear incidencia |

---

## Flujo de autenticación

1. El usuario introduce email y contraseña en `/login`.
2. Angular envía los datos al backend mediante `POST /api/auth/login`.
3. El backend responde con un token JWT.
4. El frontend guarda el token y datos básicos del usuario en `localStorage`.
5. El interceptor añade automáticamente el token en las peticiones protegidas.
6. El usuario accede al listado y creación de incidencias.

Header enviado automáticamente:

```http
Authorization: Bearer TOKEN
```

---

## Servicios implementados

### AuthService

Responsable de:

* Hacer login.
* Guardar sesión en `localStorage`.
* Obtener token.
* Obtener rol.
* Validar si el usuario está autenticado.
* Cerrar sesión.

### IncidenciaService

Responsable de:

* Listar incidencias.
* Crear nuevas incidencias.

---

## Interceptor JWT

El proyecto incluye un interceptor HTTP que revisa si existe un token en `localStorage`.

Si existe, lo agrega automáticamente a cada petición HTTP:

```ts
Authorization: Bearer TOKEN
```

Esto evita repetir manualmente los headers en cada servicio.

---

## Instalación y ejecución

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar en la carpeta:

```bash
cd gestion-incidencias-front
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el proyecto:

```bash
ng serve
```

Abrir en el navegador:

```text
http://localhost:4200
```

---

## Requisitos para probar

Antes de ejecutar el frontend, debe estar levantado el backend en:

```text
http://localhost:8082
```

También es necesario que el backend tenga configurado CORS para permitir peticiones desde:

```text
http://localhost:4200
```

---

## Pruebas realizadas

Se realizaron pruebas manuales para validar:

* Login con usuario existente.
* Validación de formulario de login.
* Recepción de token JWT.
* Almacenamiento de token en `localStorage`.
* Envío automático del token mediante interceptor.
* Carga de incidencias desde backend.
* Creación de incidencias desde Angular.
* Navegación entre login, listado y formulario de creación.

---

## Estado actual del proyecto

Proyecto frontend funcional con:

* Login.
* Token JWT.
* Interceptor.
* Listado de incidencias.
* Creación de incidencias.
* Consumo real de API Spring Boot.
* Navegación básica.

---

## Próximas mejoras

* Crear barra superior con nombre de usuario, rol y botón de logout.
* Mostrar u ocultar acciones según rol.
* Crear guards para proteger rutas.
* Permitir cambiar estado y prioridad desde Angular.
* Mejorar estilos visuales.
* Añadir página de detalle de incidencia.
* Preparar capturas para documentación del proyecto.
* Crear README final con imágenes del flujo.

---

## Autor

Gabriel Leonardo Isturiz Guía
Desarrollador Web Junior Full Stack
