/*
Copyright 2013 Lcf.vs
Released under the MIT license
https://github.com/Lcfvs/yld
*/
var yld;
 
yld = (function () {
    'use strict';
    
    var arraySlice, slice, clearer, defer, genNext, genThrow, prepare, yld;
    
    arraySlice = Array.prototype.slice;
    slice = arraySlice.call.bind(arraySlice);
    
    clearer = {
        yld: {
            value: undefined
        },
        throw: {
            value: undefined
        }
    };
    
    Object.freeze(clearer);
    
    defer = typeof setImmediate === 'function' ? setImmediate : typeof process === 'object' && typeof process.nextTick === 'function' ? process.nextTick : setTimeout;
 
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
                defer(genNext.bind(generator, value));
            },
            nextCb: function () {
                defer(genNext.bind(generator, slice(arguments)));
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
}());

if (typeof module === 'object' && module.exports !== undefined) {
    module.exports = yld;
}
