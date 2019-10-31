module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('Report', { // 테이블명은 users
        reportId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        updateDay: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING(5),
            allowNull: true,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'reports',
        timestamps: false
    });
    Report.associate = (db) => {
        db.Report.belongsTo(db.User);
        db.Report.hasMany(db.ReportImage);
    };

    return Report;
};