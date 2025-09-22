# 📚 Sistema de Gestión de Biblioteca

Una aplicación moderna de gestión de biblioteca construida con React y Laravel, que permite administrar libros, préstamos y autores de manera eficiente.

![Sistema de Biblioteca](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-Latest-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue) ![Laravel](https://img.shields.io/badge/Laravel-Backend-red)

## 🌟 Características Principales

### 📊 Dashboard Interactivo
- **Estadísticas en tiempo real**: Visualiza métricas importantes de la biblioteca
- **Navegación intuitiva**: Sidebar responsivo para acceso rápido a todas las funciones
- **Diseño moderno**: Interfaz limpia con tema púrpura y animaciones suaves

### 📖 Gestión de Libros
- **Catálogo completo**: Listado de todos los libros con información detallada
- **Búsqueda avanzada**: Filtro por título, autor o ISBN
- **Operaciones CRUD**: Crear, leer, actualizar y eliminar libros
- **Paginación**: Navegación eficiente por grandes colecciones

### 🔄 Sistema de Préstamos
- **Gestión integral**: Control completo de préstamos activos y finalizados
- **Estados visuales**: Indicadores de color para diferentes estados de préstamo
- **Devoluciones**: Proceso simplificado para marcar libros como devueltos
- **Historial**: Seguimiento completo de todos los préstamos

### 👥 Gestión de Autores
- **Base de datos**: Listado completo de autores registrados
- **Información detallada**: Datos biográficos y obras asociadas

## 🚀 Instalación y Configuración

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **pnpm** (gestor de paquetes recomendado)
- **Git** para clonar el repositorio
- **Laravel Backend** funcionando en el puerto 8000

### Paso 1: Clonar el Repositorio

```bash
git clone [URL-DEL-REPOSITORIO]
cd frontend
```

### Paso 2: Instalación de Dependencias

```bash
# Instalar dependencias usando pnpm
pnpm install

# O si prefieres npm
npm install
```

### Paso 3: Configuración del Entorno

1. **Verificar la URL del backend**: El frontend está configurado para conectarse a `http://localhost:8000`
2. **Asegurar CORS**: El backend debe permitir solicitudes desde `http://localhost:5174`

### Paso 4: Configuración del Token de Autenticación

⚠️ **IMPORTANTE**: Para que la aplicación funcione correctamente, necesitas configurar un token de autenticación manualmente.

#### Generar Token desde el Backend

Si el token expira, genera uno nuevo desde el backend con:

```bash
# En el directorio del backend Laravel, ejecuta:
php artisan tinker

# Dentro de tinker, ejecuta estos comandos:
use App\Models\Usuario;
$user = Usuario::find(1);
$token = $user->createToken('api-token');
echo $token->plainTextToken;
```

#### Configurar Token en el Frontend

1. **Abrir archivo**: Ve a `src/api/apiClient.js`
2. **Localizar variable**: Busca la línea `const API_TOKEN = '...'`
3. **Reemplazar token**: Copia el token generado y reemplaza la variable `API_TOKEN`
4. **Guardar cambios**: Con esto debería funcionar sin ningún problema

### Paso 5: Ejecutar la Aplicación

```bash
# Modo desarrollo
pnpm run dev

# O con npm
npm run dev
```

La aplicación estará disponible en: `http://localhost:5174`

> **📝 Nota**: Si la aplicación muestra errores de autenticación, asegúrate de haber configurado correctamente el token según las instrucciones del Paso 4.

## 🏗️ Arquitectura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── App.jsx            # Componente principal
│   ├── main.jsx          # Punto de entrada
│   ├── styles.css        # Estilos globales
│   └── api/
│       └── apiClient.js  # Cliente API centralizado
├── index.html            # Plantilla HTML
├── package.json          # Dependencias y scripts
├── tailwind.config.js    # Configuración de Tailwind
├── vite.config.js        # Configuración de Vite
└── README.md            # Este archivo
```

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18**: Biblioteca principal para la interfaz de usuario
- **Vite**: Herramienta de construcción rápida y moderna
- **Tailwind CSS**: Framework CSS para estilos utilitarios
- **JavaScript ES6+**: Sintaxis moderna de JavaScript

### Herramientas de Desarrollo
- **PostCSS**: Procesamiento de CSS
- **ESLint**: Linting de código
- **pnpm**: Gestor de paquetes eficiente

## 📱 Guía de Uso

### 🔐 Autenticación

⚠️ **CONFIGURACIÓN REQUERIDA**: Antes de usar la aplicación, debes configurar el token de autenticación manualmente.

#### Configuración Inicial del Token
1. **Obtener credenciales**: Solicita al administrador las credenciales de acceso
2. **Configurar token**: Sigue las instrucciones del "Paso 4" en la sección de instalación
3. **Verificar funcionamiento**: Una vez configurado, la aplicación debe cargar sin errores de autenticación

#### Proceso de Autenticación
1. **Token configurado**: El sistema utiliza el token configurado manualmente
2. **Acceso automático**: Una vez configurado, no necesitas hacer login cada vez
3. **Renovación**: Si el token expira, necesitarás obtener uno nuevo del backend

> **💡 Tip**: Si ves errores de "401 Unauthorized", significa que necesitas actualizar tu token de autenticación.

### 📊 Panel de Control (Dashboard)

Al iniciar sesión, verás el dashboard principal con:

- **Estadísticas de libros**: Total de libros en la biblioteca
- **Préstamos activos**: Número de préstamos actuales
- **Navegación lateral**: Acceso rápido a todas las secciones

### 📚 Gestión de Libros

#### Visualizar Libros
1. Haz clic en "Libros" en el sidebar
2. Usa el campo de búsqueda para filtrar por título, autor o ISBN
3. Navega entre páginas usando los controles de paginación

#### Agregar un Libro
1. Haz clic en "Agregar Libro"
2. Completa los campos requeridos:
   - Título
   - Autor (selecciona de la lista)
   - ISBN
   - Fecha de publicación
   - Editorial
   - Número de páginas
3. Haz clic en "Guardar"

#### Editar un Libro
1. Localiza el libro en la lista
2. Haz clic en "Editar"
3. Modifica los campos necesarios
4. Guarda los cambios

#### Eliminar un Libro
1. Encuentra el libro a eliminar
2. Haz clic en "Eliminar"
3. Confirma la acción

### 🔄 Gestión de Préstamos

#### Crear un Préstamo
1. Ve a la sección "Préstamos"
2. Haz clic en "Nuevo Préstamo"
3. Selecciona:
   - Usuario (por cédula o nombre)
   - Libro disponible
   - Fecha de préstamo
   - Fecha de devolución esperada
4. Confirma el préstamo

#### Devolver un Libro
1. Localiza el préstamo activo
2. Haz clic en "Devolver"
3. El sistema registrará automáticamente la fecha de devolución

#### Estados de Préstamos
- **🟢 Activo**: Préstamo en curso
- **🔵 Devuelto**: Libro ya devuelto
- **🔴 Vencido**: Préstamo con fecha de devolución pasada

### 👥 Gestión de Autores

#### Ver Autores
1. Accede a "Autores" desde el sidebar
2. Revisa la lista completa de autores registrados

#### Agregar Autor
1. Haz clic en "Nuevo Autor"
2. Completa la información:
   - Nombre completo
   - Fecha de nacimiento
   - Nacionalidad
   - Biografía
3. Guarda la información

## 🛠️ API y Endpoints

El frontend se comunica con el backend Laravel a través de los siguientes endpoints:

### Autenticación
- `POST /api/login` - Iniciar sesión
- `POST /api/logout` - Cerrar sesión

### Libros
- `GET /api/libros` - Listar libros (con paginación y filtros)
- `POST /api/libros` - Crear libro
- `GET /api/libros/{id}` - Obtener libro específico
- `PUT /api/libros/{id}` - Actualizar libro
- `DELETE /api/libros/{id}` - Eliminar libro

### Préstamos
- `GET /api/prestamos` - Listar préstamos
- `POST /api/prestamos` - Crear préstamo
- `PUT /api/prestamos/{id}/devolver` - Devolver libro

### Autores
- `GET /api/autores` - Listar autores
- `POST /api/autores` - Crear autor

### Estadísticas
- `GET /api/stats` - Obtener estadísticas del dashboard

## 🎨 Personalización

### Colores y Tema
El sistema utiliza un esquema de colores púrpura que puede modificarse en `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          // ... más tonos
        }
      }
    }
  }
}
```

### Componentes Responsivos
- **Desktop**: Sidebar fijo, navegación completa
- **Mobile**: Sidebar colapsible con overlay
- **Tablet**: Diseño adaptativo automático

## 🐛 Solución de Problemas

### Problemas Comunes

#### 1. Error de Conexión con el Backend
```
Error: Cannot connect to backend
```
**Solución**: 
- Verifica que el backend Laravel esté ejecutándose en `http://localhost:8000`
- Revisa la configuración de CORS en el backend

