/*
Copyright 2013 Lcf.vs
Released under the MIT license
https://github.com/Lcfvs/yld
*/
var yld;
 
yld = (function () {
    var slice, defer, prepare, yld;
    
    slice = Array.prototype.slice;
    
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
                    var generator, proto;
                    
                    generator = prepare(parent);
                    proto = generator.next().value;
                    generator.next(generator);
                    generator.next(fn.apply(proto, arguments));
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
            set error(value) {
                defer(function() {
                    fnGenerator.throw(typeof value === 'string' ? new Error(value) : value);
                });
            }
        };
        
        if (parent !== undefined) {
            proto.parent = Object.create(parent, {
                yld: {
                    value: undefined
                },
                error: {
                    value: undefined
                }
            });
            
            Object.freeze(proto.parent);
        }
        
        generator = yield proto;
        fnGenerator = yield null;
        
        while (true) {
            response = yield defer(function () {
                fnGenerator.next(response);
            });
        }
        
        defer(function () {
            fnGenerator.close();
            generator.close();
        });
    };
    
    yld = function (fn) {
        return function () {
            var generator, proto;
            
            generator = prepare();
            proto = generator.next().value;
            generator.next(generator);
            generator.next(fn.apply(proto, arguments));
        };
    };
    
    return yld;
}());

if (typeof module === 'object' && module.exports !== undefined) {
    module.exports = yld;
}
