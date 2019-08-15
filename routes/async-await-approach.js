const cheerio = require("cheerio");
const request = require("request-promise");

const getFacebookImage = require("./link-splitting").getFacebookImage;
const splitUrl = require("./link-splitting").splitUrl;

(async function () {
    try {
        const url = "https://19hz.info/eventlisting_BayArea.php";
        const baseHtml = await request(url);
        const $ = cheerio.load(baseHtml);
        const table = $('table').slice(0, 1);
        const eventData = $(table).find('tr').map((i, row) => {
            const formattedData = {};
            formattedData.dateAndTime = $(row).children('td').eq(0).text();
            formattedData.title = $(row).children('td').eq(1).children("a").text();
            formattedData.fullTitle = $(row).children('td').eq(1).text();
            formattedData.link = $(row).children('td').eq(1).children("a").attr("href");
            formattedData.tags = $(row).children('td').eq(2).text();
            formattedData.priceAndAges = $(row).children('td').eq(3).text();
            formattedData.organizers = $(row).children('td').eq(4).text();
            formattedData.externalLinkTitle = $(row).children('td').eq(5).text();
            formattedData.externalLink = $(row).children('td').eq(5).children("a").attr("href");
            formattedData.sortDate = $(row).children('td').eq(6).children("div").text();
            return formattedData;
        }).get();
        await Promise.all(eventData.map(async (event) => {
            try {
                const url = event.link ? event.link : "w.N/A.w";
                const urlMod = await splitUrl(url);
                if (urlMod === "facebook") {
                    await getFacebookImage(url, function (source) {
                        event.imgSrc = source;
                    });
                } else {
                    event.imgSrc = "N/A"
                }
                return event;
            } catch (e) {
                console.log(e);
            }
        }));
        console.log(eventData);
        db.Event.insertMany(eventData, { ordered: false }, function(error, docs) {});
    } catch (e) {
        console.log(e.message);
    }
})();