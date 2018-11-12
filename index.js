const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-body");
const objectId = require("mongodb").ObjectID;
const json = require("koa-json");
const serve = require('koa-static');
const escape = require('escape-html');




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
router.post("/user", async function(ctx){

    try{
        let obj = ctx.request.body;
        for(let i in obj)
        {
            obj[i] = escape(obj[i]);
            console.log(obj[i]);
        }
        await app.users.insertOne(obj);
        ctx.body = obj;
        //ctx.redirect("/");
    }
    catch(ex)
    {
        ctx.body = {error: "no result"};  
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

    const id = ctx.params.id;
    const query = {"_id":objectId(id)}
    try{
        const result = await app.todos.findOne(query);
        ctx.body = result;
    }
    catch(ex){
        ctx.body = {error: "no result"};
    }
  
});

// Delete Route 
router.delete("/todo/:id", async function(ctx){

    const id = ctx.params.id;
    const query = {"_id":objectId(id)}
    try{
        const result = await app.todos.deleteOne(query);
        ctx.body = {"message" :   `Object with id = ${id} is deleted` }; 
    }
    catch(ex){
        ctx.body = {error: "no result"};
    } 
});



const port = process.env.port || 3000;
app.listen(port,()=>console.log("app's running on port: "+port));
 
