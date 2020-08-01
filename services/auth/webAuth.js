const db = require('../../models');
const jwt = require('jsonwebtoken');
const moment = require('moment')
const validator = require('validator')
const config = require('../../configs/config/config');
const twilio = require('../../utils/twilio');
const bcrypt = require('bcryptjs');

var getJWT = function (userId, callback) {
    jwt.sign({
        userId: userId,
    }, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRY *24*60*60 },function(err, token) {
       callback(err, token)
    });
}

var compareHash = function (password,dbHash,callback){
    bcrypt.compare(password, dbHash, (err, match) => {
        if(match) {
            // passwords match
            callback(null, true);
        } else {
            // passwords do not match
            callback('Invalid password match', null);
        }
    });
}

var hashPassword = function (password,rounds,callback) {
    bcrypt.hash(password, rounds, (error, hash) => {
        callback(error, hash);
    });
}

const isAuthenticated = async (req, res, next) => {
    if(req.header('auth-token')){
        jwt.verify(req.header('auth-token'), config.JWT_SECRET, function(err, decoded) {
            if (err){
                res.json({
                    success: false,
                    error: 'unauthorized'
                })
            }else{
                db.officialUser.findOne({
                    where: {
                        id: decoded.userId
                    }
                }).then( user => {
                    if(user){
                        req.userId=user.id
                        req.roles=user.roles
                        next()
                    }else{
                        res.json({
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
            success: false,
            error: 'unauthorized'
        })
    }
}

const login = async (req, res, next) => {
    if(req.body.username && req.body.username.trim().length > 0){
        db.officialUser.findOne({
            where: {
                userName: req.body.username
            }
        }).then( user => {
            if(user){
                compareHash(req.body.password, user.password, (error, match) => {
                    if (error) {
                        res.json({
                            success: false,
                            error: 'unauthorized'
                        })
                    } else {
                        getJWT(user.id, (err,token) => {
                            res.json({
                                success: true,
                                data: {
                                    userId: user.id,
                                    authToken: token,
                                    roles: user.roles
                                }
                            })
                        });
                    }
                })
            }else{
                res.json({
                    success: false,
                    error: 'unauthorized'
                })
            }
        })
    }
}

const register = async (req, res, next) => {
    if(req.roles && req.roles.indexOf('superUser')>-1){
        if(req.body.username && req.body.name && req.body.mobile && req.body.roles && req.body.password && req.body.username.trim().length > 0 && req.body.password.trim().length>0 && req.body.name.trim().length>0 && validator.isMobilePhone(req.body.mobile) && req.body.roles.length>0){
            hashPassword(req.body.password,10,(error,hash)=>{
                if(error){
                    res.json({
                        success: false,
                        error: 'invalid request'
                    })
                }else{
                    var user = new db.officialUser();
                    user.userName = req.body.username;
                    user.password = hash;
                    user.name = req.body.name;
                    user.mobile = req.body.mobile;
                    user.roles = req.body.roles;
                    user.save().then( user => {
                        res.json({
                            success: true,
                            data: {
                                name : user.name,
                                mobile : user.mobile,
                                roles : user.roles
                            }
                        })
                    })
                }
            })
        }else{
            res.json({
                success: false,
                error: 'invalid request'
            })
        }
    }else{
        res.json({
            success: false,
            error: 'unauthorized'
        })
    }
    
}



module.exports = {
    isAuthenticated: isAuthenticated,
    login:login,
    register:register
}
