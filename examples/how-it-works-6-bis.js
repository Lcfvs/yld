// this is a 

var yld, fct, fctBis, yielded;

yld = require('yld');
 
fct = function* fct(value) {
    var response, yieldedChild, child, delayedNext;
 
    response = value;
 
    yieldedChild = this.yld(fctBis); // ylds fctBis with this context as parent
    
    yield child = yieldedChild(); // stores the child scope
    
    delayedNext = child.next.bind(2000); // define a delay before each child.next()
 
    while (response !== 5) {
        console.log(response);
        
        response = yield delayedNext(response);
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
