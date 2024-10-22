let lastUpdated = 0;
function checkForUpdates() {
    // Get the relative base path from a data attribute on the body tag
    let basePath = document.body.dataset.basePath || '';
    const sentinelPath = `${basePath}sentinel.json`;

    fetch(sentinelPath)
        .then(response => response.json())
        .then(data => {
            if (lastUpdated === 0) {
                lastUpdated = data.last_updated;
            } else if (data.last_updated > lastUpdated) {
                location.reload();
            }
        });
}
if (window.location.hostname === 'localhost') {
    setInterval(checkForUpdates, 100); // Check every second
}
