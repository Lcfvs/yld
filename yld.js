/*
Copyright 2013 Lcf.vs
Released under the MIT license
https://github.com/Lcfvs/yld
*/
var yld;
 
yld = (function (global) {
    'use strict';
    
    var arraySlice, slice, defer, clearer, genNext, genThrow, prepare, yld;
    
    arraySlice = Array.prototype.slice;
    slice = arraySlice.call.bind(arraySlice);
    
    defer = (function () {
        var isNaN, abs, setImmediate, setTimeout, parseDelay, defer;
        
        isNaN = global.isNaN;
        abs = global.Math.abs;
        setImmediate = global.setImmediate || global.setTimeout;
        setTimeout = global.setTimeout;
        
        parseDelay = function parseDelay(value) {
            var delay;
            
            delay = parseInt(value);
            
            return !isNaN(delay) && abs(delay) === value ? value : undefined;
        };
        
        defer = function (fn, delay) {
            if (parseDelay(delay) !== undefined) {
                setTimeout(fn, delay);
            } else {
                setImmediate(fn);
            }
        };
        
        return defer;
    }());
    
    clearer = {
        yld: {
            value: undefined
        },
        throw: {
            value: undefined
        }
    };
    
    Object.freeze(clearer);
 
    genNext = function (value) {
        this.next(value);
    };
 
    genThrow = function (error) {
        this.throw(error);
    };
    prepare = function* (parent) {
        var proto, generator, fnGenerator, response;
        
        proto = {
            yld: function (fn) {
                var parent;
                
                parent = this;
                
                return function () {
                    var generator, proto, fnGenerator;
                    
                    generator = prepare(parent);
                    proto = generator.next().value;
                    generator.next(generator);
                    fnGenerator = fn.apply(proto, arguments);
                    generator.next(fnGenerator);
                    
                    return Object.create(proto, clearer);
                };
            },
            next: function (value) {
                defer(genNext.bind(generator, value), this);
            },
            nextCb: function () {
                defer(genNext.bind(generator, slice(arguments)), this);
            },
            throw: function(error) {
                defer(genThrow.bind(fnGenerator, error));
            }
        };
        
        if (parent !== undefined) {
            proto.parent = Object.create(parent, clearer);
        }
        
        generator = yield proto;
        fnGenerator = yield null;
        
        while (true) {
            response = yield defer(function () {
                fnGenerator.next(response);
            });
        }
    };
    
    yld = function (fn) {
        return function () {
            var generator, proto, fnGenerator;
            
            generator = prepare();
            proto = generator.next().value;
            generator.next(generator);
            fnGenerator = fn.apply(proto, arguments);
            generator.next(fnGenerator);
            
            return Object.create(proto, clearer);
        };
    };
    
    return yld;
}(typeof window === 'object' ? window : global));

if (typeof module === 'object' && module.exports !== undefined) {
    module.exports = yld;
}
