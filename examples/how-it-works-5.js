var yld, fct;

yld = require('yld');

fct = function* fct(value) {
    var self, response;
 
    self = this;
    response = value; // stores this context in a variable
 
    while (response !== 5) { // conditional yielded loop
        response = yield setTimeout(function () {
            var newValue;
            
            newValue = response + 1;
            console.log(newValue);
            
            self.next(newValue); // sends the new value to the next context yield
        }, 2000);
    }
};
