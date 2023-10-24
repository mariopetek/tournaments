import express from 'express'
import path from 'path'
import fs from 'fs'
import https from 'https'

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})

const port = 3000
https
    .createServer(
        {
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert')
        },
        app
    )
    .listen(port, () => {
        console.log(`Application running at https://localhost:${port}/`)
    })
