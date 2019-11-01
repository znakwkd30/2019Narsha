import React, { Fragment } from 'react';
import Nav from ''

function SellerProfile(){
    return(
        <Fragment>
                <Nav />
                <Card className={classes.card}>
                    <div className={classes.main}>
                        <Avatar alt="profileImg" src={userInfo.ProfileImages === null ? "../Profile/noneImg.png" : "http://192.168.0.4:3065/\\" + userImg} className={classes.avatar} />
                        <Typography variant="h3" align="center" className={classes.Typography}>
                            {userInfo.name}
                        </Typography>
                        <Button variant="contained" color="primary" className={classes.button} onClick={productAdd}>
                            상품 등록하기
                        </Button>
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
                    <Tab label="내 상품" {...a11yProps(0)} />
                    <Tab label="찜한 상품" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <div className={classes.root} style={{ width: "80%", margin: "auto" }}>
                        {products.map((item, key) => {
                            return (
                                <Card className={classes.itemCard} key={key}>
                                    <CardHeader
                                        action={
                                            <div>
                                                <IconButton aria-label="edit" onClick={e => window.location.href = "/productChange/" + item.id}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton aria-label="remove" onClick={e => handleDelete(item.id)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </div>
                                        }
                                        title={<Link to={"/productinfo/" + item.id} className={classes.link}>{item.productName}</Link>}
                                        subheader={<Time value={item.updateDay} format="YYYY/MM/DD hh:mm" />}
                                    />
                                    <img src={item.Images.length === 0 ? defaultImg : "http://192.168.0.4:3065/" + item.Images[0].src} style={{ width: 350, height: 200 }} alt={item.productName}></img>
                                    {/* <img src={"http://10.80.163.141:3065/" + item.Images[0].src} style={{ width: 350, height: 200 }}></img> */}
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
    );
};

export default SellerProfile;