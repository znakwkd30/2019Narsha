module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', {
      id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      tableName: 'hashtags',
      timestamps: false
    });
    Hashtag.associate = (db) => {
      db.Hashtag.belongsToMany(db.Product, {through: 'ProductHashTag'});
    };

    return Hashtag;
};