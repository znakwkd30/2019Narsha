const tokenLib = require('../lib/token');
const db = require('../models');

module.exports = async (req, res, next) => {
    const { token } = req.headers;
    if(!token) {
        return res.status(403).send('토큰을 전송해주세요.');
    }
    console.log(`start decoded`);
    let decoded = await tokenLib.verifyToken(token);
    if(!decoded) {
        return res.status(403).send('토큰 정보가 undefinded or null 입니다.');
    }
    
    await db.User.findOne({where: { id: decoded.id }})
    .then(async user => {
        req.user = user;
    })
    .catch(err => {
        console.log(`TOKEN멤버 조회불가\n${err}`);
    })
    
    await next();
};