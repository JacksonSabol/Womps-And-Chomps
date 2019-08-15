const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function splitUrl(url) { return url.split('.')[1] };

async function getFacebookImage(url, callback) {
    try {
        await JSDOM.fromURL(`${url}`).then(dom => {
            const source = dom.window.document.querySelector(".scaledImageFitWidth").src;
            callback(source);
        });
    } catch (e) {
        console.log(e);
    }
}
module.exports = {
    splitUrl,
    getFacebookImage
};