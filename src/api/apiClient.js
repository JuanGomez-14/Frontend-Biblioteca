// Url del backend (8000 por defecto)
const API_BASE_URL = 'http://localhost:8000/api';

// Reemplaza con un token de acceso real
const API_TOKEN = '1|DUjnvX0kA5FPphX45WjUVXPHsEoSKGUbMPqbGhliab9836f6' 
// instrucciones para quien revise, si el token expira, generar uno nuevo desde el backend con:
// php artisan tinker
// Importa el modelo
// use App\Models\Usuario;
// $user = Usuario::find(1);
// $token = $user->createToken('api-token');
// echo $token->plainTextToken;
// Luego copia ese token y reemplaza la variable API_TOKEN, con eso deberia funcionar sin ningun problema

const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`,
};

async function fetcher(url, options = {}) {
    try {
        const response = await fetch(url, { 
            ...options, 
            headers: {
                ...headers,
                ...(options.headers || {})
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            let errorMessage = 'Error en la petición.';
            
            // Manejo específico de errores según el backend
            if (response.status === 401) {
                errorMessage = 'Token de autenticación inválido o expirado.';
            } else if (response.status === 422) {
                // Errores de validación
                if (data.errors) {
                    errorMessage = Object.values(data.errors).flat().join(' ');
                } else if (data.message) {
                    errorMessage = data.message;
                }
            } else if (response.status === 404) {
                errorMessage = data.message || 'Recurso no encontrado.';
            } else if (response.status === 500) {
                errorMessage = data.error || data.message || 'Error interno del servidor.';
            } else if (data.message) {
                errorMessage = data.message;
            }
            
            throw new Error(errorMessage);
        }
        
        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Error de conexión. Verifique que el backend esté ejecutándose en http://localhost:8000');
        }
        throw error;
    }
}

// 📖 Endpoints de Libros
export const getLibros = (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters });
    return fetcher(`${API_BASE_URL}/libros?${params.toString()}`);
};

export const getLibro = (id) => {
    return fetcher(`${API_BASE_URL}/libros/${id}`);
};

export const createLibro = (libroData) => {
    return fetcher(`${API_BASE_URL}/libros`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(libroData),
    });
};

export const updateLibro = (id, libroData) => {
    return fetcher(`${API_BASE_URL}/libros/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(libroData),
    });
};

export const deleteLibro = (id) => {
    return fetcher(`${API_BASE_URL}/libros/${id}`, {
        method: 'DELETE',
    });
};

// 📋 Endpoints de Préstamos
export const getPrestamos = (page = 1) => {
    const params = new URLSearchParams({ page });
    return fetcher(`${API_BASE_URL}/prestamos?${params.toString()}`);
};

export const createPrestamo = (prestamoData) => {
    return fetcher(`${API_BASE_URL}/prestamos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(prestamoData),
    });
};

export const devolverPrestamo = (id) => {
    // Enviamos la fecha actual como fecha de devolución real
    const fechaDevolucionReal = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    return fetcher(`${API_BASE_URL}/prestamos/${id}/devolver`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fecha_devolucion_real: fechaDevolucionReal
        }),
    });
};

//  Autenticación
export const getCurrentUser = () => {
    return fetcher(`${API_BASE_URL}/user`);
};

// 📊 Estadísticas - Corregido para trabajar solo con endpoints disponibles
export const getStats = async () => {
    try {
        // Obtenemos la primera página para extraer los totales
        const [librosResponse, prestamosResponse] = await Promise.all([
            fetcher(`${API_BASE_URL}/libros?page=1`),
            fetcher(`${API_BASE_URL}/prestamos?page=1`)
        ]);

        return {
            totalLibros: librosResponse.total || 0,
            totalPrestamos: prestamosResponse.total || 0,
            totalUsuarios: 0 // No disponible en el backend
        };
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw new Error('No se pudieron cargar las estadísticas');
    }
};