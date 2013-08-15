var fct, yielded;
 
fct = function* fct(value) {
    var response;
 
    response = yield this.next(value + 1); // sends some data to the next yield
    yield console.log(response + 2);
};

yielded = yld(fct);

yielded(1);