# Gestión de Incidencias Frontend

Frontend desarrollado con **Angular 17** para consumir una API REST de gestión de incidencias creada con **Spring Boot**.

El proyecto forma parte de una aplicación full stack orientada a la gestión de usuarios e incidencias internas. Permite iniciar sesión, almacenar el token JWT, consultar incidencias, crear nuevas incidencias y controlar la navegación según autenticación y rol de usuario.

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
* Guards
* Interceptors
* Git / GitHub

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
* JPA / Hibernate

URL local del backend:

```text
http://localhost:8082
```

---

## Funcionalidades implementadas

* Login de usuario contra API Spring Boot.
* Validación de formulario con Reactive Forms.
* Consumo de endpoint `POST /api/auth/login`.
* Almacenamiento del token JWT en `localStorage`.
* Almacenamiento de datos básicos del usuario:

  * token
  * usuarioId
  * nombre
  * email
  * rol
* Interceptor HTTP para enviar automáticamente el token en peticiones protegidas.
* Navegación entre pantallas con Angular Router.
* Listado de incidencias desde el backend.
* Creación de nuevas incidencias desde formulario Angular.
* Comunicación real con backend protegido por JWT.
* Navbar superior con:

  * nombre de la aplicación
  * enlaces de navegación
  * nombre del usuario
  * rol del usuario
  * botón de cerrar sesión
* Logout funcional:

  * elimina datos de sesión del `localStorage`
  * redirige al usuario a `/login`
* AuthGuard para proteger rutas privadas.
* Control visual por rol en la interfaz:

  * ADMIN puede ver opción de crear incidencia
  * USER puede ver opción de crear incidencia
  * TECNICO no ve opción de crear incidencia

---

## Estructura principal del proyecto

