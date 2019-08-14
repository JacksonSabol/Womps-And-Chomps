const getFacebookImage = require("./link-splitting").getFacebookImage;
const testUrl = "https://www.facebook.com/events/378512979471107/";
const getSource = getFacebookImage(testUrl, function (source) {
    console.log(source);
});