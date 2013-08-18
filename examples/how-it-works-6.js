var fct, fctBis, yielded;
 
fct = function* fct(value) {
    var response, yieldedChild, child;
 
    response = value;
 
    yieldedChild = this.yld(fctBis); // ylds fctBis with this context as parent
    
    yield child = yieldedChild(); // stores the child scope
    
 
    while (response !== 5) {
        response = yield setTimeout(function () {
            console.log(response);
            child.next(response); // sends the new value to the next child context yield
        }, 2000);
    }
};
 
fctBis = function* fctBis() {
    var parent, response;
 
    parent = this.parent;
 
    while (true) {
        response = yield parent.next(response + 1); // sends the response to the parent context
    }
};

yielded = yld(fct);

yielded(1);
