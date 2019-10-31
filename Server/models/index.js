const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = require('./user')(sequelize, Sequelize);
db.Product = require('./product')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Heart = require('./heart')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Report = require('./report')(sequelize, Sequelize);
db.ChatUser = require('./chatUser')(sequelize, Sequelize);
db.ChatRoom = require('./chatRoom')(sequelize, Sequelize);
db.ChatMessage = require('./chatMessage')(sequelize, Sequelize);
db.ProfileImage = require('./profileImage')(sequelize, Sequelize);
db.PrivateComment = require('./privateComment')(sequelize, Sequelize);
db.Category = require('./category')(sequelize, Sequelize);
db.ReportImage = require('./reportImage')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;