module.exports = (sequelize, DataTypes) => {
    const ChatUser = sequelize.define('ChatUser', {
        senderId: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.STRING(20),
            allowNull: false,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
    });
    ChatUser.associate = (db) => {
        db.ChatUser.hasMany(db.ChatRoom);
        db.ChatUser.hasMany(db.ChatMessage);
    };

    return ChatUser;
};