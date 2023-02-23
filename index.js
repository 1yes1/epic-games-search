const express = require("express")
const app = express();
const epic = require("./epic-games-search.js");


const PORT = 8000


app.listen(PORT,()=> {
    console.log("Server Running PORT: "+PORT)
});



app.get('/comingSoon/:categories/:locale/:country/',(req,res)=>{

    // res.send(req.originalUrl.includes("comingSoon"));
    // epic.setAppProperties();
    epic.findGameWithName(req,true).then((result) => {
        res.send(result);
    })
    // res.send("Hello World");

})


app.get('/onSale/:categories/:locale/:country/',(req,res)=>{

    // res.send(req.params);
    // epic.setAppProperties();
    epic.findGameWithName(req,false).then((result) => {
        res.send(result);
    })
    // res.send("Hello World");

})


