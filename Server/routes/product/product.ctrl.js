const db = require('../../models');

exports.productRegister = async (req, res, next) => {
    try {
      console.log("------------------------")
      console.log(req.files);
      console.log(req.body);
        const hashtags = req.body.hashtag.match(/#[^\s]+/g);
        const categorys = req.body.category;

        const product = await db.Product.create({
          UserId: req.user.id,  
          productName: req.body.productName,
          description: req.body.description,
          price: req.body.price,
          hashtag: req.body.hashtag,
          category: req.body.category,
        });
        
        if (hashtags) {
          const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })));
        }
        
        if (categorys) {
          const result = await db.Category.findOrCreate({
            where: { name: categorys },
          });
        }

        let image = req.files;
        console.log(image);
        if (image === undefined || image === null || image.length === 0) {
          db.Image.create({
            ProductId: product.id,
            src: "\\uploads\\noImg.png"
          })
        } else {
          if(Array.isArray(image)) {
            // Array
            image.forEach(async (imageElement) => {
              let url = String(imageElement.path).split('public');
              await db.Image.create({
                ProductId: product.id,
                src: url[1],
              });
            });
            return res.status(200).json(product);
          } else {
            const image = await db.Image.create({ 
              ProductId: product.id,
              src: image.path,
            });
          
          return res.status(200).json(product);
          }
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
}

exports.productUp = async (req, res, next) => {
  try {
    console.log(req.body);
    const id  = req.params.id;
    const existProduct = await db.Product.findOne({
      where: {
        id: id,
      },
    });

    if (!existProduct) {
      return res.status(403).send('존재하지않는 상품입니다.');
    }

    await db.Product.update({
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      hashtag: req.body.hashtag,
      category: req.body.category,
      state: req.body.state,
    },
    {
      where: {
        id: id,
      },
    })

    console.log(req.files);
    let image = req.files;
    if(image === undefined) {
      return res.status(200).send("수정완료");
    } else {
      await db.Image.destroy({
        where: {
          ProductId: req.params.id,
        }
      })

      if(Array.isArray(image)) {
        // Array  
        image.forEach(async (imageElement) => {
          let url = String(imageElement.path).split('public');
          await db.Image.create({
            ProductId: req.params.id,
            src: url[1],
          });
        });
        return res.status(200).json("수정완료");
      } else {
        const image = await db.Image.create({ 
          ProductId: req.params.id,
          src: image.path,
        });
        
        return res.status(200).json("수정완료");
      }
    }
  } catch (error) {
      console.log(error);
      next(error);
  }
}

exports.productDel = async (req, res, next) => {
    try {
      const id  = req.params.id;
      const existProduct = await db.Product.findOne({
        where: {
          id: id,
          UserId: req.user.id,
        },
        include: [{
          "model": db.Image,
        }]
      });

  
      if (!existProduct) {
        return res.status(403).send('존재하지않는 상품입니다.');
      }

      await db.Image.destroy({
        where: {
          ProductId: existProduct.id,
        }
      })
      .then(data => {
      })

      await db.Heart.destroy({
        where: {
          ProductId: existProduct.id,
        }
      });

      await db.Product.destroy({
        where: {
          id: id,
        },
      })
      .then(async result => {
        console.log(`상품 삭제 완료.${result}`);
        return res.status(200).send('상품정보 삭제완료.');
      })
      .catch(err => {
        console.log(err);
        return res.status(403).send('상품 삭제도중 오류발생');
      })
    } catch (error) {
      console.log(error);
      next(error);
    }
}

exports.mainProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    const productList = await db.Product.findAll({
      limit: 8,
      order: [['updateDay', 'DESC']],
      include: [{
        model: db.Image,
      }]
    });
  
    if (productList.length == 0) {
      return res.status(403).send('표시할 상품이 없습니다.');
    }

    return res.status(200).send({
        'productList': productList,
    });
  } catch (error) {
    console.log(error);
  next(error);
  }
}

exports.allProduct = async (req, res, next) => {
    try {
        const productList = await db.Product.findAll({
          order: [['updateDay', 'DESC']],
          include: [{
            model: db.Image,
          }]
        });
    
        if (productList.length == 0) {
          return res.status(403).send('표시할 상품이 없습니다.');
        }

        return res.status(200).send({
          'productList': productList,
        });
      } catch (error) {
        console.log(error);
        next(error);
      }
}

