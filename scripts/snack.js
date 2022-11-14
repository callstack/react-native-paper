/* eslint-disable strict, no-var, vars-on-top, prefer-template */

'use strict';

function appendSnackLink() {
  var usage = document.getElementById('usage');

  if (usage) {
    var pre = usage.nextElementSibling;

    if (
      pre &&
      pre.firstChild.tagName === 'CODE' &&
      pre.firstChild.className === 'language-js'
    ) {
      var link;
      var insert = true;

      if (pre.nextElementSibling && pre.nextElementSibling.dataset.snack) {
        link = pre.nextElementSibling;
        insert = false;
      } else {
        link = document.createElement('a');
        link.dataset.snack = true;
        link.target = '_blank';
        link.innerHTML =
          'Try this example on Snack <svg width="14px" height="14px" viewBox="0 0 16 16" style="vertical-align: -1px"><g stroke="none" stroke-width="1" fill="none"><polyline stroke="currentColor" points="8.5 0.5 15.5 0.5 15.5 7.5"></polyline><path d="M8,8 L15.0710678,0.928932188" stroke="currentColor"></path><polyline stroke="currentColor" points="9.06944444 3.5 1.5 3.5 1.5 14.5 12.5 14.5 12.5 6.93055556"></polyline></g></svg>';
      }

      var heading = document.querySelector('h1');
      var href =
        'https://snack.expo.dev?name=' +
        encodeURIComponent(
          heading ? heading.textContent : document.title + ' Example'
        ) +
        '&description=' +
        encodeURIComponent(window.location.href) +
        '&code=' +
        encodeURIComponent(pre.textContent) +
        '&dependencies=react-native-paper%405.0.0-rc.10,@expo/vector-icons%40%5E13.0.0';

      if (link.href === href) {
        return;
      }

      link.href = href;

      if (insert) {
        pre.insertAdjacentElement('afterend', link);
      }
    }
  }
}

appendSnackLink();

var mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach(appendSnackLink);
});

mutationObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
