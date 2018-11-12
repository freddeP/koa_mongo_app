const MongoClient = require("mongodb").MongoClient;
const MONGO_URL = "mongodb://freddeP:"+process.env.PW+"@mongofp-shard-00-00-bgfzb.gcp.mongodb.net:27017,mongofp-shard-00-01-bgfzb.gcp.mongodb.net:27017,mongofp-shard-00-02-bgfzb.gcp.mongodb.net:27017/todoApp?ssl=true&replicaSet=mongoFP-shard-0&authSource=admin&retryWrites=true";

module.exports = function(app){

    MongoClient.connect(MONGO_URL,{useNewUrlParser: true},function(err,con){

        if(err) throw err;
        app.todos = con.db("todoApp").collection("todos"); 
        app.users = con.db("todoApp").collection("users"); 
        console.log("connection to mongoDb success");

    });
}

