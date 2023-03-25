'use strict';
import init, { decrypt } from '@wk3368/rust-rsa-wasm-npm';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background onMessage', request)
  // Log message coming from the `request` parameter
  console.log(request.payload.message);
  handleMessage(request, sender).then((message) => {
    sendResponse({
      message
    })
  });
  return true; // return true to indicate you want to send a response asynchronously
});

async function handleMessage(request, sender) {
  if (request.type === 'GREETINGS') {
    var wasmPath = chrome.runtime.getURL("rust_rsa_wasm_npm_bg.wasm");
    await init(wasmPath)
    const decrypted = decrypt(request.payload.message);
    const message = `Hi ${ sender.tab ? 'Con' : 'Pop'
      }, I am from Background. The decrypted message is: ${ decrypted }`;
    console.log(message)
    return message
  }
}