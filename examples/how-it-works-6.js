var fct, fctBis, yielded;
 
fct = function fct(value) {
    var response, yieldedChild, child;
 
    response = value;
 
    yieldedChild = this.yld(fctBis); // ylds fctBis with this context as parent
    
    child = yield yieldedChild(); // executes yieldedChild
 
    while (response !== 5) {
        response = yield setTimeout(function () {
            console.log(response);
            child.send(response); // sends the new value to the next child context yield
        }, 2000);
    }
};
 
fctBis = function fctBis() {
    var parent, response;
 
    parent = this.parent;
 
    response = yield parent.send(this); // sends this context to the parent context
 
    while (true) {
        response = yield parent.send(response + 1); // sends the response to the parent context
    }
};

yielded = yld(fct);

yielded(1);