#### 2. Problemas de Autenticación
```
Error 401: Unauthorized
```
**Solución**:
- **Verificar token**: Asegúrate de haber configurado el token manualmente según las instrucciones
- **Token expirado**: Genera un nuevo token siguiendo los pasos del "Paso 4" y actualízalo en `apiClient.js`
- **Formato correcto**: Verifica que el token tenga el formato correcto (Bearer token)
- **Backend funcionando**: Confirma que el backend Laravel con Sanctum esté ejecutándose

**Pasos para generar nuevo token**:
```bash
# En el backend Laravel:
php artisan tinker
use App\Models\Usuario;
$user = Usuario::find(1);
$token = $user->createToken('api-token');
echo $token->plainTextToken;
```

Luego copia ese token y reemplaza la variable `API_TOKEN` en `src/api/apiClient.js`

#### 3. Error de Validación al Devolver Libros
```
Error: fecha_devolucion_real field is required
```
**Solución**: Este error ha sido corregido en la versión actual del frontend

### Logs y Debugging

Para activar logs detallados:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Los errores de API se mostrarán con detalles completos

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm run dev          # Ejecutar en modo desarrollo
pnpm run lint         # Ejecutar linting

# Mantenimiento
pnpm install          # Instalar dependencias
pnpm update           # Actualizar dependencias
```

## 🤝 Contribución

Para contribuir al proyecto:

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un **Pull Request**

## 📝 Notas de Versión

### Versión Actual
- ✅ Sidebar responsivo implementado
- ✅ Integración completa con API Laravel
- ✅ Sistema de préstamos funcional
- ✅ Gestión de libros y autores
- ✅ Dashboard con estadísticas
- ✅ Manejo de errores mejorado

### Próximas Mejoras
- 🔄 Notificaciones en tiempo real
- 📧 Sistema de recordatorios por email
- 📊 Reportes avanzados
- 🔍 Búsqueda avanzada con filtros múltiples

## 📞 Soporte

Si encuentras algún problema o necesitas ayuda:

1. **Revisa** esta documentación
2. **Consulta** los logs en la consola del navegador
3. **Verifica** que el backend esté funcionando correctamente
4. **Contacta** al equipo de desarrollo con detalles específicos del error

---

**¡Disfruta usando el Sistema de Gestión de Biblioteca!** 📚✨