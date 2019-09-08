const getBigNeonImage = require("./link-splitting").getBigNeonImage;
const splitUrl = require("./link-splitting").splitUrl;
const bnUrl = "https://www.bigneon.com/events/the-joe-kay-experience-a-special-4-hour-set";
const bnUrl2 = "https://www.bigneon.com/events/matrixxman-jason-kendig-vin-sol/tickets";

async function testShit(url) {
    try {
        const result = {};
        console.log(splitUrl(url));
        if (splitUrl(url) === "bigneon") {
            getBigNeonImage(url, function (source) {
                result.imgSrc = source;
                console.log("result after", result);
            });
        } else {
            console.log("SplitURL Failed");
        }
        console.log(result);
    } catch (e) { console.log(e); }
}

testShit(bnUrl);