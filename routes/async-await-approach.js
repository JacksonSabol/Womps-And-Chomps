const axios = require("axios");

const getFacebookImage = require("./link-splitting").getFacebookImage;
const splitUrl = require("./link-splitting").splitUrl;

(async function () {
    try {
        const url = "/api/events/all";
        const eventData = await axios.get(url);
       
        // await Promise.all(eventData.map(async (event) => {
        //     try {
        //         const url = event.link ? event.link : "w.N/A.w";
        //         const urlMod = await splitUrl(url);
        //         if (urlMod === "facebook") {
        //             await getFacebookImage(url, function (source) {
        //                 event.imgSrc = source;
        //             });
        //         } else {
        //             event.imgSrc = "N/A"
        //         }
        //         return event;
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }));
        console.log(eventData);
        // db.Event.insertMany(eventData, { ordered: false }, function(error, docs) {});
    } catch (e) {
        console.log(e.message);
    }
})();