const db = require('../../models');

exports.create = async (req, res, next) => {
    try {
        const comment = await db.Comment.create({
            UserId: req.user.id,
            content: req.body.content,
            ProductId: req.params.id,
        });

        if (!comment) {
            return res.status(403).send('댓글을 달지 못했습니다.');
        }

        console.log(comment);
        return res.status(200).json({
            "userId": comment.id,
            "ProductId": comment.ProductId,
            "content": comment.content,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.list = async (req, res, next) => {
    try {
        const list = await db.Comment.findAll({
            where: {
                ProductId: req.params.id,
            }
        });

        if (list.length === 0) {
            return res.status(403).send('표시할 댓글이 없습니다.');
        } else {
            return res.status(200).json(list);
        }
    } catch (error) {
        console.log(err);
        next(err);
    }
}

exports.delete = async (req, res, next) => {
    try {
        const existComment = await db.Comment.findOne({
            where: {
                UserId: req.user.id,
                id: req.params.id,
            },
        });

        if (!existComment) {
            return res.status(403).send('존재하지 않는 댓글입니다.');
        } else {
            await db.Comment.destroy({
                where: {
                    UserId: req.user.id,
                    id: req.params.id,
                }
            })
            .then(result => {
                console.log(`댓글 삭제완료.${result}`);
                return res.status(200).send('댓글을 삭제하였습니다.');
            })
            .catch(err => {
                console.log(err);
                return res.status(403).send('댓글삭제 도중 오류발생.');
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}