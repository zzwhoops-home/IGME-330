import express from "express";
import fs, { readFileSync } from "fs";

const app = express();

app.use(express.static('public'));

const character = {
    x: 0,
    y: 0
};

app.get("/position", (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(character));
})

app.get("/", (req, res) => {
    const html = readFileSync('./public/index.html');

    res.set('Content-Type', 'text/html');
    res.send(html);
});

app.post("/move", (req, res) => {
    console.log('hi');

    character.x += 1;

    res.set('Content-Type', 'application.json');
    res.send(JSON.stringify(character));
});

app.listen(3000, () => {
    console.log(`server running at http://localhost:3000`);
});