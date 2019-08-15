const getFacebookImage = require("./link-splitting").getFacebookImage;
const splitUrl = require("./link-splitting").splitUrl;
const testUrl = "https://www.facebook.com/events/378512979471107/";

function testShit(url) {
    const result = {};
    console.log("result before", result);
    if (splitUrl(url) === "facebook") {
        getFacebookImage(url, function (source) {
            result.imgSrc = source;
            console.log("result after", result);
        });
    } else {
        console.log("Failed");
    }
}
testShit(testUrl);