!function(){"use strict";let t=0;"localhost"===window.location.hostname&&setInterval((function(){let e=document.body.dataset.basePath||"";fetch(`${e}sentinel.json`).then((t=>t.json())).then((e=>{0===t?t=e.last_updated:e.last_updated>t&&location.reload()}))}),100)}();
//# sourceMappingURL=bundle-683799ee.js.map
