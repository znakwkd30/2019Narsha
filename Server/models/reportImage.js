module.exports = (sequelize, DataTypes) => {
    const ReportImage = sequelize.define('ReportImage', {
        src: {
            type: DataTypes.STRING(200),
            alloNull: false,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
    });
    ReportImage.associate = (db) => {
        db.ReportImage.belongsTo(db.Report);
    };

    return ReportImage;
};