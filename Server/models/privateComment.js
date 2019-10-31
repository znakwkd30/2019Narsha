module.exports = (sequelize, DataTypes) => {
    const PrivateComment = sequelize.define('PrivateComment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productUserId: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        updateDay: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        content: {
            type: DataTypes.STRING(10000),
            allowNull: false,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
    });
    PrivateComment.associate = (db) => {
        db.PrivateComment.belongsTo(db.User);
        db.PrivateComment.belongsTo(db.Product);
    };

    return PrivateComment;
};