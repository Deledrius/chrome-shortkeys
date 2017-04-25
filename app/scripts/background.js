'use strict';

function copyToClipboard(text) {
  var copyDiv = document.createElement('div');
  copyDiv.contentEditable = true;
  document.body.appendChild(copyDiv);
  copyDiv.innerHTML = text;
  copyDiv.unselectable = 'off';
  copyDiv.focus();
  document.execCommand('SelectAll');
  document.execCommand('Copy', false, null);
  document.body.removeChild(copyDiv);
}

function selectTab(direction) {
  browser.tabs.getAllInWindow(null, function(tabs) {
    if (tabs.length <= 1) {
      return;
    }
    browser.tabs.getSelected(null, function(currentTab) {
      var toSelect;
      switch (direction) {
        case 'next':
          toSelect = tabs[(currentTab.index + 1 + tabs.length) % tabs.length];
          break;
        case 'previous':
          toSelect = tabs[(currentTab.index - 1 + tabs.length) % tabs.length];
          break;
        case 'first':
          toSelect = tabs[0];
          break;
        case 'last':
          toSelect = tabs[tabs.length - 1];
          break;
      }
      browser.tabs.update(toSelect.id, { selected: true });
    });
  });
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var action = request.action;
  if (action === 'getKeys') {
    sendResponse(localStorage.shortkeys);
  }
  else if (action === 'cleardownloads') {
    browser.browsingData.remove({'since': 0}, {'downloads': true});
  }
  else if (action === 'nexttab') {
    selectTab('next');
  }
  else if (action === 'prevtab') {
    selectTab('previous');
  }
  else if (action === 'firsttab') {
    selectTab('first');
  }
  else if (action === 'lasttab') {
    selectTab('last');
  }
  else if (action === 'newtab') {
    browser.tabs.create({});
  }
  else if (action === 'closetab') {
    browser.tabs.getSelected(null, function(tab){
      browser.tabs.remove(tab.id);
    });
  }
  else if (action === 'clonetab') {
    browser.tabs.getSelected(null, function(tab){
      browser.tabs.duplicate(tab.id);
    });
  }
  else if (action === 'onlytab') {
    browser.tabs.query({ windowId: browser.windows.WINDOW_ID_CURRENT, pinned: false, active: false }, function(tabs){
      var ids = [];
      tabs.forEach(function(tab) {
        ids.push(tab.id);
      });
      browser.tabs.remove(ids);
    });
  }
  else if (action === 'togglepin') {
    browser.tabs.getSelected(null, function(tab){
      var toggle = !tab.pinned;
      browser.tabs.update(tab.id, { pinned: toggle });
    });
  }
  else if (action === 'copyurl') {
    copyToClipboard(request.text);
  }
  else if (action === 'movetableft') {
    if  (sender.tab.index > 0) {
      browser.tabs.move(sender.tab.id, {'index': sender.tab.index -1});
    }
  }
  else if (action === 'movetabright') {
    browser.tabs.move(sender.tab.id, {'index': sender.tab.index +1});
  }
  else if (action === 'gototab') {
    var createNewTab = function() {
      browser.tabs.create({url: request.openurl});
    };
    if (request.matchurl) {
      browser.tabs.query({url: request.matchurl, currentWindow: true}, function (tabs) {
        if (tabs.length > 0) {
          browser.tabs.update(tabs[0].id, {selected: true});
        } else {
          createNewTab();
        }
      });
    } else {
      createNewTab();
    }
  }
  else if (action === 'openbookmark') {
    browser.bookmarks.search({title: request.bookmark}, function (nodes) {
      var openNode;
      for (var i = nodes.length; i-- > 0;) {
        var node = nodes[i];
        if (node.url && node.title === request.bookmark) {
          openNode = node;
          break;
        }
      }
      browser.tabs.update(sender.tab.id, {url: decodeURI(openNode.url)});
    });
  }
  else {
    sendResponse({});
  }
});

