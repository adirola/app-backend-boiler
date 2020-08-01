var db = require('../../models')
var moment = require('moment')
const jwt = require('jsonwebtoken');
var validator = require('validator')
var config = require('../../configs/config/config')
var path = require("path");

const getJWT = function (pageNo,callback) {
    jwt.sign({
        page: pageNo
    }, config.JWT_SECRET,function(err, token) {
        callback(err, token)
     });
}

const sendCovidPostiveList = async (req, res, next) => {
    db.User.findAll({attributes: ['id'],where:{
        covidStatus: 'positive'
    }}).then(users => {
        res.send(users)
    })

}

const paginate = (page, pageSize) => {
    const offset = page * pageSize;
    const limit = pageSize;
    return{
        offset,
        limit,
    };
};

const getInto = async (req, res, next) => {
    if((req.query.fetchToken && req.query.fetchToken.length > 0 )|| (req.query.returnToken && req.query.returnToken.length > 0 )){
        jwt.verify(req.query.fetchToken?req.query.fetchToken:req.query.returnToken, config.JWT_SECRET, function(err, decoded) {
            if (err){
                res.json({
                    success: false,
                    error: 'invalid token'
                })
            }else{
                db.IntroFeed.findAndCountAll(paginate(decoded.page,5)).then((feeds) => {
                    if(feeds){
                        const fetchedResult = (decoded.page*5) >= feeds.count ? true : false
                        if(!fetchedResult){
                            getJWT(decoded.page+1, (err,token) => {
                                res.json({
                                    success: true,
                                    intro : feeds.rows,
                                    fetchToken: token,
                                    fetchedAll: fetchedResult
                                })
                            })
                        }else{
                            res.json({
                                success: true,
                                intro : feeds.rows,
                                fetchedAll: fetchedResult
                            })
                        }    
                    }else{
                        res.json({
                            success: false,
                            error: 'invalid-request'
                        })
                    }
                });
            }
        });
    }else{
        db.IntroFeed.findAndCountAll(paginate(0,5)).then((feeds) => {
            const fetchedResult = (1*5) >= feeds.count ? true : false
            if(feeds){
                if(!fetchedResult){
                    getJWT(1, (err,token) => {
                        res.json({
                            success: true,
                            intro : feeds.rows,
                            fetchToken: token,
                            fetchedAll: fetchedResult
                        })
                    })
                }else{
                    res.json({
                        success: true,
                        intro : feeds.rows,
                        fetchedAll: fetchedResult
                    })
                }   
            }else{
                res.json({
                    success: false,
                    error: 'invalid-request'
                })
            }
        });
    }

}

const getAnnouncement = async (req, res, next) => {
    if((req.query.fetchToken && req.query.fetchToken.length > 0 )|| (req.query.returnToken && req.query.returnToken.length > 0 )){
        jwt.verify(req.query.fetchToken?req.query.fetchToken:req.query.returnToken, config.JWT_SECRET, function(err, decoded) {
            if (err){
                res.json({
                    success: false,
                    error: 'invalid token'
                })
            }else{
                db.Announcements.findAndCountAll(paginate(decoded.page,5)).then(announcements => {
                    console.log(decoded.page);
                    console.log(((decoded.page+1)*5) >= announcements.count ? true : false);
                    if(announcements){
                        const fetchedResult = ((decoded.page+1)*5) >= announcements.count ? true : false;
                        if(!fetchedResult){
                            getJWT(decoded.page+1, (err,token) => {
                                res.json({
                                    success: true,
                                    announcements : announcements.rows,
                                    fetchToken: token,
                                    fetchedAll: fetchedResult
                                })
                            })
                        }else{
                            res.json({
                                success: true,
                                announcements : announcements.rows,
                                fetchedAll: fetchedResult
                            })
                        }                        
                    }else{
                        res.json({
                            success: false,
                            error: 'invalid-request'
                        })
                    }
                });
            }
        });
    }else{
        db.Announcements.findAndCountAll(paginate(0,5)).then(announcements => {
            if(announcements){
                console.log(announcements)
                const fetchedResult = (1*5) >= announcements.count ? true : false
                if(!fetchedResult){
                    getJWT(1, (err,token) => {
                        res.json({
                            success: true,
                            announcements : announcements.rows,
                            fetchToken: token,
                            fetchedAll: fetchedResult
                        })
                    })
                }else{
                    res.json({
                        success: true,
                        announcements : announcements.rows,
                        fetchedAll: fetchedResult
                    })
                }       
            }else{
                res.json({
                    success: false,
                    error: 'invalid-request'
                })
            }
        });
    }

}

const uploadInteractionHistory = async (req, res, next) => {
    console.log('location-logging')
    db.User.findOne({
        where :{
            id : req.userId,
        }
    }).then(user => {
        if(user){
            var contactData = req.body.interactionHistory;    
            if(contactData && Array.isArray(contactData)) {
                res.json({
                    success: true
                });

                let parsedContactData = contactData.map(c => {
                    var arr = c.replace("InteractionSession(", "").replace(")", "").split(", ");
            
                    let obj = {};
            
                    arr.forEach(val => {
                        obj[val.split('=')[0]] = val.split('=')[1];
                    });
            
                    return obj;
                });

                console.log(parsedContactData);
            
                const regex = /#.+#-/gm;
            
                var parsedContactData1 = parsedContactData.filter(c => regex.test(c.bluetoothName)).map(c => {
                    c.bluetoothName = c.bluetoothName.replace(regex, "");
                    return c;
                });
                
                console.log(parsedContactData1);

                var newData = parsedContactData1.map(c => ({
                    userId: req.userId,
                    contactedUserBeaconId: c.bluetoothName,
                    duration: 0,
                    startTime: 0,
                    maxSignal: Math.abs(c.maximumStrength),
                    submittedAt: Date.now()
                }));

                console.log(newData);

                db.ContactHistory.bulkCreate(newData);
            } else {
                res.json({
                    success: false,
                    error: 'invalid-request'
                });
            }
        }else{
            res.json({
                success:false,
                error:'user-not-permitted'
            })
        }
    })
    
    
}

const getFeedbackPage = async (req, res, next) => {
    res.sendFile('feedback.html',{root: path.join(__dirname, '../../public')});
}

const updateUserJWT = async (req, res, next) => {
        console.log(req.body['symptoms[]']);
        jwt.verify(req.body.token, config.JWT_SECRET, function(err, decoded) {
            if (err){
                res.json({
                    success: false,
                    error: 'unauthorized'
                })
            }else{
                console.log(decoded)
                db.User.findOne({
                    where: {
                        id: decoded.userId
                    }
                }).then( user => {
                    if(user){
                        if(user.symptoms !== undefined){
                            user.symptoms = req.body['symptoms[]']
                        }else{
                            res.json({
                                success: false,
                                error: 'invalid key'
                            })
                        }  
                        user.save().then(user => {
                            res.json({
                                success: true,
                                data: user
                            })
                        })
                    }else{
                        res.json({
                            success: false,
                            error: 'unknown user'
                        })
                    }
                })
            }
        });
}




module.exports = {
    sendCovidPostiveList: sendCovidPostiveList,
    uploadInteractionHistory: uploadInteractionHistory,
    getAnnouncement: getAnnouncement,
    getInto: getInto,
    getFeedbackPage : getFeedbackPage,
    updateUserJWT : updateUserJWT
}