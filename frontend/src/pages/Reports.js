import React, { useState, useEffect } from 'react';
import { reportsService } from '../services/reportsService';
import { 
  Download, 
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

const Reports = () => {
  const [occupancyData, setOccupancyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  const loadReportsData = async () => {
    try {
      setIsLoading(true);
      const data = await reportsService.getOccupancyReports(dateRange);
      setOccupancyData(data || []);
    } catch (error) {
      toast.error('Error al cargar reportes de ocupación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async (format = 'csv') => {
    try {
      const blob = await reportsService.exportReport('occupancy', format, dateRange);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `occupancy_report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Reporte exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar reporte');
    }
  };

  const sampleOccupancyData = [
    { date: '2024-06-01', reservations: 5 },
    { date: '2024-06-02', reservations: 8 },
    { date: '2024-06-03', reservations: 2 },
    { date: '2024-06-04', reservations: 10 },
    { date: '2024-06-05', reservations: 7 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reporte de Ocupación</h1>
          <p className="text-gray-600">Visualiza el total de reservas por fecha</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => handleExportReport('csv')}
            className="btn btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
          <button
            onClick={() => handleExportReport('pdf')}
            className="btn btn-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Rango de Fechas:</span>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="input w-auto"
          />
          <span className="text-gray-500">hasta</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="input w-auto"
          />
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservas por Fecha</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={occupancyData.length > 0 ? occupancyData : sampleOccupancyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="reservations" fill="#3B82F6" name="Reservas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;
