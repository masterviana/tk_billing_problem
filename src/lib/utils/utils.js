

this.generateHashCode = function (text, callback) {
    var hashCode = new HashCode(text, callback);

    for (var i = 0; i < text.length  ; i++) {
        process.nextTick(function () {
            hashCode.calc();
        });
    }
};

this.removeEntry = function (obj, key) {
    var value = obj[key];
    value = null;
    return delete obj[key];
};

function HashCode(text, callback) {
    this.text = text;
    this.iteration = 0;
    this.result = 0;
    this.callback = callback;

    this.calc = function () {
        this.result += this.text.charCodeAt(this.iteration);
        this.iteration++;
        if (this.iteration == this.text.length) {
            this.callback(this.result);
        }
    }
};
