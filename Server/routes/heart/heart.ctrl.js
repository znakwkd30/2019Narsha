const db = require('../../models');

exports.click = async (req, res, next) => {
    try {
        const heart = await db.Heart.findOrCreate({
            where: {
                ProductId: req.params.id,
                UserId: req.user.id
            },
        });

        // console.log(`IsNewRecord: ${heart[0]._options.isNewRecord}`);

        if (!heart[0]._options.isNewRecord) {
            return res.status(403).send('찜하지못했습니다.');   
        } else {
            const productHeart = await db.Heart.findAndCountAll({
                where: {
                    ProductId: req.params.id,
                },
            });

            const updateHeart = await db.Product.update(
                {
                    heart: productHeart.count,
                },
                {
                    where: {
                        id: req.params.id,
                    },
                },
            );
        }

        // console.log(updateHeart);
        return res.status(200).send('상품을 찜하였습니다.');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.unClick = async (req, res, next) => {
    try {
        const destroyHeart = await db.Heart.destroy({
            where: {
                ProductId: req.params.id,
                UserId: req.user.id,
            },
        })
        .then(async data => {
            const productHeart = await db.Heart.findAndCountAll({
                where: {
                    ProductId: req.params.id,
                },
            });

            await db.Product.update(
                {
                    heart: productHeart.count,
                },
                {
                    where: {
                        id: req.params.id,
                    },
                },
            );
        })

        console.log(destroyHeart);
        return res.status(200).send('찜한 상품을 삭제했습니다.');
    } catch (error) {
        console.log(error);
        next(error);
    }
}