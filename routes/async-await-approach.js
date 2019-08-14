const cheerio = require("cheerio");
const request = require("request-promise");

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
        console.log(eventData);
    } catch (error) {
        return error.message;
    }
})();