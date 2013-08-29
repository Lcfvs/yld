var fct, yielded;
 
fct = function* fct(value) {
    yield console.log(value + 1);
    
    // never reached, because nothing specifies to jump to the next yield
    console.log(value + 2);
};

yielded = yld(fct);

yielded(1);
