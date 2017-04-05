var Crawler = require("simplecrawler");//爬蟲模組
let cheerio = require('cheerio');//parser html模組
var request = require("request");

var HOST = 'https://www.ptt.cc';


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
        
        var getMenu = function (url, callback, links) {
          var links = links || []; // Set default value for links (initial call)
          request(url, function (err, res, body) {
            if (!err && res.statusCode == 200) {
              var lastPage;
              var $ = cheerio.load(body); // Transform source to DOM object.
              $('div.r-ent a').each(function (i, e) { // Interate collections
                links.push($(e).attr('href'));
              });
              lastPage = $('a.wide:nth-child(2)').attr('href'); // Try to get the next page
              if (lastPage !== '/bbs/Gossiping/index1.html') {
                getMenu(HOST + lastPage, callback, links); // Pass this state as the beginning state in the next round.
              } else {
                callback(links);
          // the recursion is over.
              }
            }
          });
        };

        var getArticle = function (links, callback, contents) {
          contents = contents || [];
          if (links.length === 0) {
            callback(contents);
          }
          request(HOST + links[0], function (err, res, body) {
            if (!err && res.statusCode === 200) {
              console.log(body); // To resolve the mysterious behaviour on Windows, which the program quits immediately, still working on it.
              var $ = cheerio.load(body);
              var article = {
                author: $('div.article-metaline:nth-child(1) > span:nth-child(2)').text(),
              title: $('div.article-metaline:nth-child(3) > span:nth-child(2)').text(),
              publishedDate: $('div.article-metaline:nth-child(4) > span:nth-child(2)').text(),
              board: $('.article-metaline-right > span:nth-child(2)').text(),
              content: $('#main-content').children().remove().end().text()
          // end: revert back to main-content
              };
              contents.push(article);
              links = links.slice(1);
              getArticle(links, callback, contents);
            }
          });
        };




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
