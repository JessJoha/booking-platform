# 🚀 Booking Platform Frontend

Frontend moderno en React para la Plataforma de Reservas de Espacios.

## ✨ Características

- **🎨 Interfaz Moderna**: Diseño limpio y responsivo con Tailwind CSS
- **🔐 Autenticación Completa**: Login, registro, recuperación de contraseña
- **📊 Dashboard Interactivo**: Métricas y visualizaciones en tiempo real
- **📅 Gestión de Reservas**: Crear, editar, cancelar reservas
- **🏢 Gestión de Espacios**: Administrar espacios y sus características
- **👥 Gestión de Usuarios**: Panel de administración de usuarios
- **📈 Reportes y Analytics**: Gráficos y estadísticas detalladas
- **🔔 Notificaciones**: Sistema de alertas con react-hot-toast
- **📱 Responsive**: Optimizado para desktop, tablet y móvil

## 🛠️ Tecnologías

- **React 18** - Framework frontend
- **React Router** - Navegación SPA
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Recharts** - Gráficos y visualizaciones
- **React Hot Toast** - Notificaciones
- **Date-fns** - Manejo de fechas

## 🚀 Instalación y Desarrollo

### Opción 1: Con Docker (Recomendado)

```bash
# Ejecutar toda la plataforma (backend + frontend)
.\run-platform.ps1

# O solo el frontend
docker-compose up frontend
```

### Opción 2: Desarrollo Local

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Registro**: http://localhost:3000/register

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos públicos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   └── Layout.js     # Layout principal con sidebar
│   ├── context/          # Contextos de React
│   │   └── AuthContext.js # Contexto de autenticación
│   ├── pages/            # Páginas principales
│   │   ├── Dashboard.js  # Dashboard con métricas
│   │   ├── Login.js      # Página de login
│   │   ├── Register.js   # Página de registro
│   │   ├── Reservations.js # Gestión de reservas
│   │   ├── Spaces.js     # Gestión de espacios
│   │   ├── Users.js      # Gestión de usuarios
│   │   └── Reports.js    # Reportes y analytics
│   ├── services/         # Servicios API
│   │   ├── api.js        # Configuración base de Axios
│   │   ├── authService.js # Servicios de autenticación
│   │   ├── userService.js # Servicios de usuarios
│   │   ├── spaceService.js # Servicios de espacios
│   │   ├── reservationService.js # Servicios de reservas
│   │   └── reportsService.js # Servicios de reportes
│   ├── App.js            # Componente principal
│   ├── index.js          # Punto de entrada
│   └── index.css         # Estilos globales
├── Dockerfile            # Configuración Docker
├── package.json          # Dependencias y scripts
└── tailwind.config.js    # Configuración Tailwind
```


### 🔐 Autenticación
- Login con email/contraseña
- Registro de nuevos usuarios
- Recuperación de contraseña
- Gestión de sesiones con tokens JWT
- Rutas protegidas

### 📅 Gestión de Reservas
- Vista de todas las reservas
- Filtros por estado y búsqueda
- Crear nuevas reservas
- Editar reservas existentes
- Cancelar reservas

### 🏢 Gestión de Espacios
- Catálogo de espacios disponibles
- Filtros por tipo y búsqueda
- Gestión de amenidades
- Estado de disponibilidad
- Imágenes y descripciones

### 👥 Gestión de Usuarios
- Lista de todos los usuarios
- Filtros por rol y estado
- Estadísticas de usuarios
- Gestión de perfiles

### 📈 Reportes y Analytics
- Dashboard con métricas clave
- Gráficos de ocupación
- Tendencias de uso
- Exportación de reportes
- Análisis por períodos

## 🎨 Diseño

### Paleta de Colores
- **Primary**: Azul (#3B82F6)
- **Success**: Verde (#10B981)
- **Warning**: Amarillo (#F59E0B)
- **Danger**: Rojo (#EF4444)
- **Gray**: Escala de grises

### Componentes de UI
- Botones con estados y variantes
- Cards con sombras suaves
- Formularios estilizados
- Navegación sidebar responsiva
- Modales y overlays

## 🔄 Estado Global

### AuthContext
Maneja todo el estado de autenticación:
- Usuario actual
- Estado de login
- Tokens de sesión
- Funciones de login/logout

## 📱 Responsividad

- **Desktop**: Layout completo con sidebar
- **Tablet**: Sidebar colapsable
- **Mobile**: Navegación hamburger
- **Breakpoints**: Tailwind CSS estándar

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm test -- --coverage
```

## 🚀 Deployment

### Docker
```bash
# Construir imagen
docker build -t booking-platform-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 booking-platform-frontend
```

### Build de Producción
```bash
# Generar build optimizado
npm run build

# Servir archivos estáticos
npx serve -s build
```



