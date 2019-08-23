// https://www.residentadvisor.net/images/events/flyer/2019/8/us-0822-1301172-front.jpg

const getResAdvisorImage = require("./link-splitting").getResAdvisorImage;
const splitUrl = require("./link-splitting").splitUrl;
const raUrl = "https://www.residentadvisor.net/events/1301172";

async function testShit(url) {
    try {
        const result = {};
        console.log(splitUrl(url));
        if (splitUrl(url) === "residentadvisor") {
            const source = await getResAdvisorImage(url);
            if (source === "Check") {
                console.log("Fix query selector");
            } else {
                result.imgSrc = source;
            }
        } else {
            console.log("Failed");
        }
        console.log(result);
    } catch (e) { console.log(e); }
}

testShit(raUrl);