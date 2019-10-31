module.exports = function (sequelize, DataTypes) {
    const Product = sequelize.define('Product', {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
      },
      productName: { 
        type: DataTypes.STRING(50), 
        allowNull: false,
      },
      description: {  
        type: DataTypes.STRING(1000), 
        allowNull: false,
      },
      price: { 
        type: DataTypes.INTEGER, 
        allowNulll: false, 
      },
      heart: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
      },
      hashtag: { 
        type: DataTypes.STRING(30), 
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      updateDay: {  
        type: DataTypes.DATE, 
        allowNull: true,
      },
      state: { 
        type: DataTypes.STRING(45), 
        allowNull: true,
      }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'products',
        timestamps: false
    });

    Product.associate = function(db) {
      db.Product.belongsTo(db.User);
      db.Product.hasMany(db.Image);
      db.Product.hasMany(db.Comment);
      db.Product.hasMany(db.Heart);
      db.Product.hasMany(db.PrivateComment);
      db.Product.belongsToMany(db.Hashtag, {through: 'ProductHashTag'});
      db.Product.belongsToMany(db.Category, {through: 'ProductCategory'});

      Product.getSellerProduct = (id) => Product.findAll({
        where: { UserId: id },
        order: [['updateDay', 'DESC']],
        include: [db.Image],
      })
    };

    return Product;
  };