'use strict';

import { Application , Router, renderFileToString} from "./deps.js";
const itemList = JSON.parse(Deno.readTextFileSync(Deno.cwd()+"/assets/products.json")); 
const router = new Router();
let itemscookie = 0;

router.get("/", async (context) => {
    try {
        for(let i = 0; i < itemList.length; i++)
        {
            if(context.cookies.get(itemList[i].id))
            {
                itemscookie += parseInt(context.cookies.get(itemList[i].id));
            }
        }
        context.cookies.set("itemscookie", itemscookie);

        context.response.body = await renderFileToString(Deno.cwd() + 
        "/views/index.ejs", { itemList: itemList, itemscookie: itemscookie });
        context.response.type = "html";
    } catch (error) {
        console.log(error);
    }
});