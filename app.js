var http = require('http'),
    express = require('express'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    Server = require('mongodb').Server,
    ObjectId = require('mongodb').ObjectID,
    CollectionDriver = require('./collectionDriver').CollectionDriver;

//Express settings
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//Mongo DB settings
var mongoHost = 'localHost';
var mongoPort = 27017;
var collectionDriver;
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));

//Mongo DB methods
mongoClient.open(function(err, mongoClient){
    if(!mongoClient){
        console.log('Error, must start mongo db first');
        process.exit(1);
    }
    var db = mongoClient.db("MyDataBase");
    collectionDriver = new CollectionDriver(db);
})

app.get('/', function (req, res) {
    res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.get('/:collection',function(req,res){
    var params = req.params;
    collectionDriver.findAll(params.collection,function(error,objs){
        if (error){
            res.send(400,error);
        } else{
            if(req.accepts('html')){
                res.render('data',{objects:objs, collection: req.params.collection});
            } else{
                res.set('Content-Type','application/json');
                res.send(200, objs);
            }
        }
    })
})

app.get('/:collection/:entity',function(req,res){
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if(entity){
        collectionDriver.get(collection,entity,function(error,objs){
            if(error){
                res.send(400,error);
            } else{
                res.send(200, objs);
            }
        })
    } else{
        res.send(400,{error:'bad url', url: req.url});
    }
})


//Express
app.use(function (req,res) {
    res.render('404', {url:req.url});
});

app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


