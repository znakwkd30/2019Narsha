module.exports = (sequelize, DataTypes) => {
    const Heart = sequelize.define('Heart', { // 테이블명은 users
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'hearts',
        timestamps: false
    });
    Heart.associate = (db) => {
        db.Heart.belongsTo(db.User);
        db.Heart.belongsTo(db.Product);
    };

    return Heart;
};