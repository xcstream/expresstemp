
const os = require('os')
const express = require('express')
global.app = express();
const servestatic = require('serve-static')
const bodyParser = require("body-parser");
const session = require('express-session');
global.multiparty =require('multiparty')
const fs =global.fs=require('fs')
global.md5=require('md5')
global.Sequelize= require('sequelize');
global.fetch = require('node-fetch')
const xml2js = require('xml2js');
global.xmlParser = new xml2js.Parser({explicitArray: false, ignoreAttrs: true});
global.request = require('request')
const RedisStore = require('connect-redis')(session);


var production = false
if (process.env.USER == 'root'){
    production = true
}

var sessionSetting = {
    secret: 'mus',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 3600 * 24 * 30
    },
    store: new RedisStore({
        host: '127.0.0.1',
        port: '6379'
    })
}
var sessionSettingDBG = {
    secret: 'te',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false ,maxAge:1000*3600*24}
}


if(production){
    app.use(session(sessionSetting))
}else{
    app.use(session(sessionSettingDBG))
}

/*
var config = JSON.parse(fs.readFileSync(path))


global.sequelize = new Sequelize(config.mysql.db, config.mysql.user, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    pool: {
        max: 3,
        min: 0,
        idle: 10000
    },
    timezone: '+08:00'
});*/

app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(servestatic('public'));

fs.readdir('controller', function(err,files){
    if(err){
        console.log(err);
    }
    for(var f of files){
        require('./controller/'+ f)
    }
    var port = 3001
    if(process.env.PWD=='/root/mt'){
        port ++
    }
    app.listen(port)
    console.log('http://localhost:'+port)
})

