# Chrome Extension to bring new tabs to front

I would like new tabs to open with focus by default.
There are extensions that do just that.
However, there was an incident where the source of such an extension was changed and it now waits for input on web pages and sends them to a third-party server.

e.g. https://www.reddit.com/r/chrome/comments/1bz56x4/tabs_to_the_front_extension_suddenly_replaced_by/

There are alternatives, but they could end up in the same place...

Solution: Build your own

The source code of these extensions is fairly simple (and can be viewed), essentially just 3 lines of code.


Another reason to create a custom extension is customization.

There are times when you don't want to open the tabs focused (e.g. when you want to open multiple tabs from a search).

The current code adds a listener to all pages and checks to see if a link has been opened where the `meta` button has been clicked. If so, the new tab is not focused.

## Short description

- Opens new tabs focused
- `meta` + click on a link to open the tab not focused
  - `meta` key is `cmd` for mac

<!-- - shrinks new windows (and initial) to 1280x800 -->

## Add the extension to chromium based browsers

- go to `Manage extensions`
- enable `developer mode`
- click `load unpacked extension`
- select the folder that contains the `manifest.json` file

## Dev setup

```bash
yarn install
yarn watch
```

### other stuff

- `youtube.com` prevent `0-9` key from resetting video to `0:00` (0 is next to the right arrow key on some keyboards)

https://www.reddit.com/r/youtube/comments/ae3vja/how_to_disable_keyboard_shortcuts/

1. Download uBlock Origin Chrome extension
2. Click dashboard button (far right)
3. Click the "My Filters tab" and paste this filter: youtube.com##+js(addEventListener-defuser.js, keydown)
4. Apply Changes