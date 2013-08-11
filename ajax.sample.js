var onFormSubmit, sendXHR;

onFormSubmit = function onFormSubmit(submitEvent) {
    var yldSendXHR, response, delay, notification;
 
    yldSendXHR = yield this.yld(sendXHR)({
        uri: "http://example.com/upload",
        body: document.querySelector('input').value,
        method: "POST"
    });
 
    while (response === undefined || response.status !== 200) {
        [delay, notification] = response === undefined ? [0, "Sending data..."] : [5000, "Server down, trying again in 5 seconds"];
 
        console.log(notification);
 
        response = yield setTimeout(yldSendXHR.send, delay);
    }
 
    yield console.log("Upload done : " + response.responseText);
}
 
sendXHR = function sendXHR(request) {
    var parent, method, xhr;
 
    parent = this.parent;
    method = request.method;
 
    xhr = new XMLHttpRequest();
    xhr.open(method, request.uri, true);
    
    if (['post', 'POST'].indexOf(method) > -1) {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
 
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            parent.send(this);
        }
    };
 
    yield parent.send(this);
 
    while (true) {
        yield xhr.send(request.body);
    }
}
 
document.querySelector('form').onsubmit = yld(onFormSubmit);
