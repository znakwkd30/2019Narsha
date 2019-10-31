module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
      src: { // S3 저장
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'images',
      timestamps: false
    });
    Image.associate = (db) => {
      db.Image.belongsTo(db.Product);
    };
    
    return Image;
};