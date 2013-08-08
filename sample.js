var asyncFn, closure;
 
asyncFn = yld(function (closure, a, b) {
    var child, response;
    
    if (isNaN(a) || isNaN(b)) {
        // kills the process immediately
        this.error = 'Invalid values';
    }
    
    // this.yld is usable as yld
    child = yield this.yld(closure)(a);
    
    response = yield child.send(b);
    
    console.log(response); // 3
});

closure = function (a) {
    var b, parent;
    
    parent = this.parent;
    
    // returns this scope to the parent scope
    b = yield parent.send(this);
    
    // returns the response to the parent scope
    yield setTimeout(function () {
        parent.send(a + b);
    }, 3000);
};

asyncFn(closure, 1, 2);