```text
src/app
│
├── core
│   ├── guards
│   │   └── auth.guard.ts
│   │
│   ├── interceptors
│   │   └── jwt.interceptor.ts
│   │
│   └── services
│       ├── auth.service.ts
│       └── incidencia.service.ts
│
├── features
│   ├── auth
│   │   └── login
│   │
│   └── incidencias
│       ├── listado-incidencias
│       └── crear-incidencia
│
├── shared
│   └── navbar
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

| Ruta                 | Descripción                      | Protección              |
| -------------------- | -------------------------------- | ----------------------- |
| `/login`             | Pantalla de inicio de sesión     | Pública                 |
| `/incidencias`       | Listado de incidencias           | Protegida con AuthGuard |
| `/incidencias/nueva` | Formulario para crear incidencia | Protegida con AuthGuard |

---

## Flujo de autenticación

1. El usuario introduce email y contraseña en `/login`.
2. Angular envía los datos al backend mediante `POST /api/auth/login`.
3. El backend responde con un token JWT y los datos básicos del usuario.
4. El frontend guarda el token y los datos del usuario en `localStorage`.
5. El interceptor añade automáticamente el token en las peticiones protegidas.
6. El usuario accede al listado y creación de incidencias.
7. Si el usuario cierra sesión, se eliminan los datos del `localStorage` y se redirige a `/login`.

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
* Obtener usuarioId.
* Obtener nombre.
* Obtener email.
* Obtener rol.
* Validar si el usuario está autenticado.
* Validar rol de usuario:

  * `esAdmin()`
  * `esTecnico()`
  * `esUser()`
* Cerrar sesión.

### IncidenciaService

Responsable de:

* Listar incidencias.
* Crear nuevas incidencias.

---

## Interceptor JWT

El proyecto incluye un interceptor HTTP que revisa si existe un token en `localStorage`.

Si existe, lo agrega automáticamente a cada petición HTTP:

```http
Authorization: Bearer TOKEN
```

Esto evita repetir manualmente los headers en cada servicio.

---

## AuthGuard

El proyecto incluye un guard para proteger rutas privadas.

Rutas protegidas actualmente:

```text
/incidencias
/incidencias/nueva
```

Si el usuario no tiene sesión activa, Angular lo redirige automáticamente a:

```text
/login
```

---

## Control por roles

El frontend utiliza el rol recibido desde el backend para mostrar u ocultar opciones de la interfaz.

Roles actuales:

* ADMIN
* USER
* TECNICO

Regla aplicada actualmente:

| Rol     | Puede ver opción "Nueva incidencia" |
| ------- | ----------------------------------- |
| ADMIN   | Sí                                  |
| USER    | Sí                                  |
| TECNICO | No                                  |

Esta lógica está aplicada tanto en la navbar como en el listado de incidencias.

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

## Usuarios de prueba

Ejemplo de usuarios utilizados durante las pruebas:

```text
admin@test.com
tecnico@test.com
```

Las contraseñas dependen de los usuarios creados en la base de datos del backend.

---

## Pruebas realizadas

Se realizaron pruebas manuales para validar:

* Login con usuario existente.
* Validación de formulario de login.
* Recepción de token JWT.
* Almacenamiento de token en `localStorage`.
* Almacenamiento de datos del usuario en `localStorage`.
* Envío automático del token mediante interceptor.
* Carga de incidencias desde backend.
* Creación de incidencias desde Angular.
* Navegación entre login, listado y formulario de creación.
* Navbar visible solo con sesión activa.
* Logout funcional.
* Limpieza de datos de sesión al cerrar sesión.
* Redirección al login después de logout.
* Protección de rutas con AuthGuard.
* Control visual por rol en navbar.
* Control visual por rol en listado de incidencias.
* Validación de que el usuario TECNICO no vea la opción de crear incidencia.

---

## Estado actual del proyecto

Proyecto frontend funcional con:

* Login.
* Token JWT.
* Interceptor.
* Navbar.
* Logout.
* AuthGuard.
* Listado de incidencias.
* Creación de incidencias.
* Control visual por roles.
* Consumo real de API Spring Boot.
* Navegación básica protegida.

---

## Trabajo realizado en la última sesión

En la última sesión se realizaron las siguientes mejoras:

* Se verificó que el backend estuviera levantado correctamente.
* Se corrigió un problema provocado por un token JWT expirado almacenado en `localStorage`.
* Se limpió la sesión anterior del navegador.
* Se validó nuevamente el login con usuarios existentes.
* Se creó una navbar superior.
* Se mostró en la navbar el nombre y rol del usuario autenticado.
* Se implementó botón de logout.
* Se modificó `AuthService` para centralizar datos de sesión.
* Se añadieron métodos para obtener:

  * usuarioId
  * nombre
  * email
  * rol
* Se mejoró el método `logout()` para eliminar solo los datos propios de la sesión.
* Se creó y aplicó un AuthGuard.
* Se protegieron las rutas `/incidencias` y `/incidencias/nueva`.
* Se añadió lógica de roles en el frontend.
* Se ocultó la opción de crear incidencia para usuarios con rol TECNICO.
* Se validó que ADMIN y USER puedan ver la opción de crear incidencia.
* Se validó que el usuario TECNICO no vea la opción de nueva incidencia en navbar ni en listado.

---

## Próximas tareas pendientes

### 1. Mejorar control por roles

Definir con más claridad qué acciones puede realizar cada rol:

| Rol     | Acciones posibles                                                                     |
| ------- | ------------------------------------------------------------------------------------- |
| ADMIN   | Ver todas las incidencias, crear, editar prioridad, cambiar estado, cerrar incidencia |
| TECNICO | Ver incidencias asignadas, cambiar estado, resolver incidencia                        |
| USER    | Crear incidencias, ver sus incidencias, consultar estado                              |

---

### 2. Crear pantalla de detalle de incidencia

Crear una nueva ruta:

```text
/incidencias/:id
```

Objetivo:

* Ver título.
* Ver descripción completa.
* Ver estado.
* Ver prioridad.
* Ver usuario creador.
* Ver fecha de creación.
* Ver fecha de actualización.
* Ver fecha de cierre si existe.

---

### 3. Añadir acciones en listado según rol

Agregar botones en cada incidencia según el rol:

| Rol     | Botones sugeridos                              |
| ------- | ---------------------------------------------- |
| ADMIN   | Ver detalle, cambiar prioridad, cambiar estado |
| TECNICO | Ver detalle, cambiar estado                    |
| USER    | Ver detalle                                    |

---

### 4. Permitir cambiar estado de incidencia

Crear funcionalidad para cambiar el estado:

```text
ABIERTA → EN_PROCESO → RESUELTA → CERRADA
```

Posible endpoint backend:

```http
PUT /api/incidencias/{id}/estado
```

---

### 5. Permitir cambiar prioridad

Crear funcionalidad para cambiar prioridad:

```text
BAJA
MEDIA
ALTA
CRITICA
```

Esta acción debería ser visible principalmente para ADMIN.

---

### 6. Mejorar diseño visual

Pendiente mejorar:

* Estilos generales.
* Tabla de incidencias.
* Formularios.
* Botones.
* Espaciados.
* Colores por estado.
* Colores por prioridad.
* Mensajes de error.
* Mensajes de éxito.
* Indicadores de carga.

Sugerencia visual:

| Prioridad | Estilo sugerido |
| --------- | --------------- |
| BAJA      | Verde           |
| MEDIA     | Amarillo        |
| ALTA      | Naranja         |
| CRITICA   | Rojo            |

---

### 7. Manejo de errores del frontend

Agregar control para:

* Token expirado.
* Error 401.
* Error 403.
* Error 500.
* Backend apagado.
* Credenciales incorrectas.
* Formularios inválidos.

Objetivo:

* Mostrar mensajes claros al usuario.
* Redirigir a login si la sesión expiró.
* Limpiar localStorage si el token ya no es válido.

---

### 8. Mejorar formulario de creación

Pendiente:

* Validar longitud mínima de título.
* Validar longitud mínima de descripción.
* Mostrar errores debajo de cada campo.
* Bloquear botón si el formulario es inválido.
* Mostrar mensaje de éxito al crear.
* Redirigir al listado después de crear.

---

### 9. Preparar README final con capturas

Añadir capturas de:

* Login.
* Listado de incidencias.
* Navbar con usuario ADMIN.
* Navbar con usuario TECNICO.
* Formulario de nueva incidencia.
* Prueba de ruta protegida.
* LocalStorage con token.
* Swagger del backend.

---

### 10. Subir cambios a GitHub

Comandos sugeridos:

```bash
git status
git add .
git commit -m "feat: add navbar logout auth guard and role based UI"
git push
```

---

## Autor

Gabriel Leonardo Isturiz Guía
Desarrollador Web Junior Full Stack
