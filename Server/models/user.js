module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { // 테이블명은 users
        id: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        schoolName: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        permission: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'users',
        timestamps: false
    });

    User.associate = function(db) {
        db.User.hasMany(db.Report);
        db.User.hasMany(db.Heart);
        db.User.hasMany(db.Comment);
        db.User.hasMany(db.Product);
        db.User.hasMany(db.PrivateComment);
        db.User.hasMany(db.ProfileImage);

        User.Create = (data) => User.create(data);

        User.getSeller = (id) => User.findOne({
            where: { id: id },
            include: [db.ProfileImage],
        });
    };

    return User;
};