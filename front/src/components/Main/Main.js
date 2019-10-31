import React, { useEffect, useState, Fragment } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Axios from '../../Axios/Axios';
import { Link } from 'react-router-dom';

import { fade, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MainCard from './MainCard';
import InputBase from '@material-ui/core/InputBase';

import SearchIcon from '@material-ui/icons/Search';
import defaultImg from '../../Assets/noImg.png';
import logoImg from '../../Assets/logo.png';
import snaillogo from '../../Assets/snaillogo.jpg'

const useStyles = makeStyles(theme => ({
    logo: {
        width: "60%",
        height: 150,
        margin: "0, auto",
    },
    logoTxt: {
        fontFamily: "Arial",
    },
    snaillogo: {
        width: "10%",
        height: 150,
        margin: "0, auto",
    },
    root: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        fontFamily: "배달의민족 주아",
    },
    banner: {
        display: "flex",
        justifyContent: "center"
    },
    carousel: {
        marginTop: 15,
        marginBottom: 40,
        width: "70%",
        height: 450,
    },
    bannerImg: {
        width: "100%",
        height: 400,
    },
    margin: {
        margin: "20px",
        width: 350,
        height: 380,
    },
    link: {
        cursor: "pointer",
        textDecoration: "none",
    },
    linkBtn: {
        margin: "0 5px",
        textDecoration: "none",
        color: "black",
        border: "none",
        background: "inherit",
        fontSize: 18,
        cursor: "pointer",
    },
    n: {
        width: "100%",
        fontFamily: "배달의민족 주아",
        fontSize: "20px",
    },
    bt: {
        borderTop: "1px solid #4c4c4c",
    },
    bb: {
        borderBottom: "1px solid #e8e8e8",
        width: "100%",
    },
    bbb: {
        margin: "0 auto",
        width: 1260,
        height: 42,
        display: "flex",
        justifyContent: "space-between",
    },
    nt: {
        lineHeight: "42px",
    },
    ntb: {
        border: "none",
        background: "inherit",
        textDecoration: "none",
        padding: "0 5px",
        color: "#323232",
        cursor: "pointer",
        fontSize: "16px",
        '&:hover': {
            color: "#aaa",
        }
    },
    nl: {
        margin: "0 auto",
        width: 1260,
        height: 50,
        fontSize: 18
    },
    lu: {
        listStyle: "none",
        display: "flex",
    },
    ul: {
        textDecoration: "none",
        color: "black",
        padding: "0 68px",
    },
    searchbox: {
        width: 264,
    },
    searche: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcone: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoote: {
        color: 'inherit',
    },
    inputInpute: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
}));

function Main() {
    const classes = useStyles();
    const [log] = useState(window.localStorage.getItem("token") === null && window.sessionStorage.getItem("token") === null);
    const [rendering, setRendering] = useState(false);
    const [products, setProducts] = useState([]);
    const [imagesPath, setImagesPath] = useState([]);

    async function getBanner() {
        let result = await Axios({
            url: "banner",
            method: "get",
        })
        setImagesPath(result.data.image);
    }

    async function getMainProduct() {
        let result = await Axios({
            url: 'api/product/main',
            method: 'get'
        })
        setProducts(result.data.productList);
    }

    function logout() {
        window.localStorage.clear();
        window.sessionStorage.clear();
        window.location.href = "/";
    }

    function search(e){
        if(e.keyCode === 13){
            window.location.href = "/search/" + e.target.value;
        }
    }

    useEffect(() => {
        getBanner();
        getMainProduct();
        setRendering(true);
    }, [setRendering]);

    return (
        rendering ?
            <Fragment>
                <div className={classes.n}>
                    <div className={classes.bb}>
                        <div className={classes.bbb}>
                            <div className={classes.nt}>
                                {log ? <Link to="/login" className={classes.ntb}>로그인</Link> : <button onClick={logout} className={classes.ntb}>로그아웃</button>}
                                {log ? <Link to="/register" className={classes.ntb}>회원가입</Link> : <Link to="/profile" className={classes.ntb}>프로필</Link>}
                            </div>
                            <div className={classes.searchbox}>
                                <div className={classes.searche}>
                                    <div className={classes.searchIcone}>
                                        <SearchIcon />
                                    </div>
                                    <InputBase
                                        placeholder="Search…"
                                        classes={{
                                            root: classes.inputRoote,
                                            input: classes.inputInpute,
                                        }}
                                        inputProps={{ 'aria-label': 'search' }}
                                        onKeyUp={search}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img className={classes.logo} src={logoImg} />
                        <img className={classes.snaillogo} src={snaillogo} />
                    </div>
                    <div className={classes.bt}>
                        <div className={classes.nl}>
                            <ul className={classes.lu}>
                                <li><Link to="/search/의류" className={classes.ul}>의류</Link></li>
                                <li><Link to="/search/전자기기" className={classes.ul}>전자기기</Link></li>
                                <li><Link to="/search/도서" className={classes.ul}>도서</Link></li>
                                <li><Link to="/search/굿즈" className={classes.ul}>굿즈</Link></li>
                                <li><Link to="/search/뷰티" className={classes.ul}>뷰티</Link></li>
                                <li><Link to="/search/학용품" className={classes.ul}>학용품</Link></li>
                                <li><Link to="/search/기타" className={classes.ul}>기타</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={classes.banner}>
                    <Carousel
                        className={classes.carousel}
                        showStatus={false}
                        showThumbs={false}
                        autoPlay={true}
                        infiniteLoop={true}
                    >
                        <div>
                            <img className={classes.bannerImg} src={imagesPath[0] === undefined ? defaultImg : "http://192.168.0.4:3065/" + imagesPath[0]} alt="banner" />
                        </div>
                        <div>
                            <img className={classes.bannerImg} src={imagesPath[1] === undefined ? defaultImg : "http://192.168.0.4:3065/" + imagesPath[1]} alt="banner" />
                        </div>
                    </Carousel>
                </div>
                <Typography variant="h4" align="center">최근 등록된 상품</Typography>
                <div className={classes.root}>
                    {products.map((item, key) => {
                        return <MainCard item={item} key={key} />
                    })}
                </div>
                <hr />
                <div style={{ display: "block" }}>
                    <div style={{ margin: "auto", width: "1000px", fontFamily: "배달의민족 주아", fontSize: "20px", fontWeight: "bold" }}>
                        <p>WDNA 대표이사 OOO  개인정보보호담당자 OOO  사업자등록정보 X  통신판매업신고 X</p>
                        <p>대구광역시 달성군 구지면 창리로11길 93 / TEL X</p>
                        <p>너울시장은 통신판매중개자로서 중고거래마켓 너울시장의 거래 당사자가 아니며, 입점판매가 등록한 상품정보 및 거래에 대해 책임을 지지 않습니다</p>
                        <p>Copyright ⓒ WeDoNotAnything Corp. All rights reserved.</p>
                    </div>
                </div>
            </Fragment>
            : <p></p>
    );
}

export default Main;