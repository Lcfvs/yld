var fct, yielded;
 
fct = function fct(value) {
    var self, response;
 
    self = this; // stores this context in a variable
    response = value;
 
    while (true) {
        // executed each 2 seconds
        response = yield setTimeout(function () {
            var newValue;
            
            newValue = response + 1;
            console.log(newValue);
            
            self.send(newValue); // sends the new value to the next context yield
        }, 2000);
    }
};

yielded = yld(fct);

yielded(1);
