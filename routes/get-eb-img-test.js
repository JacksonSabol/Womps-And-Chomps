const getEventbriteImage = require("./link-splitting").getEventbriteImage;
const splitUrl = require("./link-splitting").splitUrl;
const evbrUrl = "https://www.eventbrite.com/e/adiidas-thrpy-more-soundpieces-sf-tickets-66535937781";

async function testShit(url) {
    try {
        const result = {};
        console.log(splitUrl(url));
        if (splitUrl(url) === "eventbrite") {
            const source = await getEventbriteImage(url);
            result.imgSrc = source;
        } else {
            console.log("Failed");
        }
        console.log(result);
    } catch (e) { console.log(e); }
}

testShit(evbrUrl);