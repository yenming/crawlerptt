var Crawler = require("simplecrawler");//爬蟲模組
let cheerio = require('cheerio');//parser html模組
var request = require("request");

var crawler = new Crawler("https://www.ptt.cc/bbs/Gossiping/index.html");//初始爬蟲網址



crawler.on("crawlstart", function() {
  console.log("Crawl starting");
});


crawler.on("fetchstart", function(queueItem) {
  console.log("fetchStart", queueItem);
});

//Simple Crawler Queue
crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {

        // parse html 轉成可以透過 cheerio 操作的格式
        var $ = cheerio.load(responseBuffer);
        // 取得值
        var title = $('h1').html();



});


crawler.on("complete", function() {
  console.log("Finished!");
});


crawler.start();


//＝＝＝＝＝＝＝＝＝＝＝＝＝Gossiping第一層的架構＝＝＝＝＝＝＝＝＝＝＝＝＝
// main-container
//     r-list-container action-bar-margin bbs-screen
//         r-ent
//         title
//         meta
//             date
//＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

//＝＝＝＝＝＝＝＝＝＝＝＝＝Gossiping第二層的架構＝＝＝＝＝＝＝＝＝＝＝＝＝
// main-content
    // article-metaline
    //     article-meta-value
    // article-metaline
    //     article-meta-value
    // push
    //     f3 push-content
    //     push-ipdatetime

//＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
