require("dotenv").config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require("./config")
const swaggerUi = require("swagger-ui-express")
const swaggerJSDoc = require("swagger-jsdoc")

const morganOption = (NODE_ENV === "production")
    ? "tiny"
    : "common"

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

const options = {
    definition: {
        info: {
            title: "Swagger API",
            version: "1.0.0",
            description: "Usando o Swagger"
        }
    },
    apis: [".src/app.js"]

}

const swaggerSpec = swaggerJSDoc(options)


app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

//routes

/**
 * @swagger
 * /api/demo:
 *  get:
 *      description: get demo hello world!
 *      responses:
 *          '200':
 *              description: A successful response
 */

app.get("/api/demo", (req, res) => {
    res.json({ message: "OK" })
})

/**
 * @swagger
 * /api/demo/:{id}:
 *  get:
 *      tags:
 *         - ID param
 *      description: get by id
 *      parameters:
 *          - name:id
 *            description: id to get by
 *            in: path
 *            type: integer
 *            require: true
 *      responses:
 *          '200':
 *              description: A successful response
 */

app.get("/api/demo:id", (req, res) => {
    res.status(200).json({
        getID: req.params.id
    })
})

/**
 * @swagger
 * /api/demo/:{id}:
 *  delete:
 *      tags:
 *         - ID param
 *      description: delete by id
 *      parameters:
 *          - name:id
 *            description: id to delete
 *            in: path
 *            type: integer
 *            require: true
 *      responses:
 *          '200':
 *              description: A successful response
 */


app.delete("/api/demo/:id", (req, res) => {
    res.status(200).json({
        deleteId: req.params.id
    })
})

/**
 * @swagger
 * /api/demo/:{id}:
 *  patch:
 *      tags:
 *         - ID param
 *      description: patch by id with req body
 *      parameters:
 *          - name:id
 *            description: id to update
 *            in: path
 *            type: integer
 *            require: true
 *          - name:reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  itemName:
 *                      type: string
 *                  itemDescription:
 *                      type: string
 *             required:
 *                  - itemName
 *                  - itemDescription
 *      responses:
 *          '200':
 *              description: A successful response
 */

app.path("/api/demo/:id", express.json(), (req, res) => {
    res.status(200).json({
        patchId: req.params.id,
        newItemName: req.body.itemName,
        newItemDescription: req.body.itemDescription
    })
})

/**
 * @swagger
 * /api/demo:
 *  post:
 *      description: post to create a new item
 *      parameters:
 *          - name:reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  itemName:
 *                      type: string
 *                  itemDescription:
 *                      type: string
 *             required:
 *                  - itemName
 *                  - itemDescription
 *      responses:
 *          '200':
 *              description: A successful response
 */

app.post("/api/demo", express.json(), (req, res) => {
    res.status(200).json({
        newItemName: req.body.itemName,
        newItemDescription: req.body.itemDescription
    })
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    }
    else {
        console.log(error)
        response = { message: error.message, error }
    }

    res.status(500).json(response)
})

module.exports = app