# Files and descriptions
* _index.html_
  Where your HTML goes.
* _myapp.webmanifest_
  Where the details of your downloadable app goes.
* _script.js_ 
  The script that registers the service worker and allows the user to download the app from the browser.
* _service-worker.js_ 
  This is where you tell the app to cache certain files (store them locally). This is the most essential part of the PWA, we want it to work offline after we install it.

# FAQs
### How do I change the background image?
The background image is located at `img/background.jpg`. Replace this file with your own and save it under the same name. The file `css/style.css` controls the styling for the background image.

### The site is not loading my new content. What do I do?
There are two solutions:
1. Temporary
  Clear your browsers cache.
2. Long-term
  Delete the `<script src="script.js"></script>`. This will disable caching and we can put this back later. Be sure to clear the cache if you need to.

### How do I make sure the PWA is ready?
In Google Chrome, open up developer tools with `Ctrl+Shift+I`. From the top menus, select `Audits` and make sure that "Progressive Web App" and "Clear Storage" are checked, then click `Run Audits` (at the bottom of the page).