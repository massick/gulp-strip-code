var stripCode = require('../');
var fs = require('fs');
var should = require('should');
var Vinyl = require('vinyl');
require('mocha');

describe('gulp-replace', function() {
    describe('stripCode()', function() {
        it('should remove code from start_comment to end_comment on a buffer with default options', function(done) {
            var file = new Vinyl({
                path: 'test/fixtures/original-default.js',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/original-default.js')
            });
            var stream = stripCode();
            stream.on('data', function(newFile) {
                should.exist(newFile);
                should.exist(newFile.contents);
                String(newFile.contents).should.equal(fs.readFileSync('test/expected/modified-default.js', 'utf8'));
                done();
            });
            stream.write(file);
            stream.end();
        });
        it('should remove code from start_comment to end_comment on a buffer with default options on CRLF file', function(done) {
            var file = new Vinyl({
                path: 'test/fixtures/win-default.crlf',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/win-default.crlf')
            });
            var stream = stripCode();
            stream.on('data', function(newFile) {
                should.exist(newFile);
                should.exist(newFile.contents);
                String(newFile.contents).should.equal(fs.readFileSync('test/expected/win-modified.crlf', 'utf8'));
                done();
            });
            stream.write(file);
            stream.end();
        });
        it('should remove pattern', function(done) {
            var file = new Vinyl({
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
            var file = new Vinyl({
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
        it('should remove code from start_comment to end_comment but keep comments with the option specified and true', function(done) {
            var file = new Vinyl({
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
        it('should remove code from start_comment to end_comment with a block comment', function(done) {
            var file = new Vinyl({
                path: 'test/fixtures/originalremoveblockcomments.js',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/originalremoveblockcomments.js')
            });
            var stream = stripCode({
                start_comment: "test-code",
                end_comment: "end-test-code",
                comment_all: true
            });
            stream.on('data', function(newFile) {
                should.exist(newFile);
                should.exist(newFile.contents);
                String(newFile.contents).should.equal(fs.readFileSync('test/expected/modifiedremoveblockcomments.js', 'utf8'));
                done();
            });
            stream.write(file);
            stream.end();
        });
        it('should remove code from start_comment to end_comment without keeping comments with the option specified and false', function(done) {
            var file = new Vinyl({
                path: 'test/fixtures/originalkeepcomments.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/originalkeepcomments.css')
            });
            var stream = stripCode({
                start_comment: "keepcomments",
                end_comment: "end-keepcomments",
                keep_comments: false
            });
            stream.on('data', function(newFile) {
                should.exist(newFile);
                should.exist(newFile.contents);
                String(newFile.contents).should.equal('');
                done();
            });
            stream.write(file);
            stream.end();
        });
        it('should remove code from start_comment to end_comment without keeping comments with the option not specified', function(done) {
            var file = new Vinyl({
                path: 'test/fixtures/originalkeepcomments.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/originalkeepcomments.css')
            });
            var stream = stripCode({
                start_comment: "keepcomments",
                end_comment: "end-keepcomments"
            });
            stream.on('data', function(newFile) {
                should.exist(newFile);
                should.exist(newFile.contents);
                String(newFile.contents).should.equal('');
                done();
            });
            stream.write(file);
            stream.end();
        });
        it('should error on a stream', function(done) {
            var file = new Vinyl({
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
