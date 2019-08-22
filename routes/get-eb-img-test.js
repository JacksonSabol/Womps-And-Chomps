const getEventbriteImage = require("./link-splitting").getEventbriteImage;
const splitUrl = require("./link-splitting").splitUrl;
const evbrUrl = "https://www.eventbrite.com/e/adiidas-thrpy-more-soundpieces-sf-tickets-66535937781";
const differentLayoutUrl = "https://www.eventbrite.com/e/hello-freaks-feat-born-dirty-bones-just-lucas-tickets-65329818245";
const brokenUrl = "https://www.eventbrite.com/e/summer-45-sessions-feat-dj-z-trip-tickets-57050426361";

async function testShit(url) {
    try {
        const result = {};
        console.log(splitUrl(url));
        if (splitUrl(url) === "eventbrite") {
            const source = await getEventbriteImage(url);
            if (source === "Removed") {
                console.log("Entry Removed");
            } else {
                result.imgSrc = source;
            }
        } else {
            console.log("Failed");
        }
        console.log(result);
    } catch (e) { console.log(e); }
}

testShit(differentLayoutUrl);