module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        tableName: 'comments',
        timestamps: false
    });
    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Product);
    };

    return Comment;
};