const jsdom = require("jsdom");
const { JSDOM } = jsdom;
function getFacebookImage(url, callback) {
    JSDOM.fromURL(`${url}`).then(dom => {
        const source = dom.window.document.querySelector(".scaledImageFitWidth").src;
        callback(source);
    });
}
module.exports = {
    getFacebookImage
};