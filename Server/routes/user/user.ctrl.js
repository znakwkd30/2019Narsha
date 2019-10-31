const bcrypt = require('bcrypt');
const db = require('../../models');
const school = require('neis-api');
const jwt = require('../../lib/token');

exports.register = async (req, res, next) => {
    try {
        // if (req.body.id.match(/^[a-z0-9_]{4,20}$/)) {
        //     console.log('정확한 아이디');
        // } else {
        //     return res.status(400).send({
        //         "message": '아이디 요구조건을 만족하지 못했습니다.',
        //     })
        // }

        // if (req.body.password.match(/(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/)) {
        //     console.log('정확한 비밀번호');
        // } else {
        //     return res.status(400).send({
        //         "message": '비밀번호 요구조건을 만족하지 못했습니다.',
        //     })
        // }

        // if (req.body.email.match(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a9zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i)) {
        //     console.log('정확한 이메일');
        // } else {
        //     return res.status(400).send({
        //         "message": '이메일 요구조건을 만족하지 못했습니다.',
        //     })
        // }

        // if (req.body.phoneNumber.match(/^\d{3}\d{3,4}\d{4}$/)) {
        //     console.log('정확한 폰번호');
        // } else {
        //     return res.status(400).send({
        //         "message": '폰번호 요구조건을 만족하지 못했습니다.',
        //     })
        // }

        const existUser = await db.User.findOne({
            where: {
                id: req.body.id,
            },
        });

        if (existUser) {
            return res.status(400).send({
                "message": '이미 사용중인 아이디 입니다.',
            })
        }

        const existEmail = await db.User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (existEmail) {
            return res.status(400).send({
                "message": '이미 사용중인 이메일 입니다.',
            })
        }
        
        const existPhoneNumber = await db.User.findOne({
            where: {
                phoneNumber: req.body.phoneNumber,
            },
        });

        if (existPhoneNumber) {
            return res.status(400).send({
                "message": '이미 사용중인 핸드폰번호 입니다.',
            })
        }

        let existSchool = true;
        await school(req.body.schoolName)
        .then(list => {
            console.log(list);
            if(list.length == 0) {
                existSchool = false; // 존재하지않는학교.
            }
        });

        console.log(existSchool);

        if (!existSchool) {
            return res.status(400).send({
                "message": '존재하지 않는 학교입니다.',
            })
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const User = await db.User.create({
            id: req.body.id,
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            schoolName: req.body.schoolName,
        });

        // const User = await db.User.Create(req.body);
        
        db.ProfileImage.create({
            src: '\\profile\\user.png',
            UserId: req.body.id,
        })

        console.log(User);
        return res.status(200).json(User);
    } catch (error) {
        console.log(error);
        //에러 처리
        return next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const checkId = await db.User.findOne({
            where: {
                id: req.body.id,
            },
        });

        if (!checkId) {
            return res.status(403).send('잘못된 아이디입니다.');
        }

        const checkPassword = await db.User.findOne({
            where: {
                id: req.body.id,
            },
        });

        const match = await bcrypt.compare(req.body.password, checkPassword.password);

        if (match) {
            const token = await jwt.createToken(req.body.id);
            const refreshToken = await jwt.createRefreshToken(req.body.id);
            
            console.log(`[Token] : ${token}, [RefreshToken] : ${refreshToken}`);
            return res.status(200).send({
                "status": 200,
                "message": "success",
                "data": {
                    "token": { token/*, refreshToken*/ },
                    "user": checkId.dataValues,
                }
            });
        } else {
            return res.status(400).send('아이디 혹은 비밀번호 오류입니다.');
        } 
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.idFind = async (req, res, next) => {
    try {
        const existUser = await db.User.findOne({
            where: {
                name: req.body.name,
            },
        });

        if (!existUser) {
            return res.status(403).send('가입하지않은 사용자입니다.');
        }

        res.status(200).send({
            "id": existUser.id
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.passwordFind = async (req, res, next) => {
    try {
        const existUser = await db.User.findOne({
            where: {
                id: req.body.id,
            },
        });

        if (!existUser) {
            return res.status(403).send('아이디가 잘못되었습니다.');
        }

        const match = await bcrypt.compare(req.body.updatePassword, existUser.password);

        if (match) {
            return res.status(400).send('변경하려는 비밀번호와 현재 비밀번호가 동일합니다.')
        } else {
            const hashedPassword = await bcrypt.hash(req.body.updatePassword, 12);
            await db.User.update(
                {
                    password: hashedPassword
                },
                {
                    where: {
                    id: req.body.id,
                    },
                }
            )
            .then(result => {
                console.log(`업데이트완료.${result}`);
                return res.status(200).send({
                    'message': '유저정보 변경완료.'
                });
            })
            .catch(err => {
                console.log(err);
                return res.status(403).send('비밀번호 업데이트도중 오류발생.');
            })
        }


    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.profileImg = (req, res, next) => {
    try {
        let image = req.file;
        db.ProfileImage.create({
            src: image.path,
            UserId: req.user.id,
        })
        .then(data => {
            console.log(data);
            return res.status(200).send('프로필 사진을 업로드 했습니다.');
        })
        .catch(err => {
            console.log(err);
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.userOut = async (req, res, next) => {
    try {
        const existId = await db.User.findOne({
            where: {
                id: req.user.id,
            },
        });

        if (!existId) {
            return res.status(400).send('잘못된 아이디입니다.');
        }


        await db.User.destroy(
            {
                where: {
                id: req.user.id,
                },
            }
        )
        .then(result => {
            console.log(`유저정보 삭제완료.${result}`);
            return res.status(200).send('유저정보 삭제완료.');
        })
        .catch(err => {
            console.log(err);
            return res.status(403).send('유저정보 삭제도중 오류발생.');
        })        
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.userInf = (req, res) => {
    db.User.findOne({
        where: {
            id: req.user.id,
        },
        include: [{
            model: db.ProfileImage,
        }]
    })
    .then(result => {
        return res.status(200).send({
            "data": result,
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.totalUpdate = async(req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.user.id,
            },
        });

        console.log(req.body);

        let School = true;
        await school(req.body.schoolName)
        .then(list => {
            console.log(list);
            if(list.length == 0) {
                School = false; // 존재하지않는학교.
            }
        });

        console.log(School);

        if (!School) {
            return res.status(403).send('존재하지않는 학교입니다.');
        }

        await db.User.update(
        {
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            schoolName: req.body.schoolName,
        },
        {
            where: {
                id: req.user.id,
            },
        })
        .catch(err => {
            console.log(err);
            return res.status(403).send('정보 업데이트도중 오류발생.');
        })
        
        let image = req.file;
        if (image === undefined) {
            return res.status(200).send('변경완료');
        } else {
            console.log(image);
            let url = (String)(image.path).split('public');
            await db.ProfileImage.update({
                src: url[1],
            },
            {
                where: {
                    UserId: req.user.id
                },                
            })
            .then(data => {
                console.log(data);
                return res.status(200).send('2.변경완료');
            })
        }

        
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.sellerInf = async(req, res) => {
    try {   
        let result = await db.User.getSeller(req.params.id);
        return res.status(200).send(result);   
    } catch (error) {
        return res.status(500).send({
            message: "서버 에러"
        })
    }
}