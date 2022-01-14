'use strict';

import { Application , Router, renderFileToString} from "./deps.js";
const itemList = JSON.parse(Deno.readTextFileSync(Deno.cwd()+"/assets/products.json")); 
const router = new Router();
let totalItems = 0;

router.get("/", async (context) => {
    try {
        console.log("\nhome:\n");

        // count total items and save to cookie
        let totalItems = 0;
        for(let i = 0; i < itemList.length; i++)
        {
            if(context.cookies.get(itemList[i].id))
            {
                totalItems += parseInt(context.cookies.get(itemList[i].id));
            }
        }
        context.cookies.set("totalItems", totalItems);

        context.response.body = await renderFileToString(Deno.cwd() + 
        "/views/home.ejs", { itemList: itemList, totalItems: totalItems });
        context.response.type = "html";
    } catch (error) {
        console.log(error);
    }
});