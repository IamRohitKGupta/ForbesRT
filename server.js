require('dotenv').config()
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

const lists = [
    { type: 'person', year: 0, uri: 'rtb' },
    { type: 'person', year: 0, uri: 'rtrl' },
];

async function request(location) {
    const url = typeof location === 'object' ? location.url : location;
    const timeout = 30 * 1000;
    const instance = axios.create({ timeout });
    const response = await instance(location);
    return {
        url,
        data: response.data,
        passthrough: location.passthrough
    };
}

function locate(item) {
    return {
        url: process.env.FORBES_URL,
        params: item,
        passthrough: item
    };
}

function locateHeavy(item) {
    return {
        url: process.env.FORBES_URL_HEAVY,
        params: item,
        passthrough: item
    };
}

function parse(response) {
    /*
    return response.data.map(item => {
        return {
            name: item.name,
            surname: item.lastName,
            position: item.position,
            rank: item.rank,
            worth: item.worth,
            age: item.age,
            source: item.source,
            industry: item.industry,
            gender: item.gender,
            country: item.country
        };
    });
    */
   return response.data
}

async function runRt() {
    const process = request(locate(lists[0]))
        .then(parse)
        .catch(error => {console.log("error: " + error)});
    return process;
    /*
    const processes = lists.map(list => {
        const process = request(locate(list))
            .then(parse)
            .catch(error => {console.log("error")});
        return process;
    });
    return await Promise.all(process);
    */
}

async function runRtAm() {
    const process = request(locate(lists[1]))
        .then(parse)
        .catch(error => {console.log("error: " + error)});
    return process;
}

async function runRtHeavy() {
    const process = request(locateHeavy(lists[0]))
        .then(parse)
        .catch(error => {console.log("error: " + error)});
    return process;
}

app.get('/real-time', async (req, res) => {
    const data = await runRt();
    res.json(data);
});

app.get('/real-time-america', async (req, res) => {
    const data = await runRtAm();
    res.json(data);
});

app.get('/real-time-full', async (req, res) => {
    const data = await runRtHeavy();
    res.json(data);
});

app.listen(8000, () => {
    console.log('Server started on http://localhost:8000');
});
