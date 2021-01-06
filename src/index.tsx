import 'promise-polyfill/src/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { App } from './pages/index';
import * as serviceWorker from './serviceWorker';
import TagManager from 'react-gtm-module';
import {isElectron} from './utils/platform';
import { EduManager } from './sdk/education/manager';

if (isElectron) {
  EduManager.useElectron()
}

// // use gtm
// if (REACT_APP_AGORA_GTM_ID) {
//   !isElectron && TagManager.initialize({
//     gtmId: REACT_APP_AGORA_GTM_ID
//   })
// }

// ReactDOM.render(
//   <App />,
//   document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


// console.log("mountAgoraEduApp")
//@ts-ignore
window.mountAgoraEduApp = (id: string, basename: string) => {
  const dom = document.querySelector(`#${id}`)
  ReactDOM.render(
    <App basename={basename} />,
    dom
  )
}

export const AgoraApp = App;