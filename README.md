yld
===

Forget your promises, adopt the <strong>yielded style programming</strong> !

This Node.js module is under the MIT License.


Concept :
---------

<strong>yld</strong> (pronounced "yielded") is tool based on that keyword.

Contrary to promises, which grow to declare a lot of functions to disorganize your code, <strong>yld</strong> allows you to execute instructions written in a linear list.

Each yield pauses the process and allows to retrieve a response from another function ... could easily be compared to a <strong>promise.then()</strong>.

This method of programming allows you to not have to pass the variables from one scope to another, to handle the response.

If you have already made the asynchronous JavaScript, you might know some techniques to treat the answer.

## The callbacks :

They allow you to treat a response after execution of an asynchronous function, in case of error or not.

Their defects have to have functions managing the success or failure and to push to use a lot of nested functions, affecting readability and pollute your function arguments space by callbacks.

To overcome this, another method has appeared, the promises.


## Promises :

Promises have a structure as to manage the success or failure of a function execution, to perform functions during the progression of the execution, etc..

They are distinguished by the fact that a promise is an object that you pass a whole bunch of functions via its methods to manage the different steps of execution.

So we end up with a lot of functions in the code, sometimes with internal references.

This tends to deconstruct your code so that it can become a real proofreading mental gymnastic.


## The yield keyword :

Keeping me up to date with advances in JavaScript, I discovered, among the future ECMAScript 6 standard proposals : the `yield` keyword.

This keyword, a special kind of `return`.

If You create a function that contains one or more `yield` keyword, no `return`, that function returns a generator.

The returned generator, understand by this as an instruction list contained by your function. That generator pauses at each `yield` it contains, until you call it the following yield, by using the `next()` method.

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

In fact, a `yield` seems as a 2 ways channel, while the first statement following `yield` returned by the `generator.next()` instruction, an affected variable by a `yield` is seen, finally, affected by one value passed to `​​generator.next()`.

This allows you to send a value ​​to the generator, at the current `yield` during the course of the generator.

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


## The yielded style programming :

Based on this discovery, I thought it should be possible to assign to the current context (scope)  variable, the result of an asynchronous function and then continue the process.

Thus was born **yld** (pronounced yielded).

It is a tool that allows you to turn a generator into a list of instructions that run one after the other, as if it were a simple function but waiting for the response of asynchronous functions when necessary.

In addition, it adds a notion of relationship between the different scopes and allows you to not have to pass the variables from one scope to another, to treat the response.


You can read the how-it-works & example files in the [examples directory](https://github.com/Lcfvs/yld/tree/master/examples).

As you can see, there are very few functions, you only pass the arguments your function need and, especially, the process stops at each `yield`, allowing you to retrieve a value on the same line the call to an asynchronous function, as if it wasn't.


## Notes :

The ES6 generators are a possibility of further improvement of JavaScript, to use **yld** in **Node.js**, you need a Node.js version >= 0.11.x, using the `--harmony` flag.



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

The parent yielded scope (parent.next()), if current scope is created by this.yld(), else returns undefined

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
