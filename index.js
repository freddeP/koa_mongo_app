const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-body");
const objectId = require("mongodb").ObjectID;
const json = require("koa-json");
const serve = require('koa-static');
const escape = require('escape-html');
const createUser = require("./fp_modules/createUser");



const app = new Koa();
const router = new Router();
app
    .use(json())
    .use(bodyParser())
    .use(router.routes())
    .use(serve('./public'));;


//Connect to db:
require("./fp_modules/mongo")(app);


//rout for creating new user
//through middleware that hashes password
router.post("/user",createUser, async function(ctx){
    
    // Check if user exists
    const query = {email: ctx.request.body.email};
    const exists = await app.users.findOne(query);

    if(exists === null)
    {
        await app.users.insertOne(ctx.request.body);
        ctx.body = ctx.request.body;
    }
    else{
        ctx.body = {error: "user exists"};
    }
});

router.get("/user", async function(ctx){

    try{
        const result = await app.users.find().toArray();
        ctx.body = result;
    }
    catch(ex){
        ctx.body = {error: "no result"};
    }
  
});

router.delete("/user/:id", async function(ctx){
    try{
        const id = ctx.params.id;
        const query = {"_id":objectId(id)}
    
        const result = await app.users.deleteOne(query);
        ctx.body = {"message" :   `Object with id = ${id} is deleted` }; 
    }
    catch(ex){
        ctx.body = {error: "no result"};
    } 
});




router.get("/", async function(ctx){
    ctx.body = [{message: "Welcome to this Koa rest api see more on /app.html"},
                {get: "/todo"},    
                {'get one': "/todo/id"},    
                {post: "/todo", requires: "body in json format"},    
                {delete: "/todo/id"}];
});
router.post("/todo", async function(ctx){

    try{
        let obj = ctx.request.body;
        for(let i in obj)
        {
            obj[i] = escape(obj[i]);
            console.log(obj[i]);
        }
        await app.todos.insertOne(obj);
        ctx.body = obj;
        //ctx.redirect("/");
    }
    catch(ex)
    {
        ctx.body = {error: "no result"};  
    }    
});

// Get Route show all
router.get("/todo", async function(ctx){

    try{
        const result = await app.todos.find().toArray();
        ctx.body = result;
    }
    catch(ex){
        ctx.body = {error: "no result"};
    }
  
});

// Get Route from an id
router.get("/todo/:id", async function(ctx){
    try{
        const id = ctx.params.id;
        const query = {"_id":objectId(id)}
   
        const result = await app.todos.findOne(query);
        ctx.body = result;
    }
    catch(ex){
        ctx.body = {error: "no result"};
    }
  
});

// Delete Route 
router.delete("/todo/:id", async function(ctx){
    try{
    const id = ctx.params.id;
    const query = {"_id":objectId(id)}
    
        const result = await app.todos.deleteOne(query);
        ctx.body = {"message" :   `Object with id = ${id} is deleted` }; 
    }
    catch(ex){
        ctx.body = {error: "no match, nothing deleted"};
    } 
});



const port = process.env.port || 3000;
app.listen(port,()=>console.log("app's running on port: "+port));
 
