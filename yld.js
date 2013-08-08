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
 
    prepare = function ({fn: fn, args: args, generator: generator, parent: parent}) {
        var proto, fnGenerator, response;
        
        proto = {
            yld: function (fn) {
                var namedArgs, generator, parent;
                
                namedArgs = {
                    fn: fn,
                    parent: this
                };
                
                return function () {
                    generator = prepare(namedArgs);
                    namedArgs.generator = generator;
                    return generator.next().apply(null, arguments);
                };
            },
            send: function () {
                var args;
                
                args = arguments;
                
                defer(function () {
                    var error;
                    
                    try {
                        generator.send.apply(generator, args);
                    } catch (error if error instanceof StopIteration) {}
                });
            },
            set error(value) {
                var error;
                
                error = new Error(value);
                
                throw {
                    name: 'YldError',
                    message: value,
                    toString: function () {
                        var stack;
                        
                        stack = error.stack;
                        
                        return this.message + '\n\nStack trace:\n\n' + stack.substring(stack.indexOf('\n') + 1);
                    }
                };
            }
        };
        
        if (parent !== undefined) {
            proto.parent = {
               send: parent.send,
               yld: parent.yld
            };
            
            Object.freeze(proto.parent);
        }
        
        Object.freeze(proto);
        
        yield function () {
            fnGenerator = fn.apply(proto, arguments);
            generator.next();
        };
        
        response = yield defer(function () {
            var error;
            
            try {
                fnGenerator.next();
            } catch (error if error instanceof StopIteration) {}
        });
        
        while (true) {
            response = yield defer(function () {
                var error;
                
                try {
                    fnGenerator.send.apply(fnGenerator, [response]);
                } catch (error if error instanceof StopIteration) {}
            });
        }
        
        defer(function () {
            fnGenerator.close();
            generator.close();
        });
    };
    
    yld = function (fn) {
        var namedArgs, generator;
        
        namedArgs = {
            fn: fn
        };
        
        return function () {
            generator = prepare(namedArgs);
            namedArgs.generator = generator;
            return generator.next().apply(null, arguments);
        };
    };
    
    return yld;
}());

if (typeof module === 'object' && module.exports !== undefined) {
    module.exports = yld;
}
