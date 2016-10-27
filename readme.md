# Dat Stats Demo Usage

1. Create Dat to demo locally (or clone the demo dat I used below)
2. Update link in `server.js` to be your dat link
3. (Recommended) Change hyperdrive chunk size, see details below.
4. Run demo:
  * `node server.js` to run the demo once.
  * `node demo.js` to run demo over and over. I used this [auto-refresh chrome extension](https://chrome.google.com/webstore/detail/auto-refresh/ifooldnmmcmlbdennkpdnlnbgbmfalko) to refresh page every 15 seconds to work with restarting demo.

## Hyperdrive Chunk Size

A larger chunk size makes the transfer 

Change [this line in hyperdrive](https://github.com/mafintosh/hyperdrive/blob/master/archive.js#L237): 

```js
var stream = pumpify(rabin(), bulk.obj(write, end))
```

To use a fixed size chunk:

```js
// I tried a few chunk sizes and found this one to be the nicest looking
var stream = pumpify(choppa(256 * 1024), bulk.obj(write, end))
```
