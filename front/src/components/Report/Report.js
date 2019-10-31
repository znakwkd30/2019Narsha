import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../Nav';
import { DropzoneArea } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      height: '100vh',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}));

function Report() {
    const classes = useStyles();
    
    const imageHandleChange = event => {
        let item = [];
        console.log(event);
        for(var i = 0; i <= event.length+1 ; i++) {
            item[i] = event;
            setFiles(item[i]);
        }
    }
    
    const [form, setForm] = useState(new FormData());
    const [input, setInput] = useState({ content: '', title: '' });
    const [files, setFiles] = useState('');

    function handleSumbit(e) {
        e.preventDefault();
        axios.post("http://192.168.0.4:3065/api/report/reportUser", form, {
            headers: { 
                "token" : window.localStorage.getItem("token") || window.sessionStorage.getItem("token") 
            },
        })
        .then(res => {
            console.log(res);
            window.location.href = "/reportList";
        })
    }

    useEffect(() => {
        const data = new FormData();
        data.append("title", input.title);
        data.append("content", input.content);
        for(var i = 0 ; i <= files.length ; i++) {
            data.append("file", files[i]);
        }
        setForm(data);
    }, [setForm, input, files]);

    return(
        <Fragment>
            <Nav/>
            <Grid item xs={12} sm={8} md={5} elevation={6} square style={{ margin: "auto" }}>
            <div className={classes.paper}>
            <Typography component="h1" variant="h5">
                신고하기
            </Typography>
            <form className={classes.form} noValidate>
                <TextField 
                    margin="normal"
                    required
                    fullWidth
                    label="제목"
                    name="title"
                    autoFocus
                    onBlur={event => {setInput({...input, title: event.target.value})}}
                />
                <TextField 
                    margin="normal"
                    required
                    fullWidth
                    multiline
                    rows="6"
                    label="내용"
                    name="content"
                    autoFocus
                    onBlur={event => {setInput({...input, content: event.target.value})}}
                />
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
                    신고하기
                </Button>
                </form>
            </div>
        </Grid>
        </Fragment>
    )
}

export default Report;