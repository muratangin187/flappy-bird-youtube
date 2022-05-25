const fs = require('fs');
const { ipcRenderer } = require('electron');

(async () => {
  const watcher = fs.watch('./renderer.js');
  watcher.on('change', () => {
    ipcRenderer.send('re-render');
  });
})();
