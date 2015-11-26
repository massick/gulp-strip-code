var stripCode = require('../');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var should = require('should');
var gutil = require('gulp-util');
require('mocha');

var makeFile = function(contents) {
    return new gutil.File({
        path: 'test/file.txt',
        cwd: 'test/',
        base: 'test/',
        contents: contents
    });
};

describe('gulp-replace', function() {
    describe('stripCode()', function() {
        it('should remove pattern', function(done) {
            var file = new gutil.File({
                path: 'test/fixtures/original.js',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/original.js')
            });
            var stream = stripCode({
                pattern: / *console\.log\(['"a-z]+\);\n?/g
            });
            stream.on('data', function(newFile) {
                should.exist(newFile);
                should.exist(newFile.contents);
                String(newFile.contents).should.equal(fs.readFileSync('test/expected/modified.js', 'utf8'));
                done();
            });
            stream.write(file);
            stream.end();
        });
        it('should remove code from start_comment to end_comment on a buffer', function(done) {
            var file = new gutil.File({
                path: 'test/fixtures/original.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/original.css')
            });
            var stream = stripCode({
                start_comment: "(?!.*IT)(! i18n [A-Z]{2} start)",
                end_comment: "(?!.*IT)(! i18n [A-Z]{2} end)"
            });
            stream.on('data', function(newFile) {
                should.exist(newFile);
                should.exist(newFile.contents);
                String(newFile.contents).should.equal(fs.readFileSync('test/expected/modified.css', 'utf8'));
                done();
            });
            stream.write(file);
            stream.end();
        });
        it('should remove code from start_comment to end_comment on a buffer but keep comments', function(done) {
            var file = new gutil.File({
                path: 'test/fixtures/originalkeepcomments.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/originalkeepcomments.css')
            });
            var stream = stripCode({
                start_comment: "keepcomments",
                end_comment: "end-keepcomments",
                keep_comments: true
            });
            stream.on('data', function(newFile) {
                should.exist(newFile);
                should.exist(newFile.contents);
                String(newFile.contents).should.equal(fs.readFileSync('test/expected/modifiedkeepcomments.css', 'utf8'));
                done();
            });
            stream.write(file);
            stream.end();
        });
        it('should error on a stream', function(done) {
            var file = new gutil.File({
                path: 'test/fixtures/original.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.createReadStream('test/fixtures/original.css')
            });
            var stream = stripCode({
                pattern: "test"
            });
            stream.on('data', function() {
                throw new Error('Stream should not have emitted data event');
            });
            stream.on('error', function(err) {
                should.exist(err);
                done();
            });
            stream.write(file);
            stream.end();
        });
    });
});