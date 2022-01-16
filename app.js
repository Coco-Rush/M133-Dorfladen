import {Application, Context, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {renderFileToString} from "https://deno.land/x/dejs@0.9.3/mod.ts";

const productlist = JSON.parse(Deno.readTextFileSync(Deno.cwd() + "/assets/products.json"));
const path_products = Deno.cwd() + "/assets/products.json";
let Usercookies = [];

const app = new Application();
const router = new Router();

router.get('/',async (ctx)=> {

    let path = Deno.cwd() + "/Views/overview.ejs";

    let body = await renderFileToString(path,
        {
            list:productlist
        }
    );

    ctx.response.body = body;
});

router.get('/detail/:id', async (ctx) => {

    let path = Deno.cwd() + "/Views/detail.ejs";

    // liest die id von der URL
    let id = ctx.params.id;
    let productById;
    console.log(id);

    for (let i = 0; i < productlist.length; i++) {
        
        if(productlist[i].id == id){ // + wandelt ein string in eine number um
            productById = productlist[i];
            break;
        }        
    }
    console.log(productById);

    let body = await renderFileToString(path,
        {
            product:productById
        }
    );

    ctx.response.body = body;

});

router.get('/shoppingCart', async (ctx) => {

    console.log("shoppingCart loaded\n");
    Usercookies = [];
    for(let i = 0;i<productlist.length;i++){
        console.log("Produkt mit der ID: "+productlist[i].id+" ("+productlist[i].productName+") hat soviel Menge: "+ctx.cookies.get("ID"+productlist[i].id));
        Usercookies.push(ctx.cookies.get("ID"+productlist[i].id));
    }

    let path = Deno.cwd() + "/Views/shoppingCart.ejs";

    let body = await renderFileToString(path,
        {
            list:productlist,
            amount:Usercookies
        }
    );

    ctx.response.body = body;
    
    //ctx.response.redirect("http://localhost:8000/");
});

router.post('/home', async (ctx) => {

    let path = Deno.cwd() + "/Views/overview.ejs";
    const body = await ctx.request.body().value;
    console.log(body);

    const id = body.get("productID");
    const amount = body.get("amount");
    for(let i = 0;i<11;i++){
        if(i == id){
            ctx.cookies.set("ID"+id, amount);
        }
    }
    console.log(id);
    console.log(amount);
    console.log("\nUsercookies have been applied");
    ctx.response.redirect("http://localhost:8000/");
});

router.post('/payfor', async (ctx) => {
    let path = Deno.cwd() + "/Views/Pay.ejs";
    const body = await ctx.request.body().value;
    const total = body.get("totalprice");
    const here = await renderFileToString(path,
        {
            price:total
        }
    );
    ctx.response.body = here;
});

router.post('/thankyou', async (ctx) => {

    let path = Deno.cwd() + "/Views/thanks.ejs";

    /*
    const zero = 0;
    for(let i = 0;i<11;i++){
        if(i == productlist[i].id){
            ctx.cookies.set("ID"+productlist[i].id, zero);
        }
    }*/
    console.log("wworks here?");
    const body = await ctx.request.body().value;

    const user = body.get("username");
    const pass = body.get("password");
    const email = body.get("mail-adress");

    let now = await renderFileToString(path,
        {
            name:user,
            mail:email
        }
    );
    ctx.response.body = now;
});


app.addEventListener('listen', () => {
    console.log("Server läuft");
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({port:8000});