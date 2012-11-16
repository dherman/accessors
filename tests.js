// Bye-bye.

delete Object.prototype.__defineGetter__;
delete Object.prototype.__defineSetter__;
delete Object.prototype.__lookupGetter__;
delete Object.prototype.__lookupSetter__;

// Hello.

require('./accessors.js');

exports.testMonkeyPatched = function(test) {
    test.ok(Object.prototype.hasOwnProperty('__defineGetter__'), "__defineGetter__ is present");
    test.ok(Object.prototype.hasOwnProperty('__defineSetter__'), "__defineSetter__ is present");
    test.ok(Object.prototype.hasOwnProperty('__lookupGetter__'), "__lookupGetter__ is present");
    test.ok(Object.prototype.hasOwnProperty('__lookupSetter__'), "__lookupSetter__ is present");
    test.done();
};

function g() {
    return 42;
}

function s() { }

exports.testDefineOwnGetter = function(test) {
    var o = {};
    o.__defineGetter__('foo', g);

    test.equal(o.__lookupGetter__('foo'), g, "got the getter we stored");
    test.strictEqual(o.__lookupSetter__('foo'), undefined, "no setter stored");
    test.equal(o.foo, 42, "got the result of the getter");
    test.ok(o.hasOwnProperty('foo'), "has own property");

    var desc = Object.getOwnPropertyDescriptor(o, 'foo');
    test.equal(desc && desc.get, g, "getter in property descriptor");
    test.strictEqual(desc && desc.set, undefined, "no setter in property descriptor");

    test.done();
};

exports.testDefineOwnSetter = function(test) {
    var o = {};
    o.__defineSetter__('foo', s);

    test.equal(o.__lookupSetter__('foo'), s, "got the setter we stored");
    test.strictEqual(o.__lookupGetter__('foo'), undefined, "no getter stored");
    test.strictEqual(o.foo, undefined, "without getter, getting produces undefined");
    test.ok(o.hasOwnProperty('foo'), "has own property");

    var desc = Object.getOwnPropertyDescriptor(o, 'foo');
    test.equal(desc && desc.set, s, "setter in property descriptor");
    test.strictEqual(desc && desc.get, undefined, "no getter in property descriptor");

    test.done();
};

exports.testDefineOwnGetterSetter = function(test) {
    var o = {};
    o.__defineGetter__('foo', g);
    o.__defineSetter__('foo', s);

    test.equal(o.__lookupGetter__('foo'), g, "got the getter we stored");
    test.equal(o.__lookupSetter__('foo'), s, "got the setter we stored");
    test.equal(o.foo, 42, "got the result of the getter");
    test.ok(o.hasOwnProperty('foo'), "has own property");

    var desc = Object.getOwnPropertyDescriptor(o, 'foo');
    test.equal(desc && desc.get, g, "getter in property descriptor");
    test.equal(desc && desc.set, s, "setter in property descriptor");

    test.done();
};

exports.testDefineProtoGetter = function(test) {
    var p = {};
    var o = Object.create(p);

    p.__defineGetter__('foo', g);

    test.equal(p.__lookupGetter__('foo'), g, "got the getter we stored");
    test.equal(o.__lookupGetter__('foo'), g, "got the getter we stored");
    test.strictEqual(o.__lookupSetter__('foo'), undefined, "no setter stored");
    test.ok(p.hasOwnProperty('foo'), "proto has own property");
    test.ok(!o.hasOwnProperty('foo'), "object does not have own property");
    test.ok('foo' in o, "property in object");
    test.equal(p.foo, 42, "calling getter on proto");
    test.equal(o.foo, 42, "calling getter on object");

    test.strictEqual(Object.getOwnPropertyDescriptor(o, 'foo'), undefined, "no own property descriptor in object");

    var desc = Object.getOwnPropertyDescriptor(p, 'foo');
    test.equal(desc && desc.get, g, "getter in property descriptor");
    test.strictEqual(desc && desc.set, undefined, "no setter in property descriptor");

    test.done();
};

exports.testDefineProtoSetter = function(test) {
    var p = {};
    var o = Object.create(p);

    p.__defineSetter__('foo', s);

    test.equal(p.__lookupSetter__('foo'), s, "got the setter we stored");
    test.equal(o.__lookupSetter__('foo'), s, "got the setter we stored");
    test.strictEqual(o.__lookupGetter__('foo'), undefined, "no getter stored");
    test.ok(p.hasOwnProperty('foo'), "proto has own property");
    test.ok(!o.hasOwnProperty('foo'), "object does not have own property");
    test.ok('foo' in o, "property in object");

    test.strictEqual(Object.getOwnPropertyDescriptor(o, 'foo'), undefined, "no own property descriptor in object");

    var desc = Object.getOwnPropertyDescriptor(p, 'foo');
    test.equal(desc && desc.set, s, "setter in property descriptor");
    test.strictEqual(desc && desc.get, undefined, "no getter in property descriptor");

    test.done();
};

