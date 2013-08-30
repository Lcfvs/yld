var yld, goto;

yld = require('yld');

goto = function* () {
    var response;

    while (!(response instanceof Error)) {
        switch (response) {
            case undefined:
                console.log('started');
                response = yield this.next('label_0');
            break;
            
            case 'label_0':
                console.log('label_0');
                response = yield this.next('label_2');
            break;
            
            case 'label_1':
                console.log('label_1');
                response = yield this.next(new Error());
            break;
            
            case 'label_2':
                console.log('label_2');
                response = yield this.next('label_1');
            break;
        }
    }
    
    this.throw(response);
};

yld(goto)();
