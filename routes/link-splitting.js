const testUrl = "https://www.facebook.com/events/359268348131279/";
const splitFBUrl = (url) => url.split('/')[4];
console.log(splitFBUrl(testUrl));

// img class= scaledImageFitWidth