exports.testDefineProtoGetterSetter = function(test) {
    var p = {};
    var o = Object.create(p);

    p.__defineGetter__('foo', g);
    p.__defineSetter__('foo', s);

    test.equal(p.__lookupGetter__('foo'), g, "got the getter we stored");
    test.equal(o.__lookupGetter__('foo'), g, "got the getter we stored");
    test.equal(p.__lookupSetter__('foo'), s, "got the setter we stored");
    test.equal(o.__lookupSetter__('foo'), s, "got the setter we stored");
    test.ok(p.hasOwnProperty('foo'), "proto has own property");
    test.ok(!o.hasOwnProperty('foo'), "object does not have own property");
    test.ok('foo' in o, "property in object");
    test.equal(p.foo, 42, "calling getter on proto");
    test.equal(o.foo, 42, "calling getter on object");

    test.strictEqual(Object.getOwnPropertyDescriptor(o, 'foo'), undefined, "no own property descriptor in object");

    var desc = Object.getOwnPropertyDescriptor(p, 'foo');
    test.equal(desc && desc.get, g, "getter in property descriptor");
    test.equal(desc && desc.set, s, "getter in property descriptor");

    test.done();
};

exports.testDefineOwnGetterProtoSetter = function(test) {
    var p = {};
    var o = Object.create(p);

    o.__defineGetter__('foo', g);
    p.__defineSetter__('foo', s);

    test.strictEqual(p.__lookupGetter__('foo'), undefined, "no getter on proto");
    test.equal(o.__lookupGetter__('foo'), g, "got the getter we stored");
    test.equal(p.__lookupSetter__('foo'), s, "got the setter we stored");
    test.strictEqual(o.__lookupSetter__('foo'), undefined, "no setter on object");
    test.ok(p.hasOwnProperty('foo'), "proto has own property");
    test.ok(o.hasOwnProperty('foo'), "object has own property");
    test.ok('foo' in o, "property in object");
    test.strictEqual(p.foo, undefined, "without getter, proto produces undefined");
    test.equal(o.foo, 42, "calling getter on object");

    var desc = Object.getOwnPropertyDescriptor(p, 'foo');
    test.strictEqual(desc && desc.get, undefined, "no getter in proto property descriptor");
    test.equal(desc && desc.set, s, "setter in proto property descriptor");

    var desc = Object.getOwnPropertyDescriptor(o, 'foo');
    test.equal(desc && desc.get, g, "getter in object property descriptor");
    test.strictEqual(desc && desc.set, undefined, "no setter in object property descriptor");

    test.done();
};

exports.testDefineOwnSetterProtoGetter = function(test) {
    var p = {};
    var o = Object.create(p);

    p.__defineGetter__('foo', g);
    o.__defineSetter__('foo', s);

    test.equal(p.__lookupGetter__('foo'), g, "got the getter we stored");
    test.strictEqual(o.__lookupGetter__('foo'), undefined, "no getter on object");
    test.strictEqual(p.__lookupSetter__('foo'), undefined, "no setter on proto");
    test.equal(o.__lookupSetter__('foo'), s, "got the setter we stored");
    test.ok(p.hasOwnProperty('foo'), "proto has own property");
    test.ok(o.hasOwnProperty('foo'), "object has own property");
    test.ok('foo' in o, "property in object");
    test.equal(p.foo, 42, "calling getter on proto");
    test.strictEqual(o.foo, undefined, "without getter, object produces undefined");

    var desc = Object.getOwnPropertyDescriptor(p, 'foo');
    test.equal(desc && desc.get, g, "getter in proto property descriptor");
    test.strictEqual(desc && desc.set, undefined, "no setter in proto property descriptor");

    var desc = Object.getOwnPropertyDescriptor(o, 'foo');
    console.log(desc);
    test.strictEqual(desc && desc.get, undefined, "no getter in object property descriptor");
    test.equal(desc && desc.set, s, "setter in object property descriptor");

    test.done();
};

exports.testLookupDescriptorGetter = function(test) {
    var o1 = {}, o2 = {};

    Object.defineProperty(o1, 'foo', { get: g });
    Object.defineProperty(o2, 'foo', { set: s });

    test.equal(o1.__lookupGetter__('foo'), g, "lookup gets getter from descriptor");
    test.strictEqual(o2.__lookupGetter__('foo'), undefined, "lookup gets undefined from descriptor with no getter");

    test.done();
};

exports.testLookupDescriptorSetter = function(test) {
    var o1 = {}, o2 = {};

    Object.defineProperty(o1, 'foo', { set: s });
    Object.defineProperty(o2, 'foo', { get: g });

    test.equal(o1.__lookupSetter__('foo'), s, "lookup gets setter from descriptor");
    test.strictEqual(o2.__lookupSetter__('foo'), undefined, "lookup gets undefined from descriptor with no getter");

    test.done();
};
