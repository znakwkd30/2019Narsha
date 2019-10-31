module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define('ChatRoom', {
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
    });
    ChatRoom.associate = (db) => {
        db.ChatRoom.belongsTo(db.ChatUser);
    };

    return ChatRoom;
};