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
