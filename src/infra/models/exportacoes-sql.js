const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ExportacaoSql extends Model {}

  ExportacaoSql.init(
    {
      hash: DataTypes.STRING,
      filtros: DataTypes.ARRAY(DataTypes.STRING),
      situacao: DataTypes.INTEGER,
      tentativasProcessamento: DataTypes.INTEGER,
      caminhoArquivo: DataTypes.STRING,
      dataGeracao: DataTypes.DATE,
      dataExclusao: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'ExportacaoSql',
      tableName: 'ExportacaoSql',
      timestamps: true, 
    }
  );

  return ExportacaoSql;
};
