const request = require("request-promise");
const cheerio = require("cheerio");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const facebookOptions = {
    pretendToBeVisual: true
    // runScripts: 'dangerously',
    // resources: "usable"
};

function splitUrl(url) { return url.split('.')[1] };

function prependMobileUrl(url) {
    const periods = url.split('.');
    const pre = periods[0].split('/');
    pre[2] = "mobile";
    periods[0] = pre.join('/');
    return periods.join('.');
};

async function getFacebookImage(url, callback) {
    try {
        await JSDOM.fromURL(`${url}`, facebookOptions).then(dom => {
            let source = dom.window.document.querySelector(".scaledImageFitWidth") || dom.window.document.querySelector(".scaledImageFitHeight") || "video";
            if (source !== "video") {
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
            return "Rate Limiter: Slow Down";
        }
    }
}

async function getResAdvisorImage(url) {
    try {
        const baseHtml = await request(url);
        const $ = cheerio.load(baseHtml);
        let imgSrc = $(".flyer").children('a').attr('href');
        if (!imgSrc) {
            imgSrc = "/check";
        }
        return ("https://www.residentadvisor.net" + imgSrc);
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

module.exports = {
    splitUrl,
    prependMobileUrl,
    getFacebookImage,
    getEventbriteImage,
    getResAdvisorImage
};