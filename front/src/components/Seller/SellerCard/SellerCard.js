import React from 'react';
import { Link } from 'react-router-dom';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Time from 'react-time-format';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    card: {
        margin: "20px auto",
        width: "60%",
    },
    itemCard: {
        margin: "20px",
        width: 350,
        height: 420,
    },
    main: {
        margin: "60px auto 20px",
        width: "200px",
    },
    anpmvatar: {
        margin: 10,
        width: 130,
        height: 130,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        margin: "0 auto",
        width: "200px",
        height: "200px",
    },
    Typography: {
        margin: "20px 0 0 0",
    },
    myproduct: {
        width: "60%",
        margin: "0 auto",
    },
    link: {
        cursor: "pointer",
        textDecoration: "none",
        fontSize: "18px"
    },
    profileIcon: {
        alignItems: "right"
    }
}));

const SellerCard = ({ item }) => {
    const classes = useStyles();
    return (
        <Card className={classes.itemCard}>
            <CardHeader
                title={<Link to={"/productinfo/" + item.id} className={classes.link}>{item.productName}</Link>}
                subheader={<Time value={item.updateDay} format="YYYY/MM/DD hh:mm" />}
            />
            {/* <img src={item.Images.length === 0 ? defaultImg : "http://10.80.163.141:3065/" + item.Images[0].src} style={{ width: 350, height: 200 }} alt={item.productName}></img> */}
            <img alt="file" src={"http://192.168.0.4:3065/" + item.Images[0].src} style={{ width: 350, height: 200 }}></img>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p"
                    style={{ fontSize: "24px", fontFamily: "궁서체" }}>
                    {item.price}원
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SellerCard;
