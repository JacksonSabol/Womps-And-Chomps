const getFacebookImage = require("./link-splitting").getFacebookImage;
const splitUrl = require("./link-splitting").splitUrl;
const prependMobileUrl = require("./link-splitting").prependMobileUrl;
const testUrl = "https://www.facebook.com/events/2371720199541455/";
const testData = [
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/516264802253206/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/1019484868260623/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/2371720199541455/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/1026484561075583/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/2768489606511085/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/2190373887660164/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/2326430160725899/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/382256719171609/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/850170008716287/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/2328053354115305/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/2147314488645514/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    },
    {
        _id: "5d5c4b3a2c52db2d3b3335ed",
        link: "https://www.facebook.com/events/348923762489860/",
        imgSrc: "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-0/p526x296/68751000_101076..."
    }
];

(async function () {
    try {
        const eventData = await Promise.all(testData.map(async (event) => {
            try {
                const url = event.link ? event.link : "w.N/A.w";
                const urlMod = await splitUrl(url);
                if (urlMod === "facebook") {
                    await getFacebookImage(url, function (source) {
                        event.imgSrc = source;
                    });
                } else {
                    event.imgSrc = "N/A"
                }
                return event;
            } catch (e) {
                console.log(e);
            }
        }));
        console.log(eventData);
        // const eventDataFiltered = eventData.filter(event => event.imgSrc !== "Removed");
        // console.log(eventDataFiltered);
    } catch (e) {
        console.log(e.message);
    }
})();

// function testShit(url) {
//     const result = {};
//     console.log("result before", result);
//     if (splitUrl(url) === "facebook") {
//         getFacebookImage(url, function (source) {
//             result.imgSrc = source;
//             console.log("result after", result);
//         });
//     } else {
//         console.log("Failed");
//     }
// }
// testShit(testUrl);