yld
===

Forget your promises, adopt the <strong>yielded programming style</strong> !

This Node.js module is under MIT License.


Install
-------
`$ npm install yld`


Concept
-------

<strong>yld</strong> (pronounced "yielded") is a tool based on that keyword.

Contrary to promises, where developers add functions and disorganize their code, <strong>yld</strong> allows you to execute instructions linearly.

Each `yield` pauses the process and allows to retrieve a response from another function ... this is comparable to `promise.then()`.

This programming method avoids to pass the variables from scope to scope, to handle the response.

If you have already tried to use JavaScript asynchonously, you have certainly thought about some answers to these issues.


### Callbacks

They often share variables needed to treat the response.

Their other inconvenients are that you have to create functions to handle the success or failure and to forward the result to calling functions. This affects the readability of your code and pollutes it with additional argument.

In order to avoid that, the promises appeared.


### Promises

Promises adds a structure to manage the function result, to run functions during the execution, etc..

They are distinguished by the fact that a promise is an object tthough which methods you pass a whole bunch of functions to handle the execution steps.

So you end up with a lot of functions, themselves sharing internal references.

Thus puzzling your code.


### The yield keyword

Reading the future ECMAScript 6 [specification](http://wiki.ecmascript.org/doku.php?id=harmony:generators), I found an interesting keyword proposal : the `yield`.

The `yield` keyword si a new kind of `return`.

If you create a function containing one or more `yield`, that function returns a generator.

Note the asterisk following the `function` word.

The returned generator can be considered as the instruction lists contained by your function. The generator pauses at each `yield` until you call the `next()` method.

``` JavaScript
var generate, generator;
 
generate = function* generate(value) {
    var message;

    message = 'Hello';
    yield message;
    yield message + ' ' + value;
};
 
generator = generate('World');

// writes "Hello"
console.log(generator.next());

// calls the next yield, after 2 seconds
setTimeout(function () {
    // writes "Hello World" in your console, after the 2 seconds
    console.log(generator.next());
}, 2000);
```

In fact, `yield` builds a two ways communication : the first statement following `yield` is returned by `next()` and the variable passed to the second `next(variable)` is affected to the `yield` left `=` operand.

This allow you to send a value to the generator from the current `yield` and to receive a value there.

``` JavaScript
var generate, generator;
 
generate = function* generate() {
    var message, response;
 
    message = 'Hello';
    response = yield message;
    yield message + ' ' + response;
};
 
generator = generate();
 
// writes "Hello"
console.log(generator.next());
 
// sends some data to the current yield point, after the 2 seconds
setTimeout(function () {
    // sends "World" to the current yield & writes "Hello World" in your console, after the 2 seconds
    console.log(generator.next('World'));
}, 2000);
```

Finally, the generators also have a `close()` method to free the memory used by the generator, & a `throw()` method to throw an error.


### The yielded programming style

Therefore, I thought it could be possible to assign to the current context (scope) variable the result of an asynchronous function and then continue the process.

Thus, **yld** was born.

This is a tool that allows you to transform a generator into an instruction list that run one after the other, as if it were a simple function but waiting for the response of asynchronous functions when necessary.

Moreover, it adds a relationship notion between the different scopes and allows you to avoid passing the variables from one scope to another in order to treat the response.


You can see how it works and find exemple files in the [examples folder](https://github.com/Lcfvs/yld/tree/master/examples).

As you can see, this requires few functions. You only pass the arguments your function needs and, the process stops at each yield, allowing you to retrieve a value on the same line as the asynchronous function call.


### Notes :

The ES6 generators are still a feature to come in JavaScript. To use **yld** in Node.js, you need a **Node.js version >= 0.11.x**, using the **--harmony flag**.



The yld function :
------------------

```JavaScript
var yielded = yld(closure);
yielded(/* closure arguments */);
```

<dl>
  <dt>
    Function <strong>yld()</strong>
  </dt>
  <dd>
    Returns a yielded function used to call the closure, asynchronously
  </dd>
  <dt>
    <strong>Arguments :</strong>
  </dt>
  <dd>
    <dl>
      <dt>
        Function <strong>closure()</strong>
      </dt>
      <dd>
        Your function to be called, asynchronously
      </dd>
    </dl>
  </dd>
  <dt>
    <strong>Return :</strong>
  </dt>
  <dd>
    <dl>
      <dt>
        Function <trong>yielded()</strong>
      </dt>
      <dd>
        A function to execute your closure, with the arguments of your choice
      </dd>
    </dl>
  </dd>
</dl>


The closure structure :
-----------------------

<strong>Create a step :</strong>

```JavaScript
var closure;

closure = function () {
    yield; // this makes a step
};
```

<strong>Retrieve a response form an other scope :</strong>

```JavaScript
var closure

closure = function () {
    var response;

    response = yield;
};
```


The closure properties :
------------------------

<strong>Object this.parent</strong>

The parent yielded scope (parent.yld & parent.error are unavailable. Each scope treats them itself)


<strong>String set this.error()</strong>

Kills immediately the current process

```JavaScript
var closure;

closure = function () {
    this.error = 'error message'; // throws the error message
    yield; // unreached point
};
```

<strong>Function this.next()</strong>

Sends variables to the next yield response

```JavaScript
var closure;

closure = function () {
    var response;

    this.next(123);
    response = yield; // response is 123
};
```

<strong>Function this.nextCb()</strong>

Sends variables to the next yield response, usable to retrieve callback arguments

It's a fallback until the appearance of destructuring assignments

See [how-it-works-7.js](https://github.com/Lcfvs/yld/blob/master/examples/how-it-works-7.js)


<strong>Function this.yld()</strong>

Your this context knows yld as internal method

```JavaScript
var closure;

closure = function () {
    var yielded, response;
    
    yielded = this.yld(function (/* args */) {
        // here, the this.parent.next() is used to send a response to the parent scope
        this.parent.next(123);
    });
    
    response = yield yielded(/* args */); // response is 123
};
```


Requirements :
--------------

ES6 Generators support
