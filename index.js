const express = require("express")
const app = express();
const epic = require("./epic-games-search.js");


const PORT = 8000


app.listen(PORT,()=> {
    console.log("Server Running PORT: "+PORT)
});



app.get('/:name',(req,res)=>{

    // epic.setAppProperties();
    epic.findGameWithName(req.params.name).then((result) => {
        res.send(result);
    })
    // res.send("Hello World");

})



