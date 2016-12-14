const {ActionButton} = require("sdk/ui/button/action");
const {Item, SelectorContext, SelectionContext}  = require("sdk/context-menu");
const tabs = require("sdk/tabs");

const SCIHUB_DOMAIN = require("sdk/simple-prefs").prefs['scihubDomain'];
const SCIHUB_SECURE = require("sdk/simple-prefs").prefs['scihubSecure'];
const PROTOCOL = (SCIHUB_SECURE ? "https" : "http");
const SCIHUB_URL = `${PROTOCOL}://${SCIHUB_DOMAIN}/`;
//const SEARCH_URL = `${PROTOCOL}://scholar.google.com.secure.${SCIHUB_DOMAIN}/scholar?q=`;
const SEARCH_URL = `${PROTOCOL}://scholar.google.com/scholar?q=`;
const Request = require("sdk/request").Request;

/* Context menu for opening a given link on sci-hub */
Item({
  label: `Open link on ${SCIHUB_DOMAIN}`,
  context: SelectorContext("a[href], button[href]"),
  contentScript: 'self.on("click", function (node) {' +
                 '  self.postMessage(node.href); });',
  onMessage: function(url) {
    tabs.open(SCIHUB_URL + url);
  }
});

/* Context menu for searching for the selected text on sci-hub */
Item({
  label: `Search ${SCIHUB_DOMAIN} for selection`,
  context: SelectionContext(),
  contentScript: 'self.on("click", function () {' +
                 '  self.postMessage(window.getSelection().toString()); });',
  onMessage: function(selection) {
//    var petition = Request({
//      url: SEARCH_URL,
//      request: selection
//    });
//
//    petition.post();
//    tabs.open(SCIHUB_URL + selection);
//    tabs.on('activate', function(tab) {
//      tab.url = "http://www.example.com";
//    });
    debugger;
//    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//    var request = new XMLHttpRequest();
//    request.open("POST", "https://www.googleapis.com/urlshortener/v1/url");
//    request.setRequestHeader("Content-Type", "application/json");
//    request.overrideMimeType("text/plain");
//    request.onload = function()
//    {
//        alert("Response received: " + request.responseText);
//    };
//    request.send('{"longUrl": "http://www.google.com/"}');
    var petition = Request({
      url: SCIHUB_URL,
      content: {},
      referer: SCIHUB_URL,
      onComplete: function (response) {
        console.log(response.text);
      }
    });
    petition["content"]["sci-hub-plugin-check"]='';
    petition["content"]["request"]=selection;
//    sci-hub-plugin-check : 'asdsa',
 //               request : selection

    petition.post();
//    tabs.open({
//      url: SCIHUB_URL,
//  //    content: {request : selection},
//      onOpen: function onOpen(tab) {
//        // do stuff like listen for content
//        // loading.
//    //    var petition = Request({
//    //      url: SEARCH_URL,
//    //      request: selection
//    //    });
//    
//    //    petition.get();
//  /*      exports.main = function() {
//            var Request = require("request").Request;
//            Request({
//              url: "http://google.com/",
//              content: {q: "test"},
//              onComplete: function (response) {
//                console.log(response.text);
//              }
//            }).post();
//        };*/
//
//      }
//    });
  }
});

/* Button for opening the current website on sci-hub */
var button = ActionButton({
  id: "scihub-link",
  label: `Open page on ${SCIHUB_DOMAIN}`,
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"},
  onClick: function(state) {
    tabs.open(SCIHUB_URL);
  }
});
