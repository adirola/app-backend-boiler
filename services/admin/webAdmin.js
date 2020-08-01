var db = require('../../models');
var moment = require('moment')
var validator = require('validator')
var config = require('../../configs/config/config')
var Promise = require('bluebird');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');

const paginate = (page, pageSize) => {
    const offset = page * pageSize;
    const limit = pageSize;

    return{
        offset,
        limit,
    };
};

const updateUser = async (req, res, next) => {
    if(req.roles && (req.roles.indexOf("superUser")>-1 || req.roles.indexOf("admin")>-1) ){
        db.User.findOne({where:{
            id: req.params.id,
        }}).then(user => {
            if(user ){
                for(const key in req.body){
                    if(user[key] !== undefined){
                        user[key] = req.body[key]
                    }else{
                        res.json({
                            success: false,
                            error: 'invalid key'
                        })
                    }  
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
                    error: 'invalid-request'
                })
            }
        })
    }else{
        res.json({
            success: false,
            error: 'unauthorized'
        })
    }
}



const getUser = async (req, res, next) => {
    if(req.params.id && req.params.id.trim().length>0){
        db.User.findOne({where:{
            id:req.params.id
        }}).then(user =>{
            if(user){
                res.json({
                    success: true,
                    data: {
                        name : user.name,
                        mobile: user.mobile,
                        covidStatus : user.covidStatus,
                        qurrantineStatus : user.qurrantineStatus,
                        infectionStatus: user.infectionStatus,
                        abiding: user.abiding,
                    }
                })
            }else{
                res.json({
                    success: false,
                    message : 'no user found'
                })
            }
        })
    }else{
        res.json({
            success: false,
            message : 'invalid id'
        })
    }
}

const postFeed = async (req, res, next) => {
    var introFeed = new db.IntroFeed(req.body)
    introFeed.save().then( feed => {
        res.json({
            success: true,
            data: feed
        })
    })

}

