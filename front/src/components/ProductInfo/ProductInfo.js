import React, { Fragment, useState, useEffect } from 'react';
import Time from 'react-time-format';
import {
    Link
} from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';

import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';

import Nav from '../Nav';
import defaultImg from '../../Assets/noImg.png';
import { makeStyles, Typography } from '@material-ui/core';

const Axios = require("../../Axios/Axios");

const useStyles = makeStyles(theme => ({
    root: {
        width: "55%",
        height: 510,
    },
    fCard: {
        margin: "10px auto",
        width: "80%",
    },
    profile: {
        margin: "50px auto",
        width: "80%",
        height: "auto",
        display: "flex",
        justifyContent: "space-between",
    },
    carousel: {
        width: 480,
        height: 480,
    },
    bannerImg: {
        width: "100%",
        height: 480,
    },
    payBtn: {
        margin: "23px 20px",
        float: "right",
    },
    menu: {
        margin: "auto",
        width: "80%",
    },
    form: {
        width: "100%",
        display: "flex",
    },
    input: {
        width: "90%",
        margin: "10px",
    },
    button: {
        margin: "10px",
        width: "10%",
        boxSizing: "border-box",
    },
    comment: {
        width: "100%",
        borderBottom: "1px solid black",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
    },
    user: {
        width: "8%",
        fontWeight: "bold",
        marginRight: 10,
    },
    remove: {
        width: 24,
        float: "right",
    },
    removeBtn: {
        padding: 0,
    },
    favbtn: {
        margin: "20px",
    }
}))

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function ProductInfo({ match }) {
    const classes = useStyles();
    const [productInfo, setProductInfo] = useState({});
    const [imagePath, setImagePath] = useState([]);
    const [value, setValue] = useState(0);
    const [isHeartProduct, setIsHeartProduct] = useState(false);

    const [log] = useState(window.sessionStorage.getItem("token") !== null || window.localStorage.getItem("token") !== null)
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState([]);

    function getProductInfo() {
        Axios({
            url: "api/product/detail/" + match.params.id,
            method: "get",
            headers: { "token": window.localStorage.getItem("token") || window.sessionStorage.getItem("token") }
        })
            .then(result => {
                setProductInfo(result.data.product);
                setImagePath(result.data.product.Images);
            })
            .catch(() => {
                window.location.href = "/";
                alert("로그인이 필요합니다");
            })
    }

    async function getComments() {
        try {
            let result = await Axios({
                url: "api/comment/list/" + match.params.id,
                method: "get",
                headers: { "token": window.localStorage.getItem("token") || window.sessionStorage.getItem("token") }
            })
            setComments(result.data);
        } catch (err) {
            setComments([]);
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    async function submitComment() {
        await Axios({
            url: "api/comment/createComment/" + match.params.id,
            method: "post",
            headers: { "token": window.localStorage.getItem("token") || window.sessionStorage.getItem("token") },
            data: {
                content: newComment
            }
        })
        getComments();
    }

    async function getHeartProduct() {
        let result = await Axios({
            url: "api/product/heartProductList",
            method: "get",
            headers: { "token": window.localStorage.getItem("token") || window.sessionStorage.getItem("token") },
        });
        console.log(result);
        console.log(productInfo);
        result.data.map(item => {
            if (item.id === productInfo.id) {
                setIsHeartProduct(true);
                return true;
            }
            setIsHeartProduct(false);
            return false;
        })
    }

    async function remove(id) {
        try {
            let result = await Axios({
                url: "api/comment/deleteComment/" + id,
                method: "delete",
                headers: { "token": window.localStorage.getItem("token") || window.sessionStorage.getItem("token") }
            })
            console.log(result);
            getComments();
        } catch (err) {
            alert("자신의 댓글만 삭제할 수 있습니다.");
        }
    }

    const unFav = async () => {
        let result = await Axios({
            url: "api/heart/unclick/" + productInfo.id,
            method: "post",
            headers: { "token": window.localStorage.getItem("token") || window.sessionStorage.getItem("token") },
        })
        console.log(result);
        getHeartProduct();
        getProductInfo();
    }

    const fav = async () => {
        let result = await Axios({
            url: "api/heart/click/" + productInfo.id,
            method: "post",
            headers: { "token": window.localStorage.getItem("token") || window.sessionStorage.getItem("token") },
        })
        console.log(result);
        getHeartProduct();
        getProductInfo();
    }

    useEffect(() => {
        getProductInfo();
        getComments();
    }, [])

    useEffect(() => {
        getHeartProduct();
    }, [productInfo])
    return (
        <Fragment>
            <Nav />
            <Card className={classes.fCard}>
                <div className={classes.profile}>
                    <Carousel
                        className={classes.carousel}
                        showStatus={false}
                        showThumbs={false}
                        autoPlay={true}
                        infiniteLoop={true}
                    >
                        {imagePath.map((item, key) => {
                            return (
                                <div>
                                    <img className={classes.bannerImg} src={item.src === undefined ? defaultImg : "http://192.168.0.4:3065/" + item.src} alt="banner" />
                                </div>
                            )
                        })}
                    </Carousel>
                    <Paper className={classes.root}>
                        <Table size="medium" className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography variant="h4">{productInfo.productName}</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Typography variant="h6"><Time value={productInfo.updateDay} format="YYYY/MM/DD hh:mm" /></Typography></TableCell>
                                </TableRow>
                            </TableBody>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Typography variant="h6">{productInfo.price}원</Typography></TableCell>
                                </TableRow>
                            </TableBody>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Typography variant="h6">카테고리: <Link to={"/search/" + productInfo.category}>{productInfo.category}</Link></Typography></TableCell>
                                </TableRow>
                            </TableBody>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Typography variant="h6">태그: <Link to={"/hashtag/" + (String)(productInfo.hashtag).substring(1)}>{productInfo.hashtag}</Link></Typography></TableCell>
                                </TableRow>
                            </TableBody>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Typography variant="h6">상품상태: {productInfo.state}</Typography></TableCell>
                                </TableRow>
                            </TableBody>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Typography variant="h6">판매자: <Link to={"/sellerProfile/" + productInfo.UserId}>{productInfo.UserId}</Link></Typography></TableCell>
                                </TableRow>
                            </TableBody>
                            <TableBody>
                                <TableRow>
                                    {isHeartProduct ?
                                        <IconButton onClick={unFav} className={classes.favbtn}>
                                            <FavoriteIcon />
                                        </IconButton>
                                        :
                                        <IconButton onClick={fav} className={classes.favbtn}>
                                            <FavoriteBorderIcon />
                                        </IconButton>
                                    }{productInfo.heart}개
                                    <Button variant="contained" size="large" color="primary" className={classes.payBtn}>
                                        구매하기
                                                </Button>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            </Card>
            <Paper square className={classes.menu}>
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="상세 정보" {...a11yProps(0)} />
                    <Tab label="댓글" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    {productInfo.description}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div className={classes.form}>
                        <Input
                            defaultValue=""
                            placeholder="댓글 입력"
                            className={classes.input}
                            onBlur={e => {
                                setNewComment(e.target.value);
                            }}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                        />
                        <Button variant="contained" color="primary" onClick={submitComment} className={classes.button}>
                            전송
                                    </Button>
                    </div>
                    <hr />
                    <div>
                        {comments.map(item => {
                            return (
                                <div className={classes.comment}>
                                    <div className={classes.user}>
                                        <span>{item.UserId}</span>
                                    </div>
                                    <div className={classes.text}>
                                        <span>{item.content}</span>
                                    </div>
                                    <div className={classes.remove}>
                                        <IconButton onClick={e => remove(item.id)} className={classes.removeBtn}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </TabPanel>
            </Paper>
        </Fragment>
    )

}

export default ProductInfo;