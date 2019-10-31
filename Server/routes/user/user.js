const express = require('express');
const path = require('path');
const multer = require('multer');

const auth = require('../middleware');

const Controller = require('./user.ctrl');

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'public/profile');
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + new Date().valueOf() + ext);
      }
    }),
});

const router = express.Router();
router.use(express.static(__dirname + '/profile'));

router.post('/', Controller.register); // /api/user/ 회원가입
router.get('/userInfo', auth, Controller.userInf);
router.post('/login', Controller.login); // /api/user/login 로그인
router.post('/findId', Controller.idFind); // /api/user/findId 아이디 찾기
router.post('/findPassword', Controller.passwordFind); // /api/user/findPassword 비밀번호
router.post('/profile', auth, upload.single('image'), Controller.profileImg); // /api/user/profile 프로필사진 업로드
router.patch('/totalUpdate', auth, upload.single('image'), Controller.totalUpdate);
router.delete('/deleteUser', auth, Controller.userOut); // /api/user/deleteUser
router.get('/sellerInfo/:id', auth, Controller.sellerInf);

module.exports = router;