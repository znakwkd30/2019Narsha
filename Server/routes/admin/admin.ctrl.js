const tokenLib = require('../../lib/token');
const db = require('../../models');

async function authMiddleware(req, res) {
    let check = false;
    const { token } = req.headers;

    if(!token) {
        return res.status(403).send('토큰을 전송해주세요.');
    }

    console.log(`start decoded`);
    let decoded = await tokenLib.verifyToken(token);
    if(!decoded) {
        return res.status(403).send('토큰 정보가 undefinded or null 입니다.');
    }
    
    const adminUser = await db.User.findOne({where: { userId: decoded.userId }})
    .then(async user => {
        if (user.permission == 0) {
            console.log('admin이 아닙니다.');
        } else {
            console.log(user.permission);
            req.user = user;
            check = true;
        }
    })
    .catch(err => {
        console.log(`TOKEN멤버 조회불가\n${err}`);
    })

    return check;
}

exports.Ulist = async (req, res, next) => {
    if (await authMiddleware(req, res)) {
        try {
            const userList = await db.User.findAll()

            return res.status(200).json(userList);
        } catch (error) {
            console.log(error);
            next(error);
        }
    } else {
        return res.status(404).send('admin user가 아닙니다.');
    }
}

exports.Udel = async (req, res, next) => {
    if (await authMiddleware(req, res)) {
        try {
            const existId = await db.User.findOne({
                where: {
                    userId: req.body.userId,
                },
            });
    
            if (!existId) {
                return res.status(403).send('잘못된 아이디입니다.');
            }
    
    
            const deleteUser = await db.User.destroy(
                {
                    where: {
                    userId: req.body.userId,
                    },
                }
            );
    
            console.log(deleteUser);
            
            return res.status(200).send('[admin]유저정보 삭제완료.');
        } catch (error) {
            console.log(error);
            next(error);
        }
    } else {
        return res.status(404).send('admin user가 아닙니다.');
    }
}

exports.UpState = async (req, res, next) => {
    if (await authMiddleware(req, res)) {
        try {
            const existProduct = await db.Product.findOne({
              where: {
                id: req.params.id,
              },
            });
        
            if (!existProduct) {
              return res.status(403).send('존재하지않는 상품입니다.');
            }
        
            const updateProduct = await db.Product.update(
              {
                state: req.body.state,
              },
              {
                where: {
                  id: req.params.id,
                },
              }
            );

            console.log(updateProduct);
        
            return res.status(200).send('상품정보 변경완료');
          } catch (error) {
            console.log(error);
            next(error);
          }
    } else {
        return res.status(404).send('admin user가 아닙니다.');
    }
}

exports.one = async (req, res, next) => {
    if (await authMiddleware(req, res)) {
        try {
          const oneProduct = await db.Product.findOne({
            where: {
              id: req.params.id,
            },
          });
      
          if (!oneProduct) {
            return res.status(403).send('표시할 상품이 없습니다.');
          }
      
          console.log(oneProduct);
          return res.status(200).json(oneProduct);
        } catch (error) {
          console.log(error);
          next(error);
        }
      } else {
        return res.status(400).send('admin이 아닙니다');
      }
}

exports.search = async (req, res, next) => {
    if (await authMiddleware(req, res)) {
        try {
          const searchProductList = await db.Product.findAll({
            where: {
              productName: req.params.id,
            },
            order: [['updateDay', 'DESC']],
          });
      
          if (searchProductList.length == 0) {
            return res.status(403).send('표시할 상품이 없습니다.');
          }
      
          console.log(searchProductList);
          res.status(200).json(searchProductList);
        } catch (error) {
          console.log(error);
          next(error);
        }
    } else {
    return res.status(400).send('admin이 아닙니다');
    }
}

exports.searchDetail = async (req, res, next) => {
    if (await authMiddleware(req, res)) {
        try {
          const searchProduct = await db.Product.findOne({
            where: {
              id: req.params.id,
            },
          });
      
          if (!searchProduct) {
            return res.status(403).send('표시할 상품이 없습니다.');
          }
      
          console.log(searchProduct);
          return res.status(200).json(searchProduct);
        } catch (error) {
          console.log(error);
          next(error);
        }
    } else {
    return res.status(400).send('admin이 아닙니다');
    }
}

exports.productDel = async (req, res, next) => {
    if (await authMiddleware(req, res)) {
        try {
            const existProduct = await db.Product.findOne({
              where: {
                id: req.params.id,
              },
            });
        
            if (!existProduct) {
              return res.status(403).send('존재하지않는 상품입니다.');
            }
        
            const updateProduct = await db.Product.destroy({
                where: {
                  id: req.params.id,
                },
              }
            );

            console.log(updateProduct);
        
            return res.status(200).send('[admin]상품 삭제완료');
          } catch (error) {
            console.log(error);
            next(error);
          }
    } else {
        return res.status(404).send('admin user가 아닙니다.');
    }
}

exports.heartlist = async (req, res, next) => {
    if (await authMiddleware(req, res)) {
        try {
          const heartProductList = await db.Heart.findAll({
            where: {
              userId: req.user.userId,
            },
            include: [{
              model: db.Product,
            }]
          });
      
          if (heartProductList.length == 0) {
            return res.status(403).send('찜한상품이 존재하지 않습니다.');
          }
      
          return res.status(200).json(heartProductList);
        } catch (error) {
          console.log(error);
          next(error);
        }
    } else {
        return res.status(404).send('admin user가 아닙니다.');
    }
}

exports.reportList = async (req, res, next) => {
    if (await authMiddleware(req, res)) {
        try {
            const reportList = await db.Report.findAll();
        
            if (!reportList) {
              return res.status(403).send('[admin]신고 목록이 없습니다.');
            }

            console.log(reportList);
        
            return res.status(200).json(reportList);
          } catch (error) {
            console.log(error);
            next(error);
          }
    } else {
        return res.status(404).send('admin user가 아닙니다.');
    }
}

exports.hashList = async (req, res, next) => {
    if (await authMiddleware(req, res)) {
        try {
            const tagList = await db.Hashtag.findAll();
        
            if (!tagList) {
              return res.status(403).send('[admin]등록된 태그가 없습니다.');
            }

            console.log(tagList);
        
            return res.status(200).json(tagList);
          } catch (error) {
            console.log(error);
            next(error);
          }
    } else {
        return res.status(404).send('admin user가 아닙니다.');
    }
}

exports.stateUp = async (req, res, next) => {
  if (await authMiddleware(req, res)) {
      db.Report.update(
      {
        state: req.body.state,
      },
      {
        where: {
          id: req.params.id,
          UserId: req.user.id,
        },
      }
    )
    .then(data => {
      db.Report.findOne({
        where: { id: req.params.id, },
      })
      .then(data => {
        console.log(data);
        // if (data.dataValues.state === 1) {
        //   return res.status(200).send({
        //     "message": '.',
        //     "product": data,
        //   });
        // } else if (data.dataValues.state === 2) {
        //   return res.status(200).send({
        //     "message": '판매 완료된 상품으로 state가 변경 되었습니다.',
        //     "product": data,
        //   });
        // } else {
        //   return res.status(200).send({
        //     "message": '판매중인 상품으로 state가 변경되었습니다.',
        //     "product": data,
        //   });
        // }
        return res.status(200).send('state를 변경했습니다');
      })
      .catch(err => {
        console.log(err);
      })
    })
    .catch(err => {
      console.log(err);
      next(err);
    })
  } else {
    return res.status(404).send('admin user가 아닙니다.');
  }
}