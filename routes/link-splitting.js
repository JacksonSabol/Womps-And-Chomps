const request = require("request-promise");
const cheerio = require("cheerio");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function splitUrl(url) { return url.split('.')[1] };

async function getFacebookImage(url, callback) {
    try {
        await JSDOM.fromURL(`${url}`).then(dom => {
            const source = dom.window.document.querySelector(".scaledImageFitWidth").src || dom.window.document.querySelector(".scaledImageFitHeight").src;
            callback(source);
        });
    } catch (e) {
        console.log(e);
    }
}

async function getEventbriteImage(url) {
    try {
        const baseHtml = await request(url);
        const $ = cheerio.load(baseHtml);
        const imgSrc = $(".listing-hero").children('picture').attr("content");
        return imgSrc;
    } catch (e) {
        console.log(e);
    }
}
module.exports = {
    splitUrl,
    getFacebookImage,
    getEventbriteImage
};