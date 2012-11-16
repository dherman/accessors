# accessors

A backwards-polyfill for the obsolete and non-standard `Object.__{define,lookup}{G,S}etter__` functions using ES5 API's.

# Usage

Just splat the contents of `accessors.js` anywhere during application setup, or include them with

```html
<script type="application/javascript" src="accessors.js"></script>
```
# Test

Install nodeunit:

```
$ npm install -g nodeunit
```

Run:

```
$ nodeunit tests.js
```

# License

MIT
