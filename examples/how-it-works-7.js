var yld, readFile, read, yldRead;

yld = require('yld');
readFile = require('fs').readFile;

read = function* read(path) {
    var response, error, data;
    
    response = yield readFile(path, {}, this.nextCb);
    
    error = response[0];
    data = response[1];
    
    if (error) {
        yield this.throw(error);
    }
    
    console.log(data);
};

yldRead = yld(read);

yldRead(__filename);
