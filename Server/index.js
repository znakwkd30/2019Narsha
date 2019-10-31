const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const db = require('./models');
const userAPIRouter = require('./routes/user/user');
const productAPIRouter = require('./routes/product/product');
const commentAPIRouter = require('./routes/comment/comment');
const hashtagAPIRouter = require('./routes/hashtag/hashtag');
const heartAPIRouter = require('./routes/heart/heart');
const reportAPIRouter = require('./routes/report/report');
const adminAPIRouter = require('./routes/admin/admin');
const categoryAPIRouter = require('./routes/category/category');

const app = express();
db.sequelize.sync({
    logging: false
});

app.use(express.static('public'));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userAPIRouter);
app.use('/api/product', productAPIRouter);
app.use('/api/comment', commentAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);
app.use('/api/heart', heartAPIRouter);
app.use('/api/report', reportAPIRouter);
app.use('/api/admin', adminAPIRouter);
app.use('/api/category', categoryAPIRouter);

app.get('/banner', (req, res) => {
    let img = [
        "img1.png",
        "img2.png",
    ]

    return res.status(200).send({
        "image": img
    })
});

app.listen(3065, () => {
    console.log('서버 구동 3065PORT');
});