
var request = require('request');
var cheerio = require('cheerio');

var HOST = 'https://www.ptt.cc';

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

