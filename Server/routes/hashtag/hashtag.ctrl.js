const db = require('../../models');

exports.tagList = async (req, res, next) => {
    try {
        const tagList = await db.Hashtag.findAll();

        if (!tagList) {
            return res.status(403).send('표시할 해시태그가 없습니다.');
        }

        console.log(tagList);
        return res.status(200).json(tagList);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.tagSearch = async (req, res, next) => {
    db.Hashtag.findOrCreate({
        where: {
            name: req.body.hashtag,
        },
    })
    .then(data => {
        db.Product.findAll({
            where: {
                hashtag: req.body.hashtag,
            },
        })
        .then(data => {
            console.log(data);
            if (data.length == 0) {
                return res.status(403).send('표시할 상품이 없습니다.');
            } else {
                return res.status(200).send({
                    'productList': data,
                });
            }
        })
    })
    .catch(err => {
        console.log(err);
        next(err);
    })
}