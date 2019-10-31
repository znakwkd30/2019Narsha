import React, { Fragment, useState } from 'react';
import Axios from '../../Axios/Axios';
import { makeStyles } from '@material-ui/core/styles';
import Time from 'react-time-format';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Nav from '../Nav';
import { Link } from 'react-router-dom';
import defaultImg from '../../Assets/noImg.png';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
        height: 380,
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
    },
    button: {
        margin: "20px 40px",
        width: 125,
        padding: "6px 16px",
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Seller(match) {
    const classes = useStyles();

    const [log] = React.useState(window.localStorage.getItem("token") === null && window.sessionStorage.getItem("token") === null);
    const [id] = React.useState(match.match.params.id === window.sessionStorage.getItem("id") || window.localStorage.getItem("id"));
    const [userInfo, setUserInfo] = React.useState([]);
    const [userImg, setUserImg] = React.useState();
    const [products, setProducts] = useState([]);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                <Box p={3}>{children}</Box>
            </Typography>
        );
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    async function myProduct() {
        let result;
        result = await Axios({
            url: 'api/product/sellerProduct/' + match.match.params.id,
            headers: { "token": window.localStorage.getItem("token") || window.sessionStorage.getItem("token") },
            method: 'get'
        })

        setProducts(result.data);
    }

    async function getProfile() {
        let result = await Axios({
            url: "api/user/sellerInfo/" + match.match.params.id,
            headers: { "token": window.sessionStorage.getItem("token") || window.localStorage.getItem("token") },
        });
        console.log(result);
        setUserInfo(result.data);
        setUserImg(result.data.ProfileImages[0].src);
    }

    React.useEffect(() => {
        getProfile();
        myProduct();
    }, []);

    if (log) {
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = "/login";
    } else if(id){
        window.location.href = "/profile";
    } else {
        return (
            <Fragment>
                <Nav />
                <Card className={classes.card}>
                    <div className={classes.main}>
                        <Avatar alt="profileImg" src={userInfo.ProfileImages === null ? "../Profile/noneImg.png" : "http://192.168.0.4:3065/\\" + userImg} className={classes.avatar} />
                        <Typography variant="h3" align="center" className={classes.Typography}>
                            {userInfo.name}
                        </Typography>
                    </div>
                </Card>
                <Tabs
                    value={value}
                    className={classes.myproduct}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                    aria-label="disabled tabs example"
                >
                    <Tab label={userInfo.name + "님의 상품"} {...a11yProps(0)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <div className={classes.root} style={{ width: "80%", margin: "auto" }}>
                        {products.map((item, key) => {
                            return (
                                <Card className={classes.itemCard} key={key}>
                                    <CardHeader
                                        title={<Link to={"/productinfo/" + item.id} className={classes.link}>{item.productName}</Link>}
                                        subheader={<Time value={item.updateDay} format="YYYY/MM/DD hh:mm" />}
                                    />
                                    <img src={item.Images.length === 0 ? defaultImg : "http://192.168.0.4:3065/" + item.Images[0].src} style={{ width: 350, height: 200 }} alt={item.productName}></img>
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" component="p"
                                            style={{ fontSize: "24px", fontFamily: "궁서체" }}>
                                            {item.price}원
                                    </Typography>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </TabPanel>
            </Fragment>
        )
    }
}

export default Seller;