exports.myProduct = async (req, res, next) => {
  try {
      const existUser = await db.User.findOne({
        where: {
          id: req.user.id,
        },
      });
      
      if (!existUser) {
        return res.status(403).send('존재하지 않는 유저입니다.');
      }

      const myProductList = await db.Product.findAll({
        where: { UserId: req.user.id },
        order: [['updateDay', 'DESC']],
        include: [{
          model: db.Image,
        }]
      });
  
      if (!myProductList) {
        return res.status(403).send('등록한 상품이 없습니다.');
      }
  
      return res.status(200).send({
          'productList': myProductList,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
}

exports.hashProduct = async (req, res, next) => {
  try {
    const hashtagProductList = await db.Product.findAll({
      where: {
        hashtag: `#${req.params.hashtag}`,
      },
      order: [['updateDay', 'DESC']],
      include: [{
        model: db.Image,
      }]
    });

    if (!hashtagProductList) {
      return res.status(403).send('표시할 상품이 없습니다.');
    }

    return res.status(200).send({
        'productList': hashtagProductList,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

exports.productSearch = async (req, res, next) => {
  try {
    console.log(req.params.name);

    let query =`select * from products as a
              inner join images as b
              on a.id = b.productid
              where productName=:productName or
              category=:category 
              order by updateday desc
              `;
    
    let data = await db.sequelize.query(
      query,
      {
        replacements: {
          productName: req.params.name,
          category: req.params.name
        },
        type: db.Sequelize.QueryTypes.SELECT, 
        raw: true
      }
    )

    const dat = await db.Product.findAll({
      where: {
        category: req.params.name,
      }
    })

    console.log(data);
    console.log("------");
    console.log(dat);

    return res.status(200).send({
      "productList": data,
    })
  } catch (error) {
    console.log(error);
    next(error);
  }
}

exports.heartProduct = async (req, res, next) => {
  try {
    const heartProductList = await db.Heart.findAll({
      where: {
        UserId: req.user.id,
      },
      include: [{
        model: db.Product,
      }]
    });

    if(heartProductList.length == 0) {
      return res.status(403).send("찜한 상품이 없습니다");
    }

    var list = [];
    for (var i = 0; i <= heartProductList.length-1; i ++) {
      list[i] = await db.Product.findOne({
        where: {
          id: heartProductList[i].Product.id
        },
        include: [{
          model: db.Image,
        }]
      })
    }

    if (heartProductList.length == 0) {
      return res.status(403).send('찜한상품이 존재하지 않습니다.');
    }

    return res.status(200).send(list);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

exports.categoryList = async (req, res, next) => {
  try {
    const list = await db.Product.findAll({
      where: {
        category: req.params.category,
      },
      include: [{
        model: db.Image,
      }]
    });
  
    if (list === null) {
      return res.status(400).send('표시할 상품이 없습니다.');
    }
  
    return res.status(200).send({
      'list': list,
    }) 
  } catch (error) {
    console.log(error);
    next(error);
  }
}

exports.details = async(req, res, next) => {
  try {
    const detail = await db.Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [{
        model: db.Image,
      }]
    });

    console.log(detail);
    
    if (!detail) {
      return res.status(403).send('??');
    }

    return res.status(200).send({
      "product": detail,
    })
  } catch (error) {
    console.log(error);
    next(error);
  }
}

exports.middle = (req, res) => {
  db.Product.findAll({
    where: {
      UserId: req.user.id,
      state: "거래중"
    },
    include: [{
      model: db.Image,
    }]
  })
  .then(data => {
    return res.status(200).send(data);
  })
  .catch(err => {
    return res.status(403).send("에러");
  })
}

exports.final = async(req, res) => {
  db.Product.findAll({
    where: {
      UserId: req.user.id,
      state: "판매완료"
    },
    include: [{
      model: db.Image,
    }]
  })
  .then(data => {
    return res.status(200).send(data);
  })
  .catch(err => {
    return res.status(403).send("에러");
  })
}

exports.sellerProduct = async(req, res) => {
  try {
    let result = await db.Product.getSellerProduct(req.params.id);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({
      message: "서버 에러"
    })
  }
}