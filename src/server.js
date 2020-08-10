const express = require("express")
const app = require("./app")
const server = express()

server.use(app)
const port = process.env.PORT || 3001
server.listen(port, function(){
    console.warn("O servidor esta rodando na porta ", port)
})