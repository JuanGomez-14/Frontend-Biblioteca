import React, { useEffect, useState } from 'react';
import './styles.css';
import { getLibros, getStats, createPrestamo, getPrestamos, devolverPrestamo } from './api/apiClient';

const App = () => {
  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [stats, setStats] = useState({ totalLibros: 0, totalPrestamos: 0, totalUsuarios: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [filters, setFilters] = useState({});
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [prestamosPaginationLinks, setPrestamosPaginationLinks] = useState([]);
  const [formData, setFormData] = useState({ usuarioId: '', libroId: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const showMessage = (msg, type = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchData = async (page = 1, currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching data from backend...');
      
      // Cargamos libros con filtros y paginación
      const librosData = await getLibros(page, currentFilters);
      console.log('Libros data:', librosData);
      
      // Cargamos préstamos (primera página)
      const prestamosData = await getPrestamos(1);
      console.log('Prestamos data:', prestamosData);
      
      // Cargamos estadísticas
      const statsData = await getStats();
      console.log('Stats data:', statsData);
      
      setLibros(librosData.data || []);
      setPrestamos(prestamosData.data || []);
      setPaginationLinks(librosData.links || []);
      setPrestamosPaginationLinks(prestamosData.links || []);
      setStats(statsData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPrestamo({ usuario_id: formData.usuarioId, libro_id: formData.libroId });
      showMessage('Préstamo creado con éxito.');
      setFormData({ usuarioId: '', libroId: '' });
      fetchData(); // Recargar datos
    } catch (err) {
      showMessage(err.message, 'error');
      console.error('Error creating loan:', err);
    }
  };

  const handleDevolverPrestamo = async (prestamoId) => {
    try {
      await devolverPrestamo(prestamoId);
      showMessage('Libro devuelto con éxito.');
      fetchData(); // Recargar datos
    } catch (err) {
      showMessage(err.message, 'error');
      console.error('Error returning book:', err);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const switchSection = (section) => {
    setActiveSection(section);
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header/Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <a href="#" className="flex ml-2 md:mr-24">
                <svg className="w-8 h-8 mr-3 text-purple-700 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.75 4a.75.75 0 0 0-.75.75V11a.75.75 0 0 0 1.5 0V4.75a.75.75 0 0 0-.75-.75Z"/>
                  <path fillRule="evenodd" d="M3.75 12h2.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 .75-.75Zm6.25-2h2.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-5.5a.75.75 0 0 1 .75-.75Zm6.25-2h2.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd"/>
                  <path fillRule="evenodd" d="M2 5.5A2.5 2.5 0 0 1 4.5 3h11A2.5 2.5 0 0 1 18 5.5V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5.5ZM4.5 4A1.5 1.5 0 0 0 3 5.5V18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5.5A1.5 1.5 0 0 0 15.5 4h-11Z" clipRule="evenodd"/>
                </svg>
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Biblioteca-App
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <button 
                onClick={() => switchSection('dashboard')}
                className={`flex items-center w-full p-2 text-left rounded-lg group transition-colors ${
                  activeSection === 'dashboard' 
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-200' 
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1.002-1.066ZM10 11V4.025a1 1 0 0 1 1.066-.998 8.5 8.5 0 1 1-9.039 9.039.999.999 0 0 1 1.002-1.066Z"/>
                </svg>
                <span className="ms-3">Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => switchSection('catalogo')}
                className={`flex items-center w-full p-2 text-left rounded-lg group transition-colors ${
                  activeSection === 'catalogo' 
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-200' 
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 14H2a2 2 0 0 0-2 2A2 2 0 0 0 2 18h4.143A.984.984 0 0 0 7 17v-3a.984.984 0 0 0-.857-1ZM14 0H4a2 2 0 0 0-2 2h16a2 2 0 0 0-2-2Z"/>
                  <path d="M.953 5.414A.954.954 0 0 0 .5 6.207v1.893a.954.954 0 0 0 .453.793L4.414 11H14.5a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5H5.857a.984.984 0 0 0-.857.5L.953 5.414ZM10 9H8v2h2V9Zm1 0h2v2h-2V9Zm1 3h2v2h-2v-2ZM8 12h2v2H8v-2ZM5.857 15H14.5a.5.5 0 0 0 .5-.5v-1.893a.954.954 0 0 0-.453-.793L10.586 9H.5a.5.5 0 0 0-.5.5v2.357a.954.954 0 0 0 .453.793L5.414 15h.443Z"/>
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Catálogo</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => switchSection('prestamos')}
                className={`flex items-center w-full p-2 text-left rounded-lg group transition-colors ${
                  activeSection === 'prestamos' 
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-200' 
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 20a.9.9 0 0 1-.9-.9V2.1a.9.9 0 0 1 .9-.9h1a.9.9 0 0 1 .9.9v3.2a.9.9 0 0 1-.9.9H5a.9.9 0 0 1-.9-.9V2.1a.9.9 0 0 1 .9-.9h1a.9.9 0 0 1 .9.9v3.2a.9.9 0 0 1-.9.9H5Zm4 0a.9.9 0 0 1-.9-.9V.9a.9.9 0 0 1 .9-.9h1a.9.9 0 0 1 .9.9v18.2a.9.9 0 0 1-.9.9H9Zm4 0a.9.9 0 0 1-.9-.9V6.1a.9.9 0 0 1 .9-.9h1a.9.9 0 0 1 .9.9v12.2a.9.9 0 0 1-.9.9h-1Zm4 0a.9.9 0 0 1-.9-.9V10.9a.9.9 0 0 1 .9-.9h1a.9.9 0 0 1 .9.9v8.2a.9.9 0 0 1-.9.9h-1Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Préstamos</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="p-4 sm:ml-64 pt-20">
        <div className="p-4">
           {message && (
             <div className={`p-4 mb-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-800 dark:text-green-200' : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-800 dark:text-red-200'}`}>
               {message.text}
             </div>
           )}
           {loading && (
             <div className="flex justify-center items-center py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
               <span className="ml-2 text-gray-500 dark:text-gray-400">Cargando datos...</span>
             </div>
           )}
           {error && (
             <div className="p-4 mb-4 text-sm rounded-lg bg-red-50 text-red-800 border border-red-200 dark:bg-red-800 dark:text-red-200">
               {error}
             </div>
           )}

           {/* Cards de Estadísticas */}
           {activeSection === 'dashboard' && (
             <section id="dashboard" className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                     <div className="flex items-center">
                       <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                         <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                         </svg>
                       </div>
                       <div>
                         <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{stats.totalLibros}</p>
                         <p className="text-sm text-gray-600 dark:text-gray-400">Libros en Catálogo</p>
                       </div>
                     </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                     <div className="flex items-center">
                       <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                         <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                       </div>
                       <div>
                         <p className="text-3xl font-bold text-green-600 dark:text-green-300">{stats.totalPrestamos}</p>
                         <p className="text-sm text-gray-600 dark:text-gray-400">Préstamos Registrados</p>
                       </div>
                     </div>
                  </div>
               </div>
             </section>
           )}

           {/* Sección de Catálogo */}
           {activeSection === 'catalogo' && (
             <section id="catalogo" className="mb-8">
               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                     <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                     </svg>
                     Catálogo de Libros
                   </h2>
                 </div>
                 <div className="p-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                     <div>
                       <label htmlFor="searchTitulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar por Título</label>
                       <input 
                         type="text" 
                         id="searchTitulo" 
                         name="titulo" 
                         placeholder="Ingrese título del libro..." 
                         onChange={handleFilterChange} 
                         value={filters.titulo || ''} 
                         className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                       />
                     </div>
                     <div>
                       <label htmlFor="searchAutor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar por Autor</label>
                       <input 
                         type="text" 
                         id="searchAutor" 
                         name="autor" 
                         placeholder="Ingrese nombre del autor..." 
                         onChange={handleFilterChange} 
                         value={filters.autor || ''} 
                         className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                       />
                     </div>
                     <div>
                       <label htmlFor="searchAnio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar por Año</label>
                       <input 
                         type="number" 
                         id="searchAnio" 
                         name="año" 
                         placeholder="Ej: 2023" 
                         onChange={handleFilterChange} 
                         value={filters.año || ''} 
                         className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                       />
                     </div>
                   </div>
                   
                   <div className="relative overflow-x-auto shadow-md rounded-lg">
                     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                           <tr>
                              <th scope="col" className="px-6 py-4 font-medium">Título</th>
                              <th scope="col" className="px-6 py-4 font-medium">Autor(es)</th>
                              <th scope="col" className="px-6 py-4 font-medium">Año</th>
                              <th scope="col" className="px-6 py-4 font-medium text-center">Stock</th>
                           </tr>
                        </thead>
                        <tbody>
                           {libros.length === 0 ? (
                             <tr>
                               <td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400">
                                 <div className="flex flex-col items-center">
                                   <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                   </svg>
                                   <p>No se encontraron libros.</p>
                                 </div>
                               </td>
                             </tr>
                           ) : (
                             libros.map((libro, index) => (
                               <tr key={libro.id} className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                 <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{libro.titulo}</td>
                                 <td className="px-6 py-4">{libro.autores.map(a => `${a.nombre} ${a.apellido}`).join(', ')}</td>
                                 <td className="px-6 py-4">{libro.año_publicacion}</td>
                                 <td className="px-6 py-4 text-center">
                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${libro.stock_disponible > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                     {libro.stock_disponible}
                                   </span>
                                 </td>
                               </tr>
                             ))
                           )}
                        </tbody>
                     </table>
                   </div>
                   
                   {paginationLinks.length > 0 && (
                     <div className="mt-6 flex justify-center">
                       <nav className="flex space-x-1">
                         {paginationLinks.map((link, index) => (
                           <button
                             key={index}
                             onClick={() => fetchData(link.url ? new URL(link.url).searchParams.get('page') : null)}
                             disabled={!link.url}
                             className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                               link.active 
                                 ? 'bg-purple-600 text-white border border-purple-600' 
                                 : link.url 
                                   ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700' 
                                   : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                             }`}
                           >
                             <span dangerouslySetInnerHTML={{
                               __html: link.label.replace('&laquo; Anterior', '← Anterior').replace('Siguiente &raquo;', 'Siguiente →')
                             }} />
                           </button>
                         ))}
                       </nav>
                     </div>
                   )}
                 </div>
               </div>
             </section>
           )}

           {/* Sección para Préstamos */}
           {activeSection === 'prestamos' && (
             <section id="prestamos" className="mb-8">
               {/* Lista de Préstamos */}
               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                     <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     Lista de Préstamos
                   </h2>
                 </div>
                 <div className="p-6">
                   <div className="relative overflow-x-auto shadow-md rounded-lg">
                     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                           <tr>
                              <th scope="col" className="px-6 py-4 font-medium">Usuario</th>
                              <th scope="col" className="px-6 py-4 font-medium">Libro</th>
                              <th scope="col" className="px-6 py-4 font-medium">Fecha Préstamo</th>
                              <th scope="col" className="px-6 py-4 font-medium">Fecha Estimada</th>
                              <th scope="col" className="px-6 py-4 font-medium text-center">Estado</th>
                              <th scope="col" className="px-6 py-4 font-medium text-center">Acciones</th>
                           </tr>
                        </thead>
                        <tbody>
                           {prestamos.length === 0 ? (
                             <tr>
                               <td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">
                                 <div className="flex flex-col items-center">
                                   <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                   </svg>
                                   <p>No se encontraron préstamos.</p>
                                 </div>
                               </td>
                             </tr>
                           ) : (
                             prestamos.map((prestamo, index) => (
                               <tr key={prestamo.id} className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                 <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{prestamo.usuario?.nombre || 'N/A'}</td>
                                 <td className="px-6 py-4">{prestamo.libro?.titulo || 'N/A'}</td>
                                 <td className="px-6 py-4">{new Date(prestamo.fecha_prestamo).toLocaleDateString()}</td>
                                 <td className="px-6 py-4">{new Date(prestamo.fecha_devolucion_estimada).toLocaleDateString()}</td>
                                 <td className="px-6 py-4 text-center">
                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                     prestamo.estado === 'devuelto' 
                                       ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                       : prestamo.estado === 'atrasado'
                                         ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                         : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                   }`}>
                                     {prestamo.estado}
                                   </span>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                   {prestamo.estado !== 'devuelto' && (
                                     <button
                                       onClick={() => handleDevolverPrestamo(prestamo.id)}
                                       className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                       title="Marcar como devuelto"
                                     >
                                       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                       </svg>
                                       Devolver
                                     </button>
                                   )}
                                 </td>
                               </tr>
                             ))
                           )}
                        </tbody>
                     </table>
                   </div>
                   
                   {prestamosPaginationLinks.length > 0 && (
                     <div className="mt-6 flex justify-center">
                       <nav className="flex space-x-1">
                         {prestamosPaginationLinks.map((link, index) => (
                           <button
                             key={index}
                             onClick={() => {
                               if (link.url) {
                                 const page = new URL(link.url).searchParams.get('page');
                                 // Aquí necesitarías una función similar para préstamos
                                 fetchData(1, filters); // Por ahora mantiene la página actual
                               }
                             }}
                             disabled={!link.url}
                             className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                               link.active 
                                 ? 'bg-purple-600 text-white border border-purple-600' 
                                 : link.url 
                                   ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700' 
                                   : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                             }`}
                           >
                             <span dangerouslySetInnerHTML={{
                               __html: link.label.replace('&laquo; Previous', '← Anterior').replace('Next &raquo;', 'Siguiente →')
                             }} />
                           </button>
                         ))}
                       </nav>
                     </div>
                   )}
                 </div>
               </div>

               {/* Crear Nuevo Préstamo */}
               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                     <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                     </svg>
                     Crear Nuevo Préstamo
                   </h2>
                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Complete los siguientes campos para registrar un nuevo préstamo</p>
                 </div>
                 <div className="p-6">
                   <form onSubmit={handleFormSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label htmlFor="usuarioId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                           ID de Usuario
                         </label>
                         <div className="relative">
                           <input 
                             type="number" 
                             id="usuarioId" 
                             name="usuarioId" 
                             value={formData.usuarioId} 
                             onChange={handleFormChange} 
                             required 
                             placeholder="Ingrese el ID del usuario"
                             className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                           />
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                             </svg>
                           </div>
                         </div>
                       </div>
                       <div>
                         <label htmlFor="libroId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                           ID de Libro
                         </label>
                         <div className="relative">
                           <input 
                             type="number" 
                             id="libroId" 
                             name="libroId" 
                             value={formData.libroId} 
                             onChange={handleFormChange} 
                             required 
                             placeholder="Ingrese el ID del libro"
                             className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                           />
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                             </svg>
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="flex justify-end">
                       <button 
                         type="submit" 
                         className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                       >
                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                         </svg>
                         Crear Préstamo
                       </button>
                     </div>
                   </form>
                 </div>
               </div>
             </section>
           )}
        </div>
      </div>
    </div>
  );
};

export default App;