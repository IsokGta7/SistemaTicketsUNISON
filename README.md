# Sistema de Soporte Técnico - Universidad de Sonora

Sistema centralizado de soporte técnico para la Facultad de Ciencias de la Computación de la Universidad de Sonora (UNISON).

## Características

- Gestión de tickets de soporte técnico
- Asignación automática de tickets
- Seguimiento en tiempo real
- Reportes y analíticas
- Control de acceso basado en roles (estudiantes, profesores, técnicos, administradores)

## Requisitos

- Docker y Docker Compose
- Node.js 18+ (solo para desarrollo)
- PostgreSQL (gestionado por Docker)

## Configuración

1. Clona este repositorio:
   \`\`\`bash
   git clone https://github.com/tu-usuario/unison-it-support.git
   cd unison-it-support
   \`\`\`

2. Crea un archivo `.env` basado en `.env.example`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Modifica las variables de entorno en el archivo `.env` según tus necesidades:
   \`\`\`
   # Configura una contraseña segura para la base de datos
   POSTGRES_PASSWORD=tu_contraseña_segura
   
   # Configura un secreto JWT seguro
   JWT_SECRET=tu_secreto_jwt_seguro
   \`\`\`

## Ejecución con Docker

Para iniciar la aplicación completa (base de datos y aplicación web):

\`\`\`bash
docker-compose up -d
\`\`\`

La aplicación estará disponible en: http://localhost:3000

## Desarrollo

Para desarrollo local:

1. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`

2. Genera el cliente Prisma:
   \`\`\`bash
   npx prisma generate
   \`\`\`

3. Ejecuta las migraciones de la base de datos:
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

4. Inicia el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`

## Estructura del Proyecto

\`\`\`
unison-it-support/
├── app/                    # Rutas y componentes de Next.js
│   ├── api/                # API routes
│   ├── dashboard/          # Páginas del dashboard
│   ├── tickets/            # Páginas de tickets
│   └── ...
├── components/             # Componentes React reutilizables
├── lib/                    # Utilidades y configuraciones
├── prisma/                 # Esquema y migraciones de Prisma
├── public/                 # Archivos estáticos
├── docker-compose.yml      # Configuración de Docker Compose
├── Dockerfile              # Configuración de Docker
└── ...
\`\`\`

## Endpoints de API

### Autenticación

- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión

### Tickets

- `GET /api/tickets` - Obtener tickets
- `POST /api/tickets` - Crear ticket
- `GET /api/tickets/:id` - Obtener detalles de un ticket
- `PUT /api/tickets/:id` - Actualizar ticket
- `POST /api/tickets/:id/comments` - Añadir comentario

### Salud del Sistema

- `GET /api/health` - Verificar estado del sistema

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
