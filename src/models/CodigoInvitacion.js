const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CodigoInvitacion = sequelize.define('CodigoInvitacion', {
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    rol: {
      type: DataTypes.ENUM('administrador', 'gerente', 'empleado'),
      allowNull: false,
    },
    usosMaximos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usosRealizados: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'codigos_invitacion',
    timestamps: true,
  });

  return CodigoInvitacion;
};
