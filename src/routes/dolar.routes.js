const express = require('express');
const router = express.Router();
const dolarAPI = require('../services/dolarAPI.service');
const authJWT = require('../middlewares/authJWT');

// GET /api/dolar - Obtener cotización del dólar blue
router.get('/', authJWT, async (req, res) => {
  try {
    const cotizacion = await dolarAPI.obtenerCotizacion();
    res.json({ 
      success: true, 
      data: cotizacion,
      message: 'Cotización obtenida exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener cotización: ' + error.message 
    });
  }
});

module.exports = router;
