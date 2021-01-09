import 'promise-polyfill/src/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { App } from '@/monolithic/app';
import * as serviceWorker from '@/serviceWorker';
import TagManager from 'react-gtm-module';
import {isElectron} from '@/utils/platform';
import { EduManager } from '@/sdk/education/manager';
import {AgoraEduSDK} from '@/modular';

//@ts-ignore
window.AgoraEduSDK = AgoraEduSDK

if (isElectron) {
  EduManager.useElectron()
}

// // use gtm
// if (REACT_APP_AGORA_GTM_ID) {
//   !isElectron && TagManager.initialize({
//     gtmId: REACT_APP_AGORA_GTM_ID
//   })
// }

// appConfig: AppStoreConfigParams
// roomConfig: RoomParameters

ReactDOM.render(
  <App
    appConfig={{
      agoraAppId: `${REACT_APP_AGORA_APP_ID}`,
      agoraNetlessAppId: `${REACT_APP_NETLESS_APP_ID}`,
      agoraRestFullToken: window.btoa(`${REACT_APP_AGORA_CUSTOMER_ID}:${REACT_APP_AGORA_CUSTOMER_CERTIFICATE}`),
      sdkDomain: `${REACT_APP_AGORA_APP_SDK_DOMAIN}`,
      enableLog: true
    }}
  />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


// console.log("mountAgoraEduApp")
//@ts-ignore
// window.mountAgoraEduApp = (id: string, basename: string) => {
//   const dom = document.querySelector(`#${id}`)
//   ReactDOM.render(
//     <App basename={basename} />,
//     dom
//   )
// }

// export const AgoraApp = App;