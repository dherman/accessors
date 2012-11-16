if (typeof Object.prototype.__defineGetter__ === 'undefined' && typeof Object.defineProperty === 'function') {
    (function(def, getOwn, proto) {
        function lookup(obj, k, def) {
            for (; obj; obj = proto(obj)) {
                var desc = getOwn(obj, k);
                if (desc)
                    return desc;
            }
        }

        function __defineGetter__(k, f) {
            if (typeof f !== 'function')
                throw new TypeError("expected function");
            k = k + "";
            var desc = getOwn(this, k) || { enumerable: true, configurable: true };
            desc.get = f;
            def(this, k, desc);
        }

        function __defineSetter__(k, f) {
            if (typeof f !== 'function')
                throw new TypeError("expected function");
            k = k + "";
            var desc = getOwn(this, k) || { enumerable: true, configurable: true };
            desc.set = f;
            def(this, k, desc);
        }

        function __lookupGetter__(k) {
            var desc = lookup(this, k + "");
            return desc ? desc.get : void 0;
        }

        function __lookupSetter__(k) {
            var desc = lookup(this, k + "");
            return desc ? desc.set : void 0;
        }

        function patch(k, v) {
            def(Object.prototype, k, { configurable: true, writable: true, value: v });
        }

        patch('__defineGetter__', __defineGetter__);
        patch('__defineSetter__', __defineSetter__);
        patch('__lookupGetter__', __lookupGetter__);
        patch('__lookupSetter__', __lookupSetter__);
    })(Object.defineProperty, Object.getOwnPropertyDescriptor, Object.getPrototypeOf);
}
