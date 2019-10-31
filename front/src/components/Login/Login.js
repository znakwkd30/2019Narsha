import React, { Fragment, useState } from 'react';
import Nav from '../Nav';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
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

function Login() {
  const classes = useStyles();

  const [input, setInput] = useState({
    id: '',
    pw: '',
  })
  const [remember, setRemember] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    let result = await Axios({
      url: 'api/user/login',
      method: 'post',
      data: {
        id: input.id,
        password: input.pw,
      }
    })
    if(result.status !== 200) {
      alert("아아디 또는 비밀번호를 확인해 주세요.");
    } else {
      if(remember) {
        window.sessionStorage.clear();
        window.localStorage.setItem("id", result.data.data.user.id);
        window.localStorage.setItem('token', result.data.data.token.token);
        window.sessionStorage.setItem("id", result.data.data.user.id);
        window.sessionStorage.setItem('token', result.data.data.token.token);
        window.location.href = "/";
      } else {
        window.localStorage.clear();
        window.sessionStorage.setItem("id", result.data.data.user.id);
        window.sessionStorage.setItem('token', result.data.data.token.token);
        window.location.href = "/";
      }
    }
  }

  if(window.localStorage.getItem("token") === null && window.sessionStorage.getItem("token") === null) {
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
              로그인
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="id"
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
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  style={{"fontFamily" : "Arial!import"}}
                  autoComplete="current-password"
                  onBlur={event => {setInput({...input, pw: event.target.value})}}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                checked={remember}
                onChange={e => {setRemember(!remember)}}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
              >
                로그인
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
      </Fragment>
    );
  }else{
    console.log("hi");
    window.location.href = "/";
  }
}

export default Login;