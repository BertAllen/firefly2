;(function(){

    const express = require("express");
    const server = express();
    const bp = require("body-parser");
    const port = 8888;
    const events = require("events");

    server.listen(port, function () {
        console.log("The amazing server on port# ", port);
    });
// server.use("/", express.static("/"))
    server.get("/", function (req, res) {
        res.send("all is well");
    })

}());