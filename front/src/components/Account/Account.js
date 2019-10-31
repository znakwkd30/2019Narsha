import React, { Fragment, useState } from 'react';
import Nav from '../Nav';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const Axios = require('../../Axios/Axios');

const useStyles = makeStyles(theme => ({
    root: {
      height: '100vh',
    },
    image: {
      backgroundImage: 'url(https://source.unsplash.com/random)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
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

function Account() {
  const classes = useStyles();

  const [input, setInput] = useState({
    id: '',
    name: '',
    pw: '',
    email: '',
    phone: '',
    school: '',
  })

  async function handleSumbit(e) {
    e.preventDefault();
    let result = await Axios({
      url: 'api/user/',
      method: 'post',
      data: {
        id: input.id,
        name: input.name,
        password: input.pw,
        email: input.email,
        phoneNumber: input.phone,
        schoolName: input.school,
      }
    })
    if(result.status !== 200) {
      alert("요구조건을 만족하지 못했습니다.");
    } else {
      window.location.href = "/login"
    }
  }

  return (
    <Fragment>
      <Nav/>
      <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            회원가입
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="ID"
                name="id"
                autoComplete="id"
                autoFocus
                onBlur={event => {setInput({...input, id: event.target.value})}}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                autoFocus
                onBlur={event => {setInput({...input, name: event.target.value})}}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Password"
                label="Password"
                type="password"
                onBlur={event => {setInput({...input, pw: event.target.value})}}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Email"
                label="Email Address"
                name="email"
                type="email"
                autoFocus
                onBlur={event => {setInput({...input, email: event.target.value})}}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Phone"
                name="phoneNumber"
                autoFocus
                onBlur={event => {setInput({...input, phone: event.target.value})}}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="School"
                name="SchoolName"
                autoFocus
                onBlur={event => {setInput({...input, school: event.target.value})}}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSumbit}
            >
              회원가입
            </Button>
            </form>
        </div>
      </Grid>
    </Grid>
  </Fragment>
  );
}

export default Account;