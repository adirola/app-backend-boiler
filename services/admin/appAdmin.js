var db = require('../../models')
var moment = require('moment')
var validator = require('validator')
var config = require('../../configs/config/config')
var Promise = require('bluebird');

const isAdmin = async (req, res, next) => {
    if(req.header('admin-key') == config.ADMIN_KEY){
        next()
    }else{
        res.json({
            success: false,
            error: 'unauthorized'
        })
    }
}

const setCovidStatus = async (req, res, next) => {
    db.User.findOne({where:{
        mobile: req.body.mobile,
    }}).then(user => {
        if(user){
            user.covidStatus = req.body.covidStatus
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

const getUser = async (req, res, next) => {
    db.User.findOne({where:{
        mobile: req.params.mobile,
    }}).then(user => {
        if(user){
            res.json({
                success: true,
                user
            });
        }else{
            res.json({
                success: false,
                error: 'invalid-request'
            })
        }
    })
}

const getUsers = async (req, res, next) => {
    db.User.findAll({}).then(users => {
        if(users){
            res.json({
                success: true,
                users: users
            });
        }else{
            res.json({
                success: false,
                error: 'invalid-request'
            })
        }
    });
}

const getContacts = async (req, res, next) => {
    db.User.findOne({where:{
        mobile: req.params.mobile,
    }}).then(user => {
        if(user){
            return db.ContactHistory.findAll({
                where: {
                    userId: user.id
                },
                raw: true
            })
        }else{
            res.json({
                success: false,
                error: 'invalid-request'
            })
        }
    }).then(contactdetails => {
        if(contactdetails){

            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }

            contactdetails = contactdetails.map(c => c.contactedUserBeaconId).filter(onlyUnique);
            Promise.all(contactdetails.map(c => db.User.findOne({where: {id: c}, raw: true})))
                .then(users => {
                    res.json({
                        success: true,
                        users: users.filter(u => u != null)
                    });
                })
        }else{
            res.json({
                success: false,
                error: 'invalid-request'
            })
        }
    });
}

module.exports = {
    isAdmin: isAdmin,
    setCovidStatus: setCovidStatus,
    getUser : getUser,
    getUsers : getUsers,
    getContacts : getContacts,
}