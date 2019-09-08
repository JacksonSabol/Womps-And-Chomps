const getDnaLoungeImage = require("./link-splitting").getDnaLoungeImage;
const splitUrl = require("./link-splitting").splitUrl;
const dnaUrl = "https://www.dnalounge.com/calendar/2019/09-12.html";
const dnaUrl2 = "https://dnalounge.com/calendar/2019/09-07.html";

async function testShit(url) {
    try {
        const result = {};
        if (splitUrl(url) === "dnalounge") {
            getDnaLoungeImage(url, function (source) {
                result.imgSrc = source;
                console.log("result after", result);
            });
        } else {
            console.log("SplitURL Failed");
        }
        console.log(result);
    } catch (e) { console.log(e); }
}

testShit(dnaUrl2);