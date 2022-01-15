import {Application, Context, Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {renderFileToString} from "https://deno.land/x/dejs@0.9.3/mod.ts";
import {Bookings} from "./bookingDb.js";

const app = new Application();
const router = new Router();

router.get('/',async (ctx)=> {

    let path = Deno.cwd() + "/index.ejs";
    console.log(path);

    let body = await renderFileToString(path,
        {
            headline:"Übersicht aller Gäste",
            bookings:Bookings
        }
    );

    ctx.response.body = body;

});

router.get('/bookings/:id',async (ctx)=> {

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