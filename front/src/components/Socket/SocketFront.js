import React, { Fragment, useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Nav from '../Nav';
import io from 'socket.io-client';
import axios from 'axios';
import { baseUri } from '../../config/dbUri';
import { makeStyles } from '@material-ui/styles';

// import "http://code.jquery.com/jquery-1.10.1.min.js";
// import "/socket.io/socket.io.js";
const useStyles = makeStyles(theme => ({
    root: {
        height: '93vh',
        display: 'flex'
    },
    form: {
        width: '100%',
        alignSelf: 'flex-end'
    },
}));
const socket = io.connect("http://192.168.0.4:3001");

const SocketClient = () => {
    const classes = useStyles();
    const [user, setUser] = useState({});
    const [content, setContent] = useState();

    const getUser = useCallback(async () => {
        let res = await axios.get(`${baseUri}api/user/userInfo`, {
                    headers: {
                        "token" : window.localStorage.getItem("token") || window.sessionStorage.getItem("token")
                    },
                });
        console.log(res.data.data);
        setUser(res.data.data);
    }, []);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        send();
    }
    
    const handleEnter = (e) => {
        e.preventDefault();
        if (window.event.keyCode === 13) {
            send();
        }
    }
    
    const ready = useCallback(() => {
        console.log(user.name);

        socket.emit("login", {
            name: user.name,
            userid: user.email,
        });
        // socket.on('disconnect');
    }, [user]);    
    
    socket.on('reveiveMessage', (data) => {
        
    });

    const send = () => {
        if(content.length < 1) {
            alert("내용을 입력해주세요");
            return;
        }

        socket.emit('sendMessage', { message: content });
    }

    useEffect(() => {
        getUser();
    }, [])

    
    useEffect(() => {
        ready();
    }, [user])

    // if(window.localStorage.getItem("token") === null && window.sessionStorage.getItem("token") === null) {
        return (
            <Fragment>
                <Nav/>
                <div className={classes.root}>
                    {/* <div>
                        <ul></ul>
                    </div> */}
                    <form className={classes.form}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="content"
                        label="내용"
                        name="content"
                        autoFocus
                        onKeyUp={handleEnter}
                        onBlur={event => {setContent({...content, content: event.target.value})}}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                    >
                        전송
                    </Button>
                    </form>
                </div>
            </Fragment>
        );
    // } else {
    //     alert("로그인이 필요한 서비스입니다.");
    // }
        
}

export default SocketClient;
