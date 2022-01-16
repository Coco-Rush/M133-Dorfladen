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

router.post('/home', async (ctx) => {

    let path = Deno.cwd() + "/Views/overview.ejs";
    const body = await ctx.request.body().value;
    console.log(body);

    const id = body.get("productID");
    const amount = body.get("amount");
    for(let i = 0;i<productlist.length;i++){
        if(i == id){
            ctx.cookies.set("ID"+id, amount);
        }
    }
    if(id == 10){
        ctx.cookies.set("ID010", amount);
    }
    console.log(id);
    console.log(amount);
    console.log("\nUsercookies have been applied");
    ctx.response.redirect("http://localhost:8000/");
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

router.post('/pay', async (ctx) => {

});


app.addEventListener('listen', () => {
    console.log("Server läuft");
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({port:8000});