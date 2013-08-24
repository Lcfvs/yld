var onFormSubmit, sendXHR;

onFormSubmit = function* onFormSubmit(submitEvent) {
    var yldSendXHR, response, delay, notification;
 
    yldSendXHR = yield this.yld(sendXHR)({
        uri: 'http://example.com/upload',
        body: document.querySelector('input').value,
        method: 'POST'
    });
 
    while (response === undefined || response.status !== 200) {
        if (response === undefined) {
            delay = 0;
            notification = 'Sending data...';
        } else {
            delay = 5000;
            notification = 'Server down, trying again in 5 seconds';
        }
 
        console.log(notification);
 
        response = yield setTimeout(yldSendXHR.next, delay);
    }
 
    yield console.log('Upload done : ' + response.responseText);
};
 
sendXHR = function* sendXHR(request) {
    var parent, method, xhr;
 
    parent = this.parent;
    method = request.method;
 
    xhr = new XMLHttpRequest();
    xhr.open(method, request.uri, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    if (method === 'post' || method === 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
 
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            parent.next(Object.create(this, {
                request: {
                    value: request,
                    enumerable: true
                }
            }));
        }
    };
 
    yield parent.next(this);
 
    while (true) {
        yield xhr.send(request.body);
    }
};
 
document.querySelector('form').onsubmit = yld(onFormSubmit);
