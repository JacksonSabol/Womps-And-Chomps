const request = require("request-promise");
const cheerio = require("cheerio");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const facebookOptions = {
    pretendToBeVisual: true
    // runScripts: 'dangerously',
    // resources: "usable"
};

function splitUrl(url) { 
    const check = checkUrl(url);
    if (check) { return url.split('.')[1]}
    else { const newUrl =  prependUrl(url); return splitUrl(newUrl) };
};

function checkUrl(url) {
    const pre = url.split('/');
    const post = pre[2].split('.');
    if (post[0] === "www" || post[0] === "wl" || post[0] === "concerts") { return true }
    else { return false }
};

function prependUrl(url) {
    const slashes = url.split('/');
    const [https, space, dotcom, ...rest] = slashes;
    const periods = slashes[2].split('.');
    periods.unshift("www");
    const pre = periods.join('.');
    const output = [https, space, pre, ...rest];
    return output.join('/');
};

async function getFacebookImage(url, callback) {
    try {
        await JSDOM.fromURL(`${url}`, facebookOptions).then(dom => {
            let source = dom.window.document.querySelector(".scaledImageFitWidth") || dom.window.document.querySelector(".scaledImageFitHeight") || "N/A";
            if (source !== "N/A") {
                source = source.src;
            }
            callback(source);
        });
    } catch (e) {
        console.log("error: ", e);
    }
}

async function getEventbriteImage(url) {
    try {
        const baseHtml = await request(url);
        const $ = cheerio.load(baseHtml);
        let imgSrc = $(".listing-hero").children('picture').attr("content");
        if (imgSrc === undefined) {
            imgSrc = $(".event_title_image").children('img').attr("src");
        }
        return imgSrc;
    } catch (e) {
        if (e.response.req.path === "/notavailable") {
            return "Removed";
        } else {
            return "N/A";
        }
    }
}

async function getResAdvisorImage(url) {
    try {
        const baseHtml = await request(url);
        const $ = cheerio.load(baseHtml);
        const imgSrc = $(".flyer").children('a').attr('href');
        if (!imgSrc) {
            return "N/A";
        } else {
            return ("https://www.residentadvisor.net" + imgSrc);
        }
    } catch (e) {
        console.log(e);
        if (e.statusCode === 429) {
            return {
                error: "Rate Limiter",
                message: `Retry after ${e.response.headers['retry-after']}ms`
            };
        } else {
            return {
                error: "Unknown"
            };
        }

    }
}

async function getTicketmasterImage(url) {
    try {
        const baseHtml = await request(url);
        const $ = cheerio.load(baseHtml);
        let imgSrc = $("#artist_image").attr("src") || $('.event-header__photo').attr('src') || "N/A";
        if (imgSrc.slice(0, 2) == "//") {
            const sourceSlice = imgSrc.split('').slice(26, -27).join('');
            imgSrc = 'https://www.ticketmaster.com/compressedimages/' + sourceSlice + '_RETINA_PORTRAIT_16_9.jpg?width=600&height=400&fit=crop&auto=webp';
        }
        return imgSrc;
    } catch (e) {
        if (e.statusCode === 416) {
            return "unsatisfied range"
        } else {
            return "N/A"
        }
    }
}

async function getDnaLoungeImage(url, callback) {
    try {
        await JSDOM.fromURL(`${url}`, facebookOptions).then(dom => {
            let source = dom.window.document.querySelector(".fthumb") || "N/A";
            if (source !== "N/A") {
                source = source.src;
            }
            callback(source);
        });
    } catch (e) {
        console.log(e);
    }
}

async function getBigNeonImage(url, callback) {
    try {
        await JSDOM.fromURL(`${url}`, facebookOptions).then(dom => {
            // ^='background-image: url'
            const source = dom.window.document.querySelector("div[style]");
            console.log(source);
            const sourceUrl = source.style.backgroundImage;
            callback(sourceUrl);
        });
    } catch (e) {
        console.log(e);
    }
}

async function getTicketWebImage(url) {
    try {
        const baseHtml = await request(url);
        const $ = cheerio.load(baseHtml);
        let imgSrc = $(".event-image").attr("data-ng-src");
        return imgSrc;
    } catch (e) {
        console.log(e);
        // return "Error"
    }
}

module.exports = {
    splitUrl,
    prependUrl,
    getFacebookImage,
    getEventbriteImage,
    getResAdvisorImage,
    getTicketmasterImage,
    getDnaLoungeImage,
    getBigNeonImage,
    getTicketWebImage
};