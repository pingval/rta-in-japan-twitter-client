if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let i=Promise.resolve();return r[e]||(i=new Promise((async i=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=i}else importScripts(e),i()}))),i.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},i=(i,r)=>{Promise.all(i.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(i)};self.define=(i,n,o)=>{r[i]||(r[i]=Promise.resolve().then((()=>{let r={};const s={uri:location.origin+i.slice(1)};return Promise.all(n.map((i=>{switch(i){case"exports":return r;case"module":return s;default:return e(i)}}))).then((e=>{const i=o(...e);return r.default||(r.default=i),r}))})))}}define("./service-worker.js",["./workbox-f7715658"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"config.json",revision:"fd121c2b66b80704cee8d9e07230cf21"},{url:"favicon.ico",revision:"27856041a8bcfebdfece67e2427fbff4"},{url:"images/discord-icon.png",revision:"2c21aeda16de354ba5334551a883b481"},{url:"images/horaro-icon.png",revision:"c08b8712a835a27b4a3a380897565a59"},{url:"images/rtainjapan-icon.png",revision:"842f71256f1606b88a4557751c6f41a4"},{url:"images/twitch-icon.png",revision:"81a84062338f780141305b6b31d617be"},{url:"images/twitter-icon.png",revision:"9fd9b71b3e7b1d485cf9082065fa3ae5"},{url:"index.html",revision:"32b7aa5be6f1f9a6c753f660c71f9505"},{url:"login/discord/index.html",revision:"2e9a132fb5e09c936911987dcf2ea40b"},{url:"logo128.png",revision:"2c9b2cefe0221de607ea3e190e953e1e"},{url:"logo512.png",revision:"757454cb7ac75c19690f183b0cb09b89"},{url:"main.js",revision:"7d1316f6c2b75745d815cab99c14f03d"},{url:"manifest.json",revision:"e2f386ba82f3516888338230f025575c"}],{})}));
//# sourceMappingURL=service-worker.js.map
