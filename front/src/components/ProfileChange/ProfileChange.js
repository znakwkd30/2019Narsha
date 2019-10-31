import React, { Fragment, useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { DropzoneArea } from 'material-ui-dropzone';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Nav from '../Nav';
import { makeStyles } from '@material-ui/core';

const Axios = require("../../Axios/Axios");

const useStyles = makeStyles(theme => ({
    root: {
        width: "55%",
        height: 600,
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

function ProfileChange({ match }) {

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
        await axios.patch("http://192.168.0.4:3065/api/user/totalUpdate", form, {
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
      email: '',
      phoneNumber: '',
      schoolName: '',
    });

    const [images, setImages] = useState('');

    const classes = useStyles();
    const [userInfo, setUserInfo] = React.useState([]);
    const [userImg, setUserImg] = React.useState();

    async function getProfile() {
        let result = await Axios({
            url: "api/user/userinfo",
            headers: { "token": window.sessionStorage.getItem("token") || window.localStorage.getItem("token") },
        });

        setUserInfo(result.data.data);
        setUserImg(result.data.data.ProfileImages[0].src);
        setInput(result.data.data);
    }

    useEffect(() => {
        const data = new FormData();
        data.append("email", input.email);
        data.append("schoolName", input.schoolName);
        data.append("phoneNumber", input.phoneNumber);
        for(var i = 0 ; i <= images.length ; i++) {
            data.append("image", images[i]);
        }
        setForm(data);
    }, [setForm, input, images]);

    useEffect(() => {
        getProfile();
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
                    <div>
                        <img alt="profileImg" src={userInfo.ProfileImages === null ? "../Profile/noneImg.png" : "http://192.168.0.4:3065/\\" + userImg} className={classes.avatar} />
                    </div>
                    </Carousel>
                    <Paper className={classes.root}>
                        <Table size="medium" className={classes.table} aria-label="simple table">
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                placeholder={userInfo.email}
                                label="변경할 이메일"
                                name="email"
                                autoFocus
                                onBlur={event => {setInput({...input, email: event.target.value})}}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                placeholder={userInfo.phoneNumber}
                                label="변경할 전화번호"
                                name="phoneNumber"
                                autoFocus
                                onBlur={event => {setInput({...input, phoneNumber: event.target.value})}}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                placeholder={userInfo.schoolName}
                                label="변경할 학교이름"
                                name="schoolName"
                                autoFocus
                                onBlur={event => {setInput({...input, schoolName: event.target.value})}}
                            />
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

export default ProfileChange;