const getTicketWebImage = require("./link-splitting").getTicketWebImage;
const splitUrl = require("./link-splitting").splitUrl;
const twUrl = "https://www.ticketweb.com/event/bass-arena-a-strummers-tickets/9822795";
const twUrl2 = "https://www.ticketweb.com/event/neneh-cherry-davomakesbeats-swagger-like-august-hall-tickets/9716825?pl=august&edpPlParam=%3Fpl%3Daugust";

async function testShit(url) {
    try {
        const result = {};
        console.log(splitUrl(url));
        if (splitUrl(url) === "ticketweb") {
            const source = await getTicketWebImage(url);
            result.imgSrc = source;
        } else {
            console.log("Failed");
        }
        console.log(result);
    } catch (e) { console.log(e); }
}

testShit(twUrl2);