import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../Nav';
import { DropzoneArea } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      height: '100vh',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}));

function Product() {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        category: '',
    });
    
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleChange = event => {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
        setInput(input => ({
            ...input,
            category: event.target.value      
        }))
    };

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

    const [input, setInput] = useState({
      productName: '',
      description: '',
      price: '',
      hashtag: '',
      category: '',
    });
    const [images, setImages] = useState('');

    async function handleSumbit(e) {
        e.preventDefault();
        await axios.post("http://192.168.0.4:3065/api/product/", form, {
            headers: { 
                "token" : window.localStorage.getItem("token") || window.sessionStorage.getItem("token") 
            },
        })
        .then(res => {
            console.log(res);
            window.location.href = "/profile";
        })
    }

    useEffect(() => {
        const data = new FormData();
        data.append("productName", input.productName);
        data.append("description", input.description);
        data.append("price", input.price);
        data.append("hashtag", input.hashtag);
        data.append("category", input.category);
        for(var i = 0 ; i <= images.length ; i++) {
            data.append("image", images[i]);
        }
        setForm(data);
    }, [setForm, input, images]);

    return(
        <Fragment>
            <Nav/>
            <Grid item xs={12} sm={8} md={5} elevation={6} square style={{ margin: "auto" }}>
            <div className={classes.paper}>
            <Typography component="h1" variant="h5">
                상품등록
            </Typography>
            <form className={classes.form} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="상품이름"
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
                    label="가격"
                    onBlur={event => {setInput({...input, price: event.target.value})}}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="hashtag"
                    label="해시태그"
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
                    <MenuItem value={"굿즈"}>굿즈</MenuItem>
                    <MenuItem value={"뷰티"}>뷰티</MenuItem>
                    <MenuItem value={"학용품"}>학용품</MenuItem>
                    <MenuItem value={"기타"}>기타</MenuItem>
                    </Select>
                </FormControl>
                <DropzoneArea
                    onChange={imageHandleChange}
                />
                <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSumbit}
                >
                상품등록
                </Button>
                </form>
            </div>
        </Grid>
        </Fragment>
    )
}

export default Product;