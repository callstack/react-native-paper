/* eslint-disable strict, no-var, vars-on-top, prefer-template */

'use strict';

function createUrlForVersion(version) {
  const url = window.location.pathname;
  return url.replace(/react-native-paper\//, `react-native-paper/${version}/`);
}

function appendVersionBanner() {
  const html = `
    <style>
    .banner {
      margin: 0;
      padding: 12px;
      margin: 24px;
      border-radius: 3px;
      text-align: center;
      background-color: #f8f9fa;
      margin-right: 70px;
      
      @media (max-width: 640px) {
        margin-top: 72px;
      }
    }

    .menu-button {
      position: relative;
      font-size: 14px;
      padding: 3px 4px 4px 4px;
      margin-left: 2px;
      border-radius: 4px;
      color: #6200ee;
      transition: background-color 200ms;
      border: 1px solid #6200ee;
      display: inline-block;
      cursor: default;
    }

    .menu-button:hover {
      background-color: #efefef;
    }

    .menu-button:focus {
      outline-offset: -3px;
    }

    .menu-button:focus > ul {
      opacity: 1;
      pointer-events: auto;
    }

    .menu-wrapper {
      position: relative;
      display: inline-block;
      width: 0;
      height: 0;
    }

    .list {
      min-width: 110px;
      display: flex;
      position: absolute;
      z-index: 2;
      margin: 0;
      padding: 0;
      left: 0;
      top: 30px;
      list-style: none;
      flex-direction: column;
      background-color: #f8f9fa;
      box-shadow: 0px 2px 5px -1px #dedede;
      border-radius: 5px;
      overflow: hidden;
      opacity: 0;
      transition: opacity 150ms;
      pointer-events: none;
    }

    .list:focus-within {
      opacity: 1;
      pointer-events: auto;
    }

    .list:hover {
      opacity: 1;
    }

    .list-item {
      flex: 1;
      margin: 0;
      box-shadow: inset 0 1px 0 0 #efefef;
      text-align: left;
      display: flex;
    }

    .link {
      flex: 1;
      padding: 10px 5px;
      transition: background-color 250ms;
    }

    .link:hover {
      background-color: #efefef;
    }

    .link:focus {
      background-color: #efefef;
        outline-offset: -3px;
        outline-width: 3px;
    }
    </style>
    <div class="banner">
      Looking for the documentation for previous version? You can find it 
      <div tabindex="0" class="menu-button" role="button" aria-haspopup="true">
        here
        <ul class="list" role="menu">
          <li class="list-item">
            <a class="link" href="${createUrlForVersion(
              '1.0'
            )}" role="menuitem">v1.x</a>
          </li>
          <li class="list-item">
            <a class="link" href="${createUrlForVersion(
              '2.0'
            )}" role="menuitem">v2.x</a>
          </li>
        </ul>
      </div>
    </div>
  `;

  if (document.getElementById('version-banner')) return;

  const div = document.createElement('div');
  div.innerHTML = html;
  div.id = 'version-banner';

  const root = document.getElementById('root');

  if (root) {
    if (root.childNodes.length === 1) {
      const wrappingDiv = root.childNodes[0];
      if (wrappingDiv.childNodes.length === 2) {
        const targetDiv = wrappingDiv.childNodes[1];
        targetDiv.insertBefore(div, targetDiv.childNodes[0]);
      }
    }
  }
}

appendVersionBanner();

var mutationObserver = new MutationObserver(mutations => {
  mutations.forEach(appendVersionBanner);
});

mutationObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
