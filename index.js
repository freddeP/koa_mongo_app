const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-body");


const app = new Koa();
const router = new Router();
app
    .use(bodyParser())
    .use(router.routes());

//Connect to db:
require("./fp_modules/mongo")(app);



router.get("/", async function(ctx){

    ctx.body = {message: "this is a json object"};

});
router.post("/todo", async function(ctx){

    try{
    console.log(ctx.request.body);
    await app.todos.insertOne(ctx.request.body);
    ctx.body = ctx.request.body;
    }
    catch(ex)
    {
        ctx.body = {error: "no result"};  
    }
    
});
router.get("/todo", async function(ctx){

    try{
        const result = await app.todos.find().toArray();
        ctx.body = result;
    }
    catch(ex){
        ctx.body = {error: "no result"};
    }
  
});




app.listen(3000,()=>console.log("app's running"));
 
