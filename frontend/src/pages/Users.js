import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import {
  Users,
  Mail,
  Phone,
  Calendar,
  Edit,
  Shield,
  User,
  UserCheck,
  UserX,
  Save,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    city: '',
    address: ''
  });

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setUser(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        bio: data.bio || '',
        city: data.city || '',
        address: data.address || ''
      });
    } catch (err) {
      toast.error('Error al cargar perfil');
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      await userService.updateProfile(formData);
      toast.success('Perfil actualizado correctamente');
      setEditMode(false);
      loadProfile();
    } catch (err) {
      toast.error('Error al actualizar perfil');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal</p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="btn btn-secondary"
        >
          {editMode ? <XCircle className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
          {editMode ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre completo</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-800">{user.name || 'No definido'}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Teléfono</label>
            {editMode ? (
              <input
                type="text"
                name="phone"
                className="input"
                value={formData.phone}
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-800">{user.phone || 'No definido'}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Ciudad</label>
            {editMode ? (
              <input
                type="text"
                name="city"
                className="input"
                value={formData.city}
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-800">{user.city || 'No definida'}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Dirección</label>
            {editMode ? (
              <input
                type="text"
                name="address"
                className="input"
                value={formData.address}
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-800">{user.address || 'No definida'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Biografía</label>
            {editMode ? (
              <textarea
                name="bio"
                className="input"
                value={formData.bio}
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-800">{user.bio || 'Sin biografía'}</p>
            )}
          </div>
        </div>

        {editMode && (
          <div className="flex justify-end">
            <button onClick={handleSave} className="btn btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
