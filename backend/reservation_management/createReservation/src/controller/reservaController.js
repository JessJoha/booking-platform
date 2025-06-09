const Reserva = require('../model/reservaModel');

async function crear(req, res) {
  try {
    const { usuarioId, espacio, fecha, hora, motivo } = req.body;

    if (!usuarioId || !espacio || !fecha || !hora) {
      return res.status(400).json({ message: 'Campos obligatorios faltantes' });
    }

    // Validar tipo de espacio
    const espaciosPermitidos = ['Sala', 'Cancha Deportiva'];
    if (!espaciosPermitidos.includes(espacio)) {
      return res.status(400).json({ message: 'El tipo de espacio debe ser Sala o Cancha Deportiva' });
    }

    // Validación de fecha (ejemplo: que no sea una fecha pasada)
    const hoy = new Date().toISOString().split('T')[0];
    if (fecha < hoy) {
      return res.status(400).json({ message: 'La fecha debe ser hoy o una fecha futura' });
    }

    const nuevaReserva = await Reserva.create({
      usuarioId,
      espacio,
      fecha,
      hora,
      motivo
    });

    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ message: 'Error al guardar la reserva' });
  }
}

module.exports = { crear };
