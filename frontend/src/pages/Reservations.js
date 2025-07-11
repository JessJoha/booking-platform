import React, { useState, useEffect } from 'react';
import { reservationService } from '../services/reservationService';
import { spaceService } from '../services/spaceService';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/authContext';

const Reservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ spaceId: '', date: '', time: '', reason: '' });
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
      const payload = { ...formData, userId: user.user_id };

      if (editingId) {
        await reservationService.updateReservation(editingId, payload);
        toast.success('Reserva actualizada');
      } else {
        await reservationService.createReservation(payload);
        toast.success('Reserva creada');
      }

      setShowForm(false);
      setFormData({ spaceId: '', date: '', time: '', reason: '' });
      setEditingId(null);
      loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startEdit = (reservation) => {
    setFormData({
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
    const matchSearch =
      r.spaceId?.toString().includes(searchTerm) ||
      r.userId?.toString().includes(searchTerm);
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
        <button className="btn btn-primary" onClick={() => {
          setFormData({ spaceId: '', date: '', time: '', reason: '' });
          setEditingId(null);
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reserva
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateOrUpdate} className="card p-4 space-y-4">
          <select required value={formData.spaceId} onChange={e => setFormData({ ...formData, spaceId: e.target.value })} className="input">
            <option value="">Selecciona un espacio</option>
            {spaces.map(s => (
              <option key={s.id} value={s.id}>{s.name || `Espacio ${s.id}`}</option>
            ))}
          </select>
          <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="input" />
          <input required type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="input" />
          <input type="text" placeholder="Motivo" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="input" />
          <div className="flex justify-end space-x-2">
            <button type="submit" className="btn btn-success">{editingId ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancelar</button>
          </div>
        </form>
      )}

      <div className="card p-4">
        <input type="text" placeholder="Buscar por ID" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input" />
      </div>

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
