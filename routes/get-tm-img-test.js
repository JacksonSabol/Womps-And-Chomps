const getTicketmasterImage = require("./link-splitting").getTicketmasterImage;
const splitUrl = require("./link-splitting").splitUrl;
const tmUrl = "https://www.ticketmaster.com/event/1C0056D2D2F24F73";
const tmUrl2 = "https://www.ticketmaster.com/tycho-berkeley-california-09-06-2019/event/1C0056A7FA1A6AE2";
const tmUrl3 = "https://www.ticketmaster.com/massive-attack-san-francisco-california-09-07-2019/event/1C005561F19FAEB0";

async function testShit(url) {
    try {
        const result = {};
        console.log(splitUrl(url));
        if (splitUrl(url) === "ticketmaster") {
            const source = await getTicketmasterImage(url);
            const sourceSlice = source.split('').slice(26, -27).join('');
            const scaledImage = 'https://www.ticketmaster.com/compressedimages/' + sourceSlice + '_RETINA_PORTRAIT_16_9.jpg?width=600&height=400&fit=crop&auto=webp';
            result.imgSrc = scaledImage;
        } else {
            console.log("Failed");
        }
        console.log(result);
    } catch (e) { console.log(e); }
}

testShit(tmUrl3);