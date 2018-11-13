const bcrypt = require("bcryptjs");
const escape = require('escape-html');

module.exports = async function(ctx,next)
{   
    try
    {
        let obj = ctx.request.body;
        const hash = await bcrypt.hash(obj.password, 14);

        obj.password = hash;
        ctx.request.body = obj;
        await next();
    }
    catch(ex)
    {
        throw ex;
        ctx.body = {error: "no result"};  
    }   

}