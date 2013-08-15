/*
Copyright 2013 Lcf.vs
Released under the MIT license
https://github.com/Lcfvs/yld
*/
var yld;
 
yld = (function () {
    var defer, prepare, yld;
    
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
            next: function (value) {
                defer(function () {
                    generator.next(value);
                });
            },
            set error(value) {
                defer(function() {
                    fnGenerator.throw(typeof value === 'string' ? new Error(value) : value);
                });
            }
        };
        
        if (parent !== undefined) {
            proto.parent = {
               next: parent.next
            };
            
            Object.freeze(proto.parent);
        }
        
        Object.freeze(proto);
        
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