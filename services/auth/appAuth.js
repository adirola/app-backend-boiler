const db = require('../../models');
const jwt = require('jsonwebtoken');
const moment = require('moment')
const validator = require('validator')
const config = require('../../configs/config/config');
const twilio = require('../../utils/twilio')


var getJWT = function (userId, callback) {
    jwt.sign({
        userId: userId
    }, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRY *24*60*60 },function(err, token) {
       callback(err, token)
    });
}

function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const isAuthenticated = async (req, res, next) => {
    if(req.header('auth-token')){
        jwt.verify(req.header('auth-token'), config.JWT_SECRET, function(err, decoded) {
            if (err){
                res.json({
                    code : 401,
                    success: false,
                    error: 'unauthorized'
                })
            }else{
                db.User.findOne({
                    where: {
                        id: decoded.userId
                    }
                }).then( user => {
                    if(user){
                        req.userId=user.id
                        next()
                    }else{
                        res.json({
                            code : 401,
                            success: false,
                            error: 'unauthorized'
                        })
                    }
                })
            }
        });
    }
    else{
        res.json({
            code : 401,
            success: false,
            error: 'unauthorized'
        })
    }
}

const submitOtp = async (req, res, next) => {
    console.log(req.body)
    if (req.body.mobile && req.body.otp && validator.isMobilePhone(req.body.mobile) && validator.isNumeric(req.body.otp) && validator.isLength(req.body.otp,{min:6,max:6})){
        db.Otp.findOne({
            where: {
                mobile: req.body.mobile
            }
        }).then( otp => {
            if(otp){
                console.log((moment.duration(Date.now() - otp.lastRequested).asMinutes()))
                console.log(otp.value);
                if(otp.value == req.body.otp && (moment.duration(Date.now() - otp.lastRequested).asMinutes())<config.OTP_TIMEOUT ){
                    db.User.findOne({
                        where:{
                            mobile: req.body.mobile
                        }
                    }).then( user => {
                        if(user){
                            console.log(user.name);
                            if(user.name && user.name.trim().length>0){
                                getJWT(user.id, (err,token) => {
                                    res.json({
                                        success: true,
                                        data: {
                                            userId: user.id,
                                            authToken: token,
                                            name: user.name
                                        }
                                    })
                                })
                            }else{
                                getJWT(user.id, (err,token) => {
                                    res.json({
                                        success: true,
                                        data: {
                                            userId: user.id,
                                            authToken: token,
                                        }
                                    })
                                })
                            }    
                        }else{
                            var user = new db.User();
                            user.mobile = req.body.mobile;
                            user.covidStatus = 'negative';
                            user.qurrantineStatus = 'negative';
                            user.infectionStatus = 'notInfected';
                            user.abiding = 'yes';
                            user.save().then( user => {
                                getJWT(user.id, (err,token) => {
                                    res.json({
                                        success: true,
                                        data: {
                                            userId: user.id,
                                            authToken: token,
                                        }
                                    })
                                })
                            })
                        }
                    })
                }
                else{
                    res.json({
                        success: false,
                        error: 'invalid-request'
                    })
                }
            }else{
                res.json({
                    success: false,
                    error: 'invalid-request'
                })
            }
        })
    }else{
        res.json({
            success: false,
            error: 'invalid-request'
        })
    }
}

const getOtp = async (req, res, next) => {
    if (req.body.mobile && validator.isMobilePhone(req.body.mobile)) {
        db.Otp.findOne({
            where: {
                mobile: req.body.mobile
            }
        }).then( otp => {
            if(otp){
                if (( otp.count < config.OTP_MAX_COUNT )|| ( moment.duration(Date.now() - otp.lastRequested).asMinutes() > config.OTP_BACKOFF) ){
                    otp.value = generateOTP()
                    if(otp.count>=config.OTP_MAX_COUNT){
                        otp.count = 1
                    }else{
                        otp.count = otp.count +1
                    }
                    otp.lastRequested = Date.now()
                    otp.save().then(otp => {
                        if(req.body.medium && req.body.medium.toLowerCase() === 'voice'){
                            twilio.sendVoiceSms(otp.mobile,otp.value);
                            res.json({
                                success: true
                            })
                        }else if(req.body.medium && req.body.medium.toLowerCase() === 'text'){
                            twilio.sendSms(otp.mobile, 'Your OTP for EKTA is ' + otp.value)
                            res.json({
                                success: true
                            })
                        } else{
                            res.json({
                                success: false,
                                error: "invalid-medium"
                            })
                        }
                    })
                }else{
                    res.json({
                        success: false,
                        error: "otp-limit-reached"
                    })
                }
            } else {
                var otp = new db.Otp()
                otp.mobile = req.body.mobile
                otp.value = generateOTP()
                otp.lastRequested = Date.now()
                otp.count = 1
                otp.save().then(otp => {
                    twilio.sendSms(otp.mobile, 'Your OTP for EKTA is ' + otp.value)
                    res.json({
                        success: true
                    })
                })
            }
        })
    }else{
        res.json({
            success: false,
            error: 'invalid-request'
        })
    }
}

const completeProfile = async (req, res, next) => {
    console.log(req.body)
    if (req.body.name && req.body.mobile && validator.isMobilePhone(req.body.mobile) && req.body.name.trim().length > 0){
        db.User.findOne({
            where: {
                mobile: req.body.mobile
            }
        }).then( user => {
            if(user){
                user.name = req.body.name
                user.save().then(user => {
                    res.json({
                        success: true
                    })
                })
            }else{
                res.json({
                    success: false,
                    error: 'invalid-request'
                })
            }
        })
    }
}





module.exports = {
    getOtp: getOtp,
    submitOtp: submitOtp,
    isAuthenticated: isAuthenticated,
    completeProfile: completeProfile
}