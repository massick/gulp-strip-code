var es = require('event-stream');

module.exports = function (options) {
    var doStrip = function (file, callback) {
        var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
        var isBuffer = file.contents instanceof Buffer;

        var pattern = options.pattern || new RegExp("[\\t ]*\\/\\* ?" + options.start_comment + " ?\\*\\/[\\s\\S]*?\\/\\* ?" + options.end_comment + " ?\\*\\/[\\t ]*\\n?", "g");

        if (isStream) {
            return callback(new Error('gulp-strip-code: Streaming not supported'), file);
        }

        if (isBuffer) {
            file.contents = new Buffer(String(file.contents).replace(pattern, ""));
            return callback(null, file);
        }

        callback(null, file);
    };

    return es.map(doStrip);
};
