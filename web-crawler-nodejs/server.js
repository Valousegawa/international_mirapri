// Run with node server.js in source folder
// Sauce : https://www.zenrows.com/blog/javascript-web-crawler-nodejs#create-web-crawler-in-node
// Try on https://mirapri.com/68613

const axios = require("axios"); 
const cheerio = require("cheerio"); 

let http = require('http');

let links = []

let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    // Crawling on the first argument
    const page = process.argv[2]
    crawl(page)
        .then((data) => function(){
            data.forEach(element => {
                links.push(element);
            })
            console.log(links)
            links.forEach(element => {
                response.write(element)
            })
            response.end()
        })
        .catch((reason) => console.log("Message:" + reason.message));
};

http.createServer(handleRequest).listen(8000);

async function crawl(page) { 
    let hrefs = []

    console.log("Start crawling on " + page) 
    
    // Use axios to perform HTTP request
    const pageHTML = await axios.get(page)
	
    // We have the flat HTML page
    //console.log(pageHTML.data)

    // Use cheerio to parse the HTML (can work with XML too)
    const $ = cheerio.load(pageHTML.data)

    // Retrieve all href links
    $("body a").each((index, element) => { 
        if($(element).attr("href") !== undefined && $(element).attr("href").includes("jp.finalfantasyxiv.com")){
            hrefs.push($(element).attr("href").replace('jp', 'fr'))
        }
        
    })
    return hrefs
} 
 
//main()