import {Application, Context, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {renderFileToString} from "https://deno.land/x/dejs@0.9.3/mod.ts";

const productlist = JSON.parse(Deno.readTextFileSync(Deno.cwd() + "/assets/products.json"));
const path_products = Deno.cwd() + "/assets/products.json";
let Usercookies = [];

const app = new Application();
const router = new Router();

router.get('/',async (ctx)=> {

    let path = Deno.cwd() + "/Views/overview.ejs";
    for(let i=0;i<10;i++){
        ctx.cookies.set("ID"+productlist[i].id,'0');
    }

    let body = await renderFileToString(path,
        {
            list:productlist
        }
    );

    ctx.response.body = body;
});

router.get('/home', async (ctx) => {
    let path = Deno.cwd() + "/Views/overview.ejs";

    let body = await renderFileToString(path,
        {
            list:productlist
        }
    );

    ctx.response.body = body;
})

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

router.post('/add/:id', async (ctx) => {
    let path = Deno.cwd() + "/Views/shoppingCart.ejs";
    let id = ctx.params.id;
    let one = 1;
    one += parseInt(ctx.cookies.get("ID"+id));
    ctx.cookies.set("ID"+id, one);
    console.log(ctx.cookies.get("ID"+id));

    Usercookies = [];
    for(let i = 0;i<productlist.length;i++){
        console.log("Produkt mit der ID: "+productlist[i].id+" ("+productlist[i].productName+") hat soviel Menge: "+ctx.cookies.get("ID"+productlist[i].id));
        Usercookies.push(ctx.cookies.get("ID"+productlist[i].id));
    }
    ctx.response.redirect("http://localhost:8000/shoppingCart");
});

router.post('/remove/:id', async (ctx) => {
    let path = Deno.cwd() + "/Views/shoppingCart.ejs";
    let id = ctx.params.id;
    console.log(ctx.cookies.get("ID"+id));
    if(!(ctx.cookies.get("ID"+id)==0)||ctx.cookies.get("ID"+id)==1){
        let one = ctx.cookies.get("ID"+id) - 1;
        ctx.cookies.set("ID"+id, one);
    }
    if(ctx.cookies.get("ID"+id)==1){
        ctx.cookies.set("ID"+id,'0');
    }
    console.log(ctx.cookies.get("ID"+id));
    ctx.response.redirect("http://localhost:8000/shoppingCart");
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
});

router.post('/apply', async (ctx) => {

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
    ctx.response.redirect("http://localhost:8000/home");
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
    const body = await ctx.request.body().value;

    const user = body.get("username");
    const pass = body.get("password");
    const email = body.get("mail-adress");

    let go = await renderFileToString(path,
        {
            name:user
        }
    );
    ctx.response.body = go;
});


app.addEventListener('listen', () => {
    console.log("Server läuft");
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({port:8000});