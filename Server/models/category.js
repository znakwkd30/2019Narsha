module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
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
    Category.associate = (db) => {
      db.Category.belongsToMany(db.Product, {through: 'ProductCategory'});
    };

    return Category;
};