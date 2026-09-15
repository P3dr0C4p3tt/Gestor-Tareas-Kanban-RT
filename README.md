# 📋 Gestor de Tareas Kanban RT 

Una aplicación web de gestión de tareas y tableros interactivos con control de acceso basado en roles (RBAC) en tiempo real.

---

## 🚀 Características Principales

* **Tableros Interactivos:** Creación de listas y tarjetas con drag-and-drop persistente.
* **Sistema RBAC (Roles):** Control de permisos multinivel (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`).
* **Gestión de Miembros:** Modal dinámico para enviar invitaciones por correo, actualizar roles y remover usuarios.
* **Autenticación Segura:** Integración con Auth.js y proveedores como GitHub OAuth.
* **Seguridad en Backend:** Server Actions con validación estricta de permisos en base de datos.

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología |
| :--- | :--- |
| **Framework** | Next.js (App Router) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS / Lucide Icons |
| **Base de Datos** | Prisma ORM & PostgreSQL |
| **Autenticación** | Auth.js (NextAuth) |

---

## ⚙️ Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/P3dr0C4p3tt/Gestor-Tareas-Kanban-RT.git

2. **Instalar dependencias**
   ```bash
   npm install

3. **Configurar variables de entorno**
   En base al archivo ejemplo.env.txt crea tu propio archivo .env con las variables de entorno de la base de datos

   DATABASE_URL: Tu cadena de conexión a tu base de datos PostgreSQL o MySQL de preferencia.

   AUTH_SECRET: Una clave secreta para la sesión (puedes generar una ejecutando npx auth secret).

   AUTH_GITHUB_ID y AUTH_GITHUB_SECRET: Obtén estas claves registrando una nueva OAuth App en los ajustes de desarrollador de GitHub.

4. **Sincronizar la base de datos**
   ```bash
   npx prisma db push

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev

6. Abre http://localhost:3000 en tu navegador.


#¿Como se usa el programa?

1. Al entrar al localhost, dale al botón de iniciar sesión con Github
<img width="450" height="186" alt="image" src="https://github.com/user-attachments/assets/a8665011-548d-4db6-9ff8-91c5b60b7e94" />

2. Inserta tus credenciales de GitHub y dale autorizacion al programa
<img width="569" height="585" alt="image" src="https://github.com/user-attachments/assets/3aaa788f-e07d-4262-9b6c-489d6af551b4" />

3. Una vez en la pestaña del Dashboard, para crear un nuevo tablero, dale al botón de "Crear nuevo tablero y dale un nombre.
<img width="1748" height="780" alt="image" src="https://github.com/user-attachments/assets/6a6c483d-ab6d-49c4-8993-4ed8509e686c" />

4. Una vez en la pantalla del tablero contaras con multiples opciones.
<img width="2402" height="926" alt="image" src="https://github.com/user-attachments/assets/b328fe42-6614-4ac3-9e5f-1924328c8b95" />

4.1.1 Hay tres columnas que representan las columnas estandar de un tablero de Kanban, para crear una tarjeta, hay que darle clic al boton de añadir tarjeta y darle un nombre.
<img width="1644" height="288" alt="image" src="https://github.com/user-attachments/assets/546a8ed8-dbb2-4706-8159-33e3bf998a71" />

4.1.2 Una vez con la tarjeta creada, puedes darle clic para editar sus atributos, (Cambiar el nombre, Descripcion, la prioridad, etiqueta de color, y fecha limite) o borrarla si hace falta*
<img width="920" height="652" alt="image" src="https://github.com/user-attachments/assets/39aa528f-b894-4c2c-9734-2b9a563f41a8" />

4.1.3 Las tarjetas pueden ser movidas libremente entre las columnas para representar el progreso de una actividad.

4.2 En caso de necesitar crear otra columna, hay que darle clic al boton de crear columna y asignarle su respectivo nombre.

4.3 Se puede buscar por nombre y por prioridad, usando la barra de busqueda de la parte superior
<img width="2410" height="170" alt="image" src="https://github.com/user-attachments/assets/41abf2bd-3932-4a77-b3c9-3654102cbfdf" />

4.4 Con el boton de miembros de la parte superior se pueden invitar otros miembros para trabajar en el tablero, estos pueden tener cuatro roles:
Propietario: Capaz de editar en su totalidad el tablero y añadir miembros.
Admin: Lo mismo que el propietario.
Miembro: Solo puede editar las tarjetas y cambiarlas de lugar.
Lector: Solo puede ver el tablero sin interactuar con el
<img width="804" height="518" alt="image" src="https://github.com/user-attachments/assets/b94c79cc-f5b6-4f3c-b302-72878c81ce92" />

