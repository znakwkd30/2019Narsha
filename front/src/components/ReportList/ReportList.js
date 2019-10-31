import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import Nav from '../Nav';
import Axios from '../../Axios/Axios';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(3, 2),
      marginTop: 20
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
    payBtn: {
        margin: "23px 20px",
        float: "right",
    },
    mainText: {
        display: "flex",
        justifyContent: "center"
    },
}));

const ReportList = () => {
    const classes = useStyles('');
    const [list, setList] = useState([]);

    const handleClick = () => {
        alert("준비중입니다.");
    }

    const handleBtnClick = () => {
        window.location.href = "/report";
    }

    const reportData = () => {
        Axios({
            url: "api/report/myReportList",
            method: "get",
            headers: { "token": window.localStorage.getItem("token") || window.sessionStorage.getItem("token") }
        })
        .then(result => {
            console.log(result);
            setList(result.data);
        })
    }

    useEffect(() => {
        reportData();
    }, [])

    return (
        <Fragment>
            <Nav/>
            <Paper>
                <div>
                    <h1 className={classes.mainText}>신고목록</h1>
                    <Button variant="contained" color="primary" className={classes.payBtn} onClick={handleBtnClick}>신고하기</Button>
                </div>
                <div>
                    {list.map(item => {
                        return (
                            <div className={classes.comment}>
                                <div className={classes.user}>
                                    <span><Link onClick={handleClick}>{item.title}</Link></span>
                                </div>
                                <div>
                                    <span>{item.state}</span>
                                </div>
                            </div>
                        )
                    })}   
                </div>
            </Paper>
        </Fragment>
    )
}

export default ReportList;