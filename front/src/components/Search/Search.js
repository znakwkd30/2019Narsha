import React, { useEffect, useState, Fragment } from 'react';
import Time from 'react-time-format';
import Nav from '../Nav';
import Axios from '../../Axios/Axios';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    card: {
        margin: "20px",
        maxWidth: 300,
        // height: 350,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    link: {
        cursor: "pointer",
        textDecoration: "none",
    },
    }));

function Search({match}){
    const classes = useStyles();

    const [products, setProducts] = useState([]);
    async function searchProduct() {
        if (match.params.name) {
            Axios({
                url: 'api/product/searchProduct/' + match.params.name,
                headers: {"token" : window.localStorage.getItem("token") || window.sessionStorage.getItem("token")},
                method: 'get'
            })
            .then(result => {
                console.log(result);
                setProducts(result.data.productList);            
            })
        } else if (match.params.hashtag) {
            Axios({
                url: 'api/product/hashtagProduct/' + match.params.hashtag,
                headers: {"token" : window.localStorage.getItem("token") || window.sessionStorage.getItem("token")},
                method: 'get'
            })
            .then(result => {
                console.log(result.data);
                setProducts(result.data.productList);            
            })
        }
    }

    useEffect(() => {
        searchProduct();
    }, []);

    return(
        <Fragment>
            <Nav/>
            <div className={classes.root} style={{ width: "80%", margin: "auto" }}> 
                {products.map((item, key) => {
                    return (
                        <Link to={ `/productinfo/${ item.ProductId }` } className={classes.link}>
                        <Card className={classes.card} key={key}>
                            <CardHeader
                                title={item.productName}
                                subheader={<Time value={item.updateDay} format="YYYY/MM/DD hh:mm" />}
                            />
                            {/* <img src={item.Images.length === 0 ? defaultImg : "http://10.80.163.141:3065/" + item.Images[0].src} style={{ width: 350, height: 200 }}></img> */}
                            <img alt="file" src={"http://192.168.0.4:3065/" + item.src} style={{ width: 350, height: 200 }}></img>
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p"
                                    style={{ fontSize: "24px", fontFamily: "궁서체" }}>
                                    {item.price}원
                                </Typography>
                            </CardContent>
                        </Card>
                        </Link>
                    )
                })}
            </div>
        </Fragment>
    )
}

export default Search;