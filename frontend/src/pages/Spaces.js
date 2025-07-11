import React, { useState, useEffect } from 'react';
import { spaceService } from '../services/spaceService';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Users,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Wifi,
  Monitor,
  Coffee,
  Car
} from 'lucide-react';
import toast from 'react-hot-toast';

const Spaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      setIsLoading(true);
      const spacesData = await spaceService.getAllSpaces();
      setSpaces(spacesData || []);
    } catch (error) {
      toast.error('Error al cargar espacios');
      console.error('Error loading spaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity?.toLowerCase();
    switch (amenityLower) {
      case 'wifi':
      case 'internet':
        return <Wifi className="w-4 h-4" />;
      case 'projector':
      case 'proyector':
      case 'monitor':
        return <Monitor className="w-4 h-4" />;
      case 'coffee':
      case 'café':
      case 'kitchen':
      case 'cocina':
        return <Coffee className="w-4 h-4" />;
      case 'parking':
      case 'estacionamiento':
        return <Car className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'meeting':
      case 'reuniones':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'office':
      case 'oficina':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'event':
      case 'evento':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'coworking':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = space.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || space.type?.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDeleteSpace = async (spaceId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este espacio?')) {
      try {
        await spaceService.deleteSpace(spaceId);
        toast.success('Espacio eliminado exitosamente');
        loadSpaces();
      } catch (error) {
        toast.error('Error al eliminar el espacio');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Espacios</h1>
          <p className="text-gray-600">Gestiona todos los espacios disponibles para reserva</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Espacio
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar espacios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input w-auto"
            >
              <option value="all">Todos los tipos</option>
              <option value="meeting">Sala de reuniones</option>
              <option value="office">Oficina</option>
              <option value="event">Sala de eventos</option>
              <option value="coworking">Coworking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de espacios */}
      {filteredSpaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpaces.map((space, index) => (
            <div key={space.id || index} className="card overflow-hidden hover:shadow-medium transition-shadow">
              {/* Imagen del espacio */}
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                {space.image ? (
                  <img 
                    src={space.image} 
                    alt={space.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-primary-600" />
                )}
              </div>

              <div className="p-6">
                {/* Encabezado del espacio */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {space.name || 'Nombre no disponible'}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(space.type)}`}>
                    {space.type || 'Sin tipo'}
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {space.description || 'Sin descripción disponible'}
                </p>

                {/* Información del espacio */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{space.location || 'Ubicación no especificada'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Capacidad: {space.capacity || 'No especificada'} personas</span>
                  </div>
                  {space.pricePerHour && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>${space.pricePerHour}/hora</span>
                    </div>
                  )}
                </div>

                {/* Amenidades */}
                {space.amenities && space.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Amenidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {space.amenities.slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {getAmenityIcon(amenity)}
                          <span className="ml-1">{amenity}</span>
                        </span>
                      ))}
                      {space.amenities.length > 4 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{space.amenities.length - 4} más
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Estado de disponibilidad */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    space.available !== false ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'
                  }`}>
                    {space.available !== false ? 'Disponible' : 'No disponible'}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="btn btn-secondary flex items-center text-sm px-3 py-2">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSpace(space.id)}
                      className="p-2 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay espacios</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || typeFilter !== 'all' 
              ? 'No se encontraron espacios con los filtros aplicados' 
              : 'Comienza agregando tu primer espacio'
            }
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Espacio
          </button>
        </div>
      )}
    </div>
  );
};

export default Spaces;
