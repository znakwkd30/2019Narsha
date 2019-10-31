import React from 'react';
import {
    Link
} from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/Styles';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ForumIcon from '@material-ui/icons/Forum';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert'
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    titleTxt: {
        fontFamily: 'Arial',
        fontSize: "20px",
        color: "white",
        fontWeight: "bold",
        textDecoration: "none",
    },
    search: {
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
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    drawerLink: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        textDecoration: "none",
        color: "black",
    }
}));

const Nav = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [log] = React.useState(window.localStorage.getItem("token") === null && window.sessionStorage.getItem("token") === null);
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleProfile = () => {
        if (log) {
            alert("로그인이 필요한 서비스입니다.");
        } else {
            window.location.href = "/profile/" + window.sessionStorage.getItem("id");
        }
    }

    const handleLogin = () => {
        window.location.href = "/login";
    }

    const handleLogout = () => {
        window.localStorage.clear();
        window.sessionStorage.clear();
        window.location.href = "/";
    }

    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleSearch = event => {
        if (window.event.keyCode === 13) {
            window.location.href = "/search/" + event.target.value;
        }
    };

    const handleReport = () => {
        window.location.href = "/reportList";
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleProfile}>프로필</MenuItem>
            <MenuItem onClick={log ? handleLogin : handleLogout}>{log ? <span>로그인</span> : <span>로그아웃</span> }</MenuItem>
            <MenuItem onClick={handleReport}>신고하기</MenuItem>
        </Menu>
    );

    const toggleDrawer = (side, open) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const mobileMenuId = 'primary-search-account-menu-mobile';

    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <ForumIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem onClick={log ? handleLogin : handleLogout}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                {log ? <span>Login</span> : <span>Logout</span>}
            </MenuItem>
        </Menu>
    )

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                <ListItem button>
                    <Link to="/search/의류" className={classes.drawerLink}>
                        <ListItemIcon><img src="https://img.icons8.com/ios-filled/30/000000/tailoring-for-women.png" alt="file"/></ListItemIcon>
                        <ListItemText primary="의류" />
                    </Link>
                </ListItem>
                <ListItem button>
                    <Link to="/search/전자기기" className={classes.drawerLink}>
                        <ListItemIcon><img src="https://img.icons8.com/pastel-glyph/30/000000/iphone-x--v1.png" alt="file"/></ListItemIcon>
                        <ListItemText primary="전자기기" />
                    </Link>
                </ListItem>
                <ListItem button>
                    <Link to="/search/도서" className={classes.drawerLink}>
                        <ListItemIcon><img src="https://img.icons8.com/ios-filled/30/000000/book.png" alt="file"/></ListItemIcon>
                        <ListItemText primary="도서" />
                    </Link>
                </ListItem>
                <ListItem button>
                    <Link to="/search/굿즈" className={classes.drawerLink}>
                        <ListItemIcon><img src="https://img.icons8.com/ios-filled/30/000000/fantasy.png" alt="file"/></ListItemIcon>
                        <ListItemText primary="굿즈" />
                    </Link>
                </ListItem>
                <ListItem button>
                    <Link to="/search/뷰티" className={classes.drawerLink}>
                        <ListItemIcon><img src="https://img.icons8.com/metro/30/000000/beeswax.png" alt="file"/></ListItemIcon>
                        <ListItemText primary="뷰티" />
                    </Link>
                </ListItem>
                <ListItem button>
                    <Link to="/search/나눔" className={classes.drawerLink}>
                        <ListItemIcon><img src="https://img.icons8.com/ios-filled/30/000000/gift.png" alt="file"/></ListItemIcon>
                        <ListItemText primary="나눔" />
                    </Link>
                </ListItem>
                <ListItem button>
                    <Link to="/search/기타" className={classes.drawerLink}>
                        <ListItemIcon><img src="https://img.icons8.com/ios-glyphs/30/000000/more.png" alt="file"/></ListItemIcon>
                        <ListItemText primary="기타" />
                    </Link>
                </ListItem>
            </List>
        </div>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer("left", true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <SwipeableDrawer
                        open={state.left}
                        onClose={toggleDrawer('left', false)}
                        onOpen={toggleDrawer('left', true)}
                    >
                        {sideList('left')}
                    </SwipeableDrawer>
                    <Typography className={classes.title} variant="h6" noWrap>
                        <Link to="/" className={classes.titleTxt}>凝安該</Link>
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon
                            />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyUp={handleSearch}
                        />
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <ForumIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}

export default withRouter(Nav);
