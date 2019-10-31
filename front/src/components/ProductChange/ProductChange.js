import React, { Fragment, useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { DropzoneArea } from 'material-ui-dropzone';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Nav from '../Nav';
import defaultImg from '../../Assets/noImg.png';
import { makeStyles } from '@material-ui/core';

const Axios = require("../../Axios/Axios");

const useStyles = makeStyles(theme => ({
    root: {
        width: "55%",
        height: 700,
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
        height: 700,
    },
    payBtn: {
        margin: "23px 20px",
        float: "right",
    },
    menu: {
        margin: "auto",
        width: "80%",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}))

function ProductChange({ match }) {

    const handleChange = event => {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
        setInput(input => ({
            ...input,
            category: event.target.value      
        }));
    };

    const stateChange = event => {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
        setInput(input => ({
            ...input,
            state: event.target.value,
        }));
    }

    const imageHandleChange = event => {
        let item = [];
        console.log(event);
        for(var i = 0; i <= event.length+1 ; i++) {
            item[i] = event;
            setImages(item[i]);
        }
        console.log(images);
    }


    const [form, setForm] = useState(new FormData());

    async function handleSumbit(e) {
        e.preventDefault();
        await axios.patch("http://192.168.0.4:3065/api/product/updateProduct/" + match.params.id, form, {
            headers: { 
                "token" : window.localStorage.getItem("token") || window.sessionStorage.getItem("token") 
            },
        })
        .then(res => {
            console.log(res);
            window.location.href="/profile";
        })
    }
    const [input, setInput] = useState({
      productName: '',
      description: '',
      price: '',
      hashtag: '',
      category: '',
      state: '',
    });

    const [images, setImages] = useState('');

    const inputLabel = React.useRef(null);
    const [values, setValues] = React.useState({
        category: '',
    });
    const [labelWidth] = React.useState(0);
    const classes = useStyles();
    const [productInfo, setProductInfo] = useState([]);
    const [imagePath, setImagePath] = useState([]);

    async function getProductInfo() {
        let result = await Axios({
            url: "api/product/detail/" + match.params.id,
            method: "get",
            headers: { "token": window.localStorage.getItem("token") || window.sessionStorage.getItem("token") }
        });
        setProductInfo(result.data.product);
        setImagePath(result.data.product.Images);
        setImages(result.data.product.Images);
        setInput(result.data.product);
        console.log(images);
    }

    useEffect(() => {
        const data = new FormData();
        data.append("productName", input.productName);
        data.append("description", input.description);
        data.append("price", input.price);
        data.append("hashtag", input.hashtag);
        data.append("category", input.category);
        data.append("state", input.state)
        for(var i = 0 ; i <= images.length ; i++) {
            data.append("image", images[i]);
        }
        setForm(data);
    }, [setForm, input, images]);

    useEffect(() => {
        getProductInfo();
    }, []);

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
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                placeholder={productInfo.productName}
                                label="변경할 상품이름"
                                name="productName"
                                autoFocus
                                onBlur={event => {setInput({...input, productName: event.target.value})}}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="상세설명"
                                placeholder={productInfo.description}
                                name="description"
                                autoFocus
                                onBlur={event => {setInput({...input, description: event.target.value})}}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="price"
                                label="변경할 상품가격"
                                placeholder={productInfo.price}
                                onBlur={event => {setInput({...input, price: event.target.value})}}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="hashtag"
                                placeholder={productInfo.hashtag}
                                label="변경할 해시태그"
                                name="hashtag"
                                autoFocus
                                onBlur={event => {setInput({...input, hashtag: event.target.value})}}
                            />
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
                                    카테고리
                                </InputLabel>
                                <Select
                                value={values.category}
                                onChange={handleChange}
                                labelWidth={labelWidth}
                                inputProps={{
                                    name: 'category',
                                    id: 'outlined-age-simple',
                                }}
                                >
                                <MenuItem value={"의류"}>의류</MenuItem>
                                <MenuItem value={"전자기기"}>전자기기</MenuItem>
                                <MenuItem value={"도서"}>도서</MenuItem>
                                <MenuItem value={"스타굿즈"}>굿즈</MenuItem>
                                <MenuItem value={"뷰티"}>뷰티</MenuItem>
                                <MenuItem value={"나눔"}>나눔</MenuItem>
                                <MenuItem value={"기타"}>기타</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
                                    상품상태
                                </InputLabel>
                                <Select
                                value={values.state}
                                onChange={stateChange}
                                labelWidth={labelWidth}
                                inputProps={{
                                    name: 'state',
                                    id: 'outlined-age-simple',
                                }}
                                >
                                <MenuItem value={"구매가능"}>구매가능</MenuItem>
                                <MenuItem value={"거래중"}>거래중</MenuItem>
                                <MenuItem value={"판매완료"}>판매완료</MenuItem>
                                </Select>
                            </FormControl>
                            <DropzoneArea
                                onChange={imageHandleChange}
                            />         
                            <Button variant="contained" size="large" onClick={handleSumbit} color="primary" className={classes.payBtn}>
                                수정하기
                            </Button>
                        </Table>
                    </Paper>
                </div>
            </Card>
        </Fragment>
    )
}

export default ProductChange;