const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb'); // Add this line to import MongoClient

http.createServer((req, res) => {
    console.log(req.url);
    if (req.url === '/') {
        // home page
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/about') {
        fs.readFile(path.join(__dirname, 'public', 'about.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        async function main() {
            const uri = "mongodb+srv://rachelsowmya:1234@cluster2.pxy7ps6.mongodb.net/?retryWrites=true&w=majority";
            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            try {
                // Connect to the MongoDB cluster
                await client.connect();
                console.log("Connected to MongoDB");

                // Make the appropriate DB calls
                await findsomedata(client);
            } catch (e) {
                console.error(e);
            } finally {
                await client.close();
            }
        }

        main().catch(console.error);

        async function findsomedata(client) {
            try{
            const cursor = client.db("bookdb").collection("bookcollection").find({});
            const results = await cursor.toArray();
            const js = JSON.stringify(results);
            console.log(js);
            }catch(error)
            {
                console.error("error fetching from mongodb")
            }
        }
    

        fs.readFile(path.join(__dirname, 'public', 'db.json'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(content);
        });
    } else {
        res.end("<h1> 404 Nothing is here </h1>");
    }
}).listen(3968, () => console.log("Server is running on port 3968"));
