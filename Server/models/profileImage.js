module.exports = (sequelize, DataTypes) => {
    const ProfileImage = sequelize.define('ProfileImage', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      src: { // S3 저장
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'profileimages',
      timestamps: false
    });

    ProfileImage.associate = function(db) {
      db.ProfileImage.belongsTo(db.User);
    }
    
    return ProfileImage;
};