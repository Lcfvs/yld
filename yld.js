/*
Copyright 2013 Lcf.vs
Released under the MIT license
https://github.com/Lcfvs/yld
*/
var yld;
 
yld = (function () {
    'use strict';
    
    var slice, clearer, defer, prepare, yld;
    
    slice = Array.prototype.slice;
    
    clearer = {
        yld: {
            value: undefined
        },
        throw: {
            value: undefined
        }
    };
    
    Object.freeze(clearer);
    
    defer = typeof process === 'object' && typeof process.nextTick === 'function' ? process.nextTick : function nextTick(closure) {
        setTimeout(closure);
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
                    
                    return proto;
                };
            },
            next: function () {
                var args;
                
                args = arguments;
                
                defer(function () {
                    generator.next.apply(generator, args);
                });
            },
            nextCb: function () {
                proto.next(slice.call(arguments));
            },
            throw: function(error) {
                defer(function() {
                    fnGenerator.throw(typeof error === 'string' ? new Error(error) : error);
                });
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
