yld
===

A JavaScript promises alternative, under the MIT License.


Concept :
---------

<strong>yld</strong> (pronounced "yielded") is tool based on that keyword.

Contrary to promises, which grow to declare a lot of functions to disorganize your code, <strong>yld</strong> allows you to execute instructions written in a linear list.

Each yield pauses the process and allows to retrieve a response from another function ... could easily be compared to a <strong>promise.then()</strong>.


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

```Javacript
var closure;

closure = function () {
    yield; // this makes a step
};
```

<strong>Retrieve a response form an other scope :</strong>

```Javacript
var closure

closure = function () {
    var response;

    response = yield;
};
```


The closure properties :
------------------------

<strong>Object this.parent</strong>

The parent yielded scope (parent.send() & parent.yld()), if current scope is created by this.yld(), else returns undefined

<strong>String set this.error()</strong>

Kills immediately the current process

```Javacript
var closure;

closure = function () {
    this.error = 'error message'; // throws the error message
    yield; // unreached point
};
```

<strong>Function this.send()</strong>

Send variables to the next yield response

```Javacript
var closure;

closure = function () {
    var response;

    this.send(123);
    response = yield; // response is 123
};
```

<strong>Function this.yld()</strong>

Your this context knows yld as internal method

```Javacript
var closure;

closure = function () {
    var yielded, response;
    
    yielded = this.yld(function (/* args */) {
        // here, the this.parent.send() is used to send a response to the parent scope
        this.parent.send(123);
    });
    
    response = yield yielded(/* args */); // response is 123
};
```


Requirements :
--------------

yield keyword support<br />
Optional named arguments<br />
ES5 Object methods
