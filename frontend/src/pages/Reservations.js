import React, { useState, useEffect } from 'react';
import { reservationService } from '../services/reservationService';
import { spaceService } from '../services/spaceService';
import { 
  Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ userId: '', spaceId: '', date: '', time: '', reason: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [resData, spaceData] = await Promise.all([
        reservationService.getAllReservations(),
        spaceService.getAllSpaces()
      ]);
      setReservations(resData || []);
      setSpaces(spaceData || []);
    } catch (error) {
      toast.error('Error al cargar reservas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await reservationService.updateReservation(editingId, formData);
        toast.success('Reserva actualizada');
      } else {
        await reservationService.createReservation(formData);
        toast.success('Reserva creada');
      }
      setShowForm(false);
      setFormData({ userId: '', spaceId: '', date: '', time: '', reason: '' });
      setEditingId(null);
      loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startEdit = (reservation) => {
    setFormData({
      userId: reservation.userId,
      spaceId: reservation.spaceId,
      date: reservation.date,
      time: reservation.time,
      reason: reservation.reason || ''
    });
    setEditingId(reservation.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Cancelar esta reserva?')) {
      try {
        await reservationService.deleteReservation(id);
        toast.success('Reserva cancelada');
        loadData();
      } catch {
        toast.error('Error al cancelar');
      }
    }
  };

  const filtered = reservations.filter(r => {
    const matchSearch = r.spaceId?.toString().includes(searchTerm) || r.userId?.toString().includes(searchTerm);
    const matchStatus = statusFilter === 'all' || r.status?.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
        <button className="btn btn-primary" onClick={() => {
          setFormData({ userId: '', spaceId: '', date: '', time: '', reason: '' });
          setEditingId(null);
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reserva
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleCreateOrUpdate} className="card p-4 space-y-4">
          <select required value={formData.spaceId} onChange={e => setFormData({ ...formData, spaceId: e.target.value })} className="input">
            <option value="">Selecciona un espacio</option>
            {spaces.map(s => (
              <option key={s.id} value={s.id}>{s.name || `Espacio ${s.id}`}</option>
            ))}
          </select>
          <input required type="text" placeholder="ID de usuario" value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} className="input" />
          <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="input" />
          <input required type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="input" />
          <input type="text" placeholder="Motivo" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="input" />
          <div className="flex justify-end space-x-2">
            <button type="submit" className="btn btn-success">{editingId ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancelar</button>
          </div>
        </form>
      )}

      {/* Filtros */}
      <div className="card p-4">
        <div className="flex gap-4">
          <input type="text" placeholder="Buscar por ID" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-40">
            <option value="all">Todos</option>
            <option value="confirmed">Confirmadas</option>
            <option value="pending">Pendientes</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        {filtered.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4">Espacio</th>
                <th className="text-left py-2 px-4">Usuario</th>
                <th className="text-left py-2 px-4">Fecha</th>
                <th className="text-left py-2 px-4">Hora</th>
                <th className="text-left py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="py-2 px-4">{r.spaceId}</td>
                  <td className="py-2 px-4">{r.userId}</td>
                  <td className="py-2 px-4">{r.date}</td>
                  <td className="py-2 px-4">{r.time}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button onClick={() => startEdit(r)} className="text-blue-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">No hay reservas</div>
        )}
      </div>
    </div>
  );
};

export default Reservations;
