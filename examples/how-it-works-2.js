var fct, yielded;
 
fct = function* fct(value) {
    var newValue;
    
    newValue = value + 1;
    console.log(newValue);
    yield this.next(); // jumps to the next yield
   
    yield console.log(newValue + 1); // reached
};

yielded = yld(fct);

yielded(1);