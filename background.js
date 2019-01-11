// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({color: '#3aa757'}, function () {
        console.log('The color is green.');
    });
    chrome.storage.sync.get(['color'], data => {
        console.log(data);
    })
    /*chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'developer.chrome.com'},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });*/
});

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
    if (change.status === 'complete') {
        chrome.pageAction.show(tabId);
    }
});


// message
chrome.extension.onConnect.addListener(function(port) {
    console.log(port);
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
        port.postMessage("Hi Popup.js");
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender);
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting === "hello")
            sendResponse({farewell: "goodbye"});
    });