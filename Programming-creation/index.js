'use strict';

import { Application , Router, renderFileToString} from "./deps.js";
const itemList = JSON.parse(Deno.readTextFileSync(Deno.cwd()+"./assets/products.json")); 
const router = new Router();
//rair
let itemscookie = 0;
//console.log("test-before-loop-")  -->this works
router.get("/", async (context) => {
    console.log("test-enter-router.get")
    try {
        for(let i = 0; i < itemList.length; i++)
        {
            if(context.cookies.get(itemList[i].id))
            {
                itemscookie += parseInt(context.cookies.get(itemList[i].id));
            }
        }
        console.log("after-loop")
        context.cookies.set("itemscookie", itemscookie);

        context.response.body = await renderFileToString(Deno.cwd() + 
        "./Views/index.ejs", { itemList: itemList, itemscookie: itemscookie });
        context.response.type = "html";
        //await include("Views/index.ejs")
    } catch (error) {
        console.log(error);
    }
});