var es = require('event-stream');
var detectNewline = require('detect-newline');

module.exports = function (options) {
    var doStrip = function (file, callback) {
        var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
        var isBuffer = file.contents instanceof Buffer;

        if (isStream) {
          return callback(new Error('gulp-strip-code: Streaming not supported'), file);
        }

        if (options == null) {
            options = {};
        };

        options.start_comment = options.start_comment == null ? 'test-code' : options.start_comment;
        options.end_comment = options.end_comment == null ? 'end-test-code' : options.end_comment;
        options.keep_comments = options.keep_comments == null ? false : options.keep_comments;
        options.comment_all = options.comment_all == null ? false : options.comment_all;

        if (options.comment_all){
            var pattern = options.pattern || new RegExp("([\\t ]*\\/\\* ?" + options.start_comment + ")[\\s\\S]*?(" + options.end_comment + " ?\\*\\/[\\t ]*\\r?\\n?)", "g");
        } else{
            var pattern = options.pattern || new RegExp("([\\t ]*\\/\\* ?" + options.start_comment + " ?\\*\\/)[\\s\\S]*?(\\/\\* ?" + options.end_comment + " ?\\*\\/[\\t ]*\\r?\\n?)", "g");
        }

        var eol = detectNewline.graceful(String(file.contents));

        if (isBuffer) {
            if(options.keep_comments){
                file.contents = Buffer.from(String(file.contents).replace(pattern, "$1" + eol + "$2"));
            }
            else{
                file.contents = Buffer.from(String(file.contents).replace(pattern, ""));
            }
            return callback(null, file);
        }

        callback(null, file);
    };

    return es.map(doStrip);
};