const updateFeed = async (req, res, next) => {
    if(req.params.postId && req.params.postId.trim().length>0 ){
        db.IntroFeed.findOne({where:{
            id: req.params.postId,
        }}).then(feed => {
            if(feed ){
                for(const property in req.body){
                    feed[property] = req.body[property];
                }
                feed.save().then( feed=>{
                    res.json({
                        success: true,
                        data : feed
                    })
                })
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

const getFeeds = async (req, res, next) => {
    var page = 0;
    var pageSize = 1;
    var factor = "createdAt";
    var type = "DESC";
    if(req.query.orderFactor){
        factor = req.query.orderFactor;
    }
    if(req.query.orderType){
        type = req.query.orderType
    }
    if(req.query.page > 0){
        page = Number(req.query.page)-1;
    }
    if(req.query.pageSize > 0){
        pageSize = Number(req.query.pageSize);
    }
    db.IntroFeed.findAndCountAll(Object.assign({
        order: [
            [factor, type],
        ]
    },
    paginate(page,pageSize))).then(feeds => {
        if(feeds ){
            res.json({
                success: true,
                data : feeds.rows,
                totalCount: feeds.count
            })
        }else{
            res.json({
                success: false,
                error: 'invalid-request'
            })
        }
    })
}

const getFeed = async (req, res, next) => {
    if(req.params.postId && req.params.postId.trim().length>0 ){
        db.IntroFeed.findOne({where:{
            id: req.params.postId,
        }}).then(feed => {
            if(feed ){
                res.json({
                    success: true,
                    data : feed
                })
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


const postAnnouncement = async (req, res, next) => {
    var announcement = new db.Announcements(req.body)
    announcement.save().then( announcements => {
        res.json({
            success: true,
            announcement: announcements
        })
    })

}

const updateAnnouncement = async (req, res, next) => {
    if(req.params.announcementId && req.params.announcementId.trim().length>0 ){
        db.Announcements.findOne({where:{
            id: req.params.announcementId,
        }}).then(announcement => {
            if(announcement ){
                for(const property in req.body){
                    announcement[property] = req.body[property];
                }
                announcement.save().then( announcement=>{
                    res.json({
                        success: true,
                        data : announcement
                    })
                })
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

const getAnnouncements = async (req, res, next) => {
    var page = 0;
    var pageSize = 1;
    var factor = "createdAt";
    var type = "DESC";
    if(req.query.orderFactor){
        factor = req.query.orderFactor;
    }
    if(req.query.orderType){
        type = req.query.orderType
    }
    if(req.query.page > 0){
        page = Number(req.query.page)-1;
    }
    if(req.query.pageSize > 0){
        pageSize = Number(req.query.pageSize);
    }
    db.Announcements.findAndCountAll(Object.assign({
        order: [
            [factor, type],
        ]
    },
    paginate(page,pageSize))).then(announcements => {
        if(announcements ){
            res.json({
                success: true,
                data : announcements.rows,
                totalCount : announcements.count
            })
        }else{
            res.json({
                success: false,
                error: 'invalid-request'
            })
        }
    })
}

const getAnnouncement = async (req, res, next) => {
    if(req.params.announcementId && req.params.announcementId.trim().length>0 ){
        db.Announcements.findOne({where:{
            id: req.params.announcementId,
        }}).then(announcement => {
            if(announcement ){
                res.json({
                    success: true,
                    data : announcement
                })
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

const deleteAnnouncement = async (req, res, next) => {
    if(req.params.announcementId && req.params.announcementId.trim().length>0 ){
        db.Announcements.destroy({where:{
            id: req.params.announcementId,
        }}).then(announcement => {
            if(announcement ){
                res.json({
                    success: true,
                })
            }else{
                res.json({
                    success: false,
                    error: 'failed-delete'
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

const getDashBoradInfo = async (req, res, next) =>{
    db.User.findAll({}).then(users=>{
        if(users){
            var data  = {totalCases:{},quarrantineReport:{}}
            data.totalCases ={
                confirmed : users.filter((val)=>{return val.covidStatus.toLowerCase()==='positive'}).length,
                active : users.filter((val)=>{return val.infectionStatus.toLowerCase()==='active'}).length,
                recovered : users.filter((val)=>{return val.infectionStatus.toLowerCase()==='recovered'}).length,
                critical : users.filter((val)=>{return val.infectionStatus.toLowerCase()==='critical'}).length,
                deceased : users.filter((val)=>{return val.infectionStatus.toLowerCase()==='deceased'}).length,
            }
            data.quarrantineReport ={
                total: users.filter((val)=>{return val.qurrantineStatus.toLowerCase()!=='negative'}).length,
                atHome: users.filter((val)=>{return val.qurrantineStatus.toLowerCase()==='athome'}).length,
                atInstitution: users.filter((val)=>{return val.qurrantineStatus.toLowerCase()==='atinstitution'}).length,
                abiding: users.filter((val)=>{return val.abiding.toLowerCase()==='yes'}).length,
                defaulting: users.filter((val)=>{return val.abiding.toLowerCase()==='no'}).length
            }
            res.json({
                success: true,
                data: data
            })
        }else{
            res.json({
                success: false,
                error: 'no user'
            })
        }
    })
}

const getUsers = async (req, res, next) =>{
    const Op = Sequelize.Op;
    const operatorsAliases = {
        $like : Op.like
    }
    var page = 0;
    var pageSize = 1;
    var covidStatus = "negative";
    var mobile = "+";
    var factor = "createdAt";
    var type = "DESC";
    let filterTerm ={};
    const searchObj = req.query.search? JSON.parse(req.query.search):{};
    const filterObj = req.query.filter? JSON.parse(req.query.filter): {};
    if(Object.keys(searchObj).length>0){
        Object.keys(searchObj).forEach((key)=>{
            if(key.toLowerCase()==='mobile'){
                filterTerm[key] = '+'+searchObj[key].trim();
            }else{
                filterTerm[key] = searchObj[key];
            }
            
        })
    } 
    if(Object.keys(filterObj).length>0){
        Object.keys(filterObj).forEach((key)=>{
            filterTerm[key] = {
                [Op.like]: '%'+filterObj[key]+'%'
            }
        })
    }
    if(req.query.page > 0){
        page = Number(req.query.page)-1;
    }
    if(req.query.pageSize > 0){
        pageSize = Number(req.query.pageSize);
    }
    if(req.query.orderFactor){
        factor = req.query.orderFactor;
    }
    if(req.query.orderType){
        type = req.query.orderType
    }
    db.User.findAndCountAll( Object.assign({
        where :filterTerm,
        order: [
            [factor, type],
        ]
    },
    paginate(page,pageSize))).then(users=>{
        if(users){
            res.json({
                success:true,
                users : users.rows,
                totalCount : users.count
            })
        }else{
            res.json({
                success: false,
                error: 'no user'
            })
        }
    })
}

const getContactHistory = async (req, res, next) =>{
    var userIds = []
    var records = []
    const Op = Sequelize.Op;
    if(req.query.id && req.query.id.trim().length>0 ){
            db.ContactHistory.findAndCountAll( Object.assign({
                where :{
                    userId: req.query.id,
                }
            })).then(histories=>{
                if(histories){
                    userIds = histories.rows.reduce((acc,row)=>{
                        acc.push(row.contactedUserBeaconId);
                        return acc;
                    },[])
                    console.log(userIds);
                    records = userIds.reduce((acc,val)=>{
                        acc.push({'id':val})
                        return acc
                    },[])
                    console.log(records);
                    db.User.findAndCountAll({
                        where :{[Op.or]:records},
                    }).then(users=>{
                        if(users){
                            res.json({
                                success:true,
                                users : users.rows,
                                totalCount : users.count
                            })
                        }else{
                            res.json({
                                success: false,
                                error: 'no user'
                            })
                        }
                    })
                }else{
                    res.json({
                        success: false,
                        error: 'no history'
                    })
                }
            })

    }else{
        res.json({
            success: false,
            error: 'invlaid request'
        })
    }
}


module.exports = {
    updateUser: updateUser,
    postAnnouncement : postAnnouncement,
    postFeed: postFeed,
    updateFeed: updateFeed,
    getFeeds: getFeeds,
    getFeed: getFeed,
    updateAnnouncement: updateAnnouncement,
    getAnnouncements: getAnnouncements,
    getAnnouncement: getAnnouncement,
    getDashBoradInfo: getDashBoradInfo,
    getUsers: getUsers,
    getUser: getUser,
    deleteAnnouncement : deleteAnnouncement,
    getContactHistory : getContactHistory
}