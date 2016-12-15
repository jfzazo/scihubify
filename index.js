const {ActionButton} = require("sdk/ui/button/action");
const {Item, SelectorContext, SelectionContext}  = require("sdk/context-menu");
const tabs = require("sdk/tabs");

const SCIHUB_DOMAIN = require("sdk/simple-prefs").prefs['scihubDomain'];
const SEARCH_DOMAIN = require("sdk/simple-prefs").prefs['searchDomain'];
const SCIHUB_SECURE = require("sdk/simple-prefs").prefs['scihubSecure'];
const PROTOCOL = (SCIHUB_SECURE ? "https" : "http");
const SCIHUB_URL = `${PROTOCOL}://${SCIHUB_DOMAIN}/`;
const SEARCH_URL = `${SEARCH_DOMAIN}`;
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
    var petition = Request({
      url: SCIHUB_URL,
      content: {},
      referer: SCIHUB_URL,
      onComplete: function (response) {
        tabs.open(response);
      } 
    });
    petition["content"]["sci-hub-plugin-check"]='';
    petition["content"]["request"]=selection;
    petition.post();
  }
});


/* Context menu for searching for the selected text on scholar */
Item({
  label: `Search using a Research Search Engine for selection`,
  context: SelectionContext(),
  contentScript: 'self.on("click", function () {' +
                 '  self.postMessage(window.getSelection().toString()); });',
  onMessage: function(selection) {
    tabs.open(SEARCH_URL+selection);
  }
});

/* Button for opening the current website of sci-hub */
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
