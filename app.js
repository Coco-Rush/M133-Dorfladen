import {Application, Context, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {renderFileToString} from "https://deno.land/x/dejs@0.9.3/mod.ts";
import {Bookings} from "./bookingDb.js";

const productlist = JSON.parse(Deno.readTextFileSync(Deno.cwd() + "/assets/products.json"));
const path_products = Deno.cwd() + "/assets/products.json"; 

const app = new Application();
const router = new Router();

router.get('/',async (ctx)=> {

    let path = Deno.cwd() + "/Views/overview.ejs";
    console.log(path);
    console.log(path_products);
    console.log(productlist);

    let body = await renderFileToString(path,
        {
            list:productlist
        }
    );

    ctx.response.body = body;
});

router.get('/home', async (ctx) => {
    ctx.response = redirect("http://localhost:8000");
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
            title:"Helden",
            product:productById
        }
    );

    ctx.response.body = body;

});

router.get('/bookings/:id', async (ctx) => {

    let path = Deno.cwd() + "/booking.ejs";

    // liest die id von der URL
    let id = ctx.params.id;

    // Variable für die booking-Objekt vom array by booking id
    let bookingById;

    for (let index = 0; index < Bookings.length; index++) {
        
        if(id && Bookings[index].id === +id){ // + wandelt ein string in eine number um
            bookingById = Bookings[index];
            break;
        }        
    }
    console.log(bookingById);

    let body = await renderFileToString(path,
        {
            headline:"Übersicht einer Buchung",
            booking:bookingById
        }
    );

    ctx.response.body = body;

});

app.addEventListener('listen', () => {
    console.log("Server läuft");
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({port:8000});