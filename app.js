var http = require('http'),
    express = require('express'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    ObjectId = require('mongodb').ObjectID,
    CollectionDriver = require('./collectionDriver').CollectionDriver;

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.get('/:a/:b', function (req,res) {
	res.send(req.params.a + ' ' + req.params.b);
});

//app.get('/:a?', function (req,res) {
//    console.log('request understand');
//	res.send(req.params.a);
//});

app.use(function (req,res) {
    res.render('404', {url:req.url});
});

app.use(express.static(path.join(__dirname, 'public')));


var url = 'mongodb://localhost:27017/test';



var insertRestaurant = function(db, callback){
    db.collection('restaurants').insertOne(sampleRestaurant,function(err, result){
        assert.equal(err,null);
        console.log("successfully insert data");
        callback(result);
    })
}

var findRestaurants = function(db,callback){
    var cursor = db.collection('restaurants').find();
    cursor.each(function(err,doc){
        assert.equal(err,null);
        if(doc != null){
            console.dir(doc);
        }else{
            callback();
        }
    })
}

var updateRestaurant = function(db,callback){
    db.collection('restaurants').updateOne({"name":"test restaurant"},{
        $set:{
            "cuisine":"New American",
            "price":"Low"
        },
    },function(err,results){
        console.log(results);
        callback();
    })
}

var sampleRestaurant = {
    "address":{
        "street":"180",
        "city":"ottawa",
        "country":"canada"
    },
    "name":"test restaurant"
}


MongoClient.connect(url,function(err,db){
    assert.equal(null,err);
    console.log('Connected correctly to server');

//    findRestaurants(db,function(){
//        updateRestaurant(db,function(){
//            findRestaurants(db,function(){
//                db.close();
//            })
//        })
//        //db.close;
//    })
//    insertRestaurant(db, function(){
//        db.close();
//    })
})


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


