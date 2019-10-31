module.exports = (sequelize, DataTypes) => {
    const ChatMessage = sequelize.define('ChatMessage', {
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        chattingUserId: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(200),
            allowNull: false, 
        },
        isRead: {
            type: DataTypes.TINYINT(1),
            allowNull: true,
        },
        createAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
    });
    ChatMessage.associate = (db) => {
        ChatMessage.belongsTo(db.ChatUser);
    };

    return ChatMessage;
};