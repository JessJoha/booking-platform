import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Building2,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';

import { reservationService } from '../services/reservationService';
import { spaceService } from '../services/spaceService';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalReservations: 0,
    totalSpaces: 0,
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      const [reservationsRes, spacesRes, profileRes] = await Promise.allSettled([
        reservationService.getAllReservations(),
        spaceService.getAllSpaces(),
        userService.getProfile()
      ]);

      const newMetrics = { ...metrics };

      if (reservationsRes.status === 'fulfilled') {
        newMetrics.totalReservations = reservationsRes.value.length || 0;
        setRecentReservations(reservationsRes.value.slice(0, 5));
      }

      if (spacesRes.status === 'fulfilled') {
        newMetrics.totalSpaces = spacesRes.value.length || 0;
      }

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value);
      }

      setMetrics(newMetrics);
    } catch (error) {
      toast.error('Error al cargar datos del dashboard');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'confirmada':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'pendiente':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
      case 'cancelada':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hola, {profile?.username || 'Usuario'} 👋</h1>
        <p className="text-gray-600">Este es tu resumen general de actividad</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reservas</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalReservations}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Espacios disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalSpaces}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent reservations */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservas Recientes</h3>
        {recentReservations.length > 0 ? (
          <div className="space-y-3">
            {recentReservations.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(r.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {r.spaceName || `Espacio ${r.spaceId}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {r.userName || `Usuario ${r.userId}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(r.status)}`}>
                    {r.status || 'Pendiente'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(r.startTime || r.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No hay reservas recientes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
