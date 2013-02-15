


describe("webpage.sendEvent", function() {

    var webpage = require("webpage").create();
    var url = "http://127.0.0.1:8083/charcode.html";

    function retrieveKeyCode(){
        var r = [result,
                 document.getElementById('txt').value
                 ];
        return r;
    }

    function resetKeyCode(){
       clearK();
    }
    function resetKeyCodeAndInit(){
       clearK();
       var t = document.getElementById('txt')
       t.value='abc';
       t.focus();
       t.selectionStart = t.selectionEnd = 1;
    }

    var r, key, input;

    function readResult() {
        r = webpage.evaluate(retrieveKeyCode);
        key = r[0]
        input = r[1]
    }

    it("tests wait after page loading",function() {
        var loaded = false;
        runs(function() {
            webpage.open(url, function(success){
                loaded = true;
            });
        });

        waitsFor(function(){ return loaded;}, 1000);
        runs(function(){
            readResult()
            expect(key.keydownK).toEqual(-1);
            expect(key.keydownC).toEqual(-1);
            expect(key.keypressK).toEqual(-1);
            expect(key.keypressC).toEqual(-1);
            expect(key.keyupK).toEqual(-1);
            expect(key.keyupC).toEqual(-1);
            expect(input).toEqual("");
        })
    });

    // ----------------------------------------------- single keycode/char

    it("send keydown event with a keycode of a printable char",function(done) {

        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keydown", webpage.event.key.A);
        readResult();
        expect(key.keydownK).toEqual(65);
        expect(key.keydownC).toEqual(0);
        expect(key.keypressK).toEqual(-1); // value with phantomjs is 65
        expect(key.keypressC).toEqual(-1); // value with phantomjs is 65
            // -> phantomjs generates a keypress event when we send a keydown event: inconsistent
        expect(key.keyupK).toEqual(-1);
        expect(key.keyupC).toEqual(-1);
        expect(input).toEqual(""); // phantomjs generate "A" (because of keypress event..)
    });

    it("send keypress event with a keycode of a printable char",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keypress", webpage.event.key.A);
        readResult();
        expect(key.keydownK).toEqual(-1); // value with phantomjs is 65
        expect(key.keydownC).toEqual(-1); // value with phantomjs is  0
        expect(key.keypressK).toEqual(0); // value with phantomjs is  65
        expect(key.keypressC).toEqual(65);
        expect(key.keyupK).toEqual(-1);// value with phantomjs is 65
        expect(key.keyupC).toEqual(-1);// value with phantomjs is 0
          // --> phantomjs generates a keydown + keyup event when we send a keypress event: inconsistent for a single char
        expect(input).toEqual("A");
    });

    it("send keyup event with a keycode of a printable char",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keyup", webpage.event.key.A);
        readResult();
        expect(key.keydownK).toEqual(-1);
        expect(key.keydownC).toEqual(-1);
        expect(key.keypressK).toEqual(-1);
        expect(key.keypressC).toEqual(-1);
        expect(key.keyupK).toEqual(65);
        expect(key.keyupC).toEqual(0);
        expect(input).toEqual("");
    });

    it("send keydown event with a keycode of a non-printable char",function(done) {
        webpage.evaluate(resetKeyCodeAndInit)
        webpage.sendEvent("keydown", webpage.event.key.Delete);
        readResult()
        expect(key.keydownK).toEqual(46);
        expect(key.keydownC).toEqual(0);
        expect(key.keypressK).toEqual(-1);
        expect(key.keypressC).toEqual(-1);
        expect(key.keyupK).toEqual(-1);
        expect(key.keyupC).toEqual(-1);
        expect(input).toEqual("abc"); // value with phantomjs is ac
                            // -> it should not delete the character since keypress is not already sent
    });

    it("send keypress event with a keycode of a non-printable char",function(done) {
        webpage.evaluate(resetKeyCodeAndInit);
        webpage.sendEvent("keypress", webpage.event.key.Delete);
        readResult()
        expect(key.keydownK).toEqual(-1); // value with phantomjs is 46
        expect(key.keydownC).toEqual(-1); // value with phantomjs is 0
        expect(key.keypressK).toEqual(46);// value with phantomjs is -1
        expect(key.keypressC).toEqual(0); // value with phantomjs is -1
        expect(key.keyupK).toEqual(-1);   // value with phantomjs is 46
        expect(key.keyupC).toEqual(-1);   // value with phantomjs is 0
        // -> phantomjs generates a keydown + keyup event when we send a keypress event: inconsistent

        expect(input).toEqual("ac");
    });

    it("send keyup event with a keycode of a non-printable char",function(done) {
        webpage.evaluate(resetKeyCodeAndInit);
        webpage.sendEvent("keyup", webpage.event.key.Delete);
        readResult()
        expect(key.keydownK).toEqual(-1);
        expect(key.keydownC).toEqual(-1);
        expect(key.keypressK).toEqual(-1);
        expect(key.keypressC).toEqual(-1);
        expect(key.keyupK).toEqual(46);
        expect(key.keyupC).toEqual(0);
        expect(input).toEqual("abc");
    });

    it("send keydown event with a keycode that don't match DOM keycode",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keydown", webpage.event.key.Ocircumflex);
        readResult()
        expect(key.keydownK).toEqual(0); // FIXME it should equal to a keycode, depending of the keyboard layout
        expect(key.keydownC).toEqual(0);
        expect(key.keypressK).toEqual(-1);
        expect(key.keypressC).toEqual(-1);
        expect(key.keyupK).toEqual(-1);
        expect(key.keyupC).toEqual(-1);
        expect(input).toEqual("");
    });

    it("send keypress event with a keycode that don't match DOM keycode",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keypress", webpage.event.key.Ocircumflex);
        readResult()
        expect(key.keydownK).toEqual(-1); // value with phantomjs is 0
        expect(key.keydownC).toEqual(-1); // value with phantomjs is 0
        expect(key.keypressK).toEqual(0); // value with phantomjs is -1
        expect(key.keypressC).toEqual(212); // value with phantomjs is -1
        expect(key.keyupK).toEqual(-1); // value with phantomjs is 0
        expect(key.keyupC).toEqual(-1); // value with phantomjs is 0
        expect(input).toEqual("Ô"); // value with phantomjs is ""
            // -> phantomjs generates a keydown + keyup event when we send a keypress event: inconsistent
    });


    it("send keyup event with a keycode that don't match DOM keycode",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keyup", webpage.event.key.Ocircumflex);
        readResult()
        expect(key.keydownK).toEqual(-1);
        expect(key.keydownC).toEqual(-1);
        expect(key.keypressK).toEqual(-1);
        expect(key.keypressC).toEqual(-1);
        expect(key.keyupK).toEqual(0); // FIXME it should equal to a keycode, depending of the keyboard layout
        expect(key.keyupC).toEqual(0);
        expect(input).toEqual("");
    });

    it("send keydown event with a string of a printable char that don't match a DOM keycode",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keydown", "a");
        readResult()
        expect(key.keydownK).toEqual(65);
        expect(key.keydownC).toEqual(0);
        expect(key.keypressK).toEqual(-1); // value with phantomjs is 97
        expect(key.keypressC).toEqual(-1); // value with phantomjs is 97
            // -> phantomjs generates a keypress event when we send a keydown event: inconsistent
        expect(key.keyupK).toEqual(-1);
        expect(key.keyupC).toEqual(-1);
        expect(input).toEqual("");  // value with phantomjs is "a"
    });

    it("send keypress event with a string of a printable char that don't match a DOM keycode",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keypress", "a");
        readResult()
        expect(key.keydownK).toEqual(-1);  // value with phantomjs is 65
        expect(key.keydownC).toEqual(-1);   // value with phantomjs is 0
        expect(key.keypressK).toEqual(0); // value with phantomjs is 97
        expect(key.keypressC).toEqual(97);
        expect(key.keyupK).toEqual(-1); // value with phantomjs is 65 
        expect(key.keyupC).toEqual(-1); // value with phantomjs is 0
            // -> phantomjs generates a keydown + keypress + keyup event when we send a keypress event: inconsistent for a single char

        expect(input).toEqual("a");
    });

    it("send keyup event with a string of a printable char that don't match a DOM keycode",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keyup", "a");
        readResult()
        expect(key.keydownK).toEqual(-1);
        expect(key.keydownC).toEqual(-1);
        expect(key.keypressK).toEqual(-1);
        expect(key.keypressC).toEqual(-1);
        expect(key.keyupK).toEqual(65);
        expect(key.keyupC).toEqual(0);
        expect(input).toEqual("");
    });

    it("send keydown event with a string of an accentued printable char",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keydown", "é");
        readResult()
        expect(key.keydownK).toEqual(0); // it should equal to a keycode, depending of the keyboard layout
        expect(key.keydownC).toEqual(0);
        expect(key.keypressK).toEqual(-1); // value with phantomjs is 233
        expect(key.keypressC).toEqual(-1); // value with phantomjs is 233
        expect(key.keyupK).toEqual(-1);
        expect(key.keyupC).toEqual(-1);
            // -> phantomjs generates a keypress event when we send a keydown event: inconsistent
        expect(input).toEqual(""); // value with phantomjs is "é"
    });

    it("send keypress event with a string of an accentued printable char",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keypress", "é");
        readResult()
        expect(key.keydownK).toEqual(-1); // value with phantomjs is 0 
        expect(key.keydownC).toEqual(-1); // value with phantomjs is 0
        expect(key.keypressK).toEqual(0);  // value with phantomjs is 233
        expect(key.keypressC).toEqual(233);
        expect(key.keyupK).toEqual(-1); // value with phantomjs is 0 
        expect(key.keyupC).toEqual(-1); // value with phantomjs is 0
        expect(input).toEqual("é");
    });

    it("send keyup event with a string of an accentued printable char",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keyup", "é");
        readResult()
        expect(key.keydownK).toEqual(-1);
        expect(key.keydownC).toEqual(-1);
        expect(key.keypressK).toEqual(-1);
        expect(key.keypressC).toEqual(-1);
        expect(key.keyupK).toEqual(0);// it should equal to a keycode, depending of the keyboard layout
        expect(key.keyupC).toEqual(0);
        expect(input).toEqual("");
    });

    it("send key event with a string",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keydown", "aBè");
        readResult()
        expect(key.keydownK).toEqual(65);
        expect(key.keydownC).toEqual(0);
        expect(key.keypressK).toEqual(-1);// value with phantomjs is 97
        expect(key.keypressC).toEqual(-1); // value with phantomjs is 97
        expect(key.keyupK).toEqual(-1);
        expect(key.keyupC).toEqual(-1);
            // -> phantomjs generates a keypress event when we send a keydown event: inconsistent
        expect(input).toEqual(""); // value with phantomjs is "aBé"
    });

    it("send key event with a string",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keypress", "aBè");
        readResult()
        expect(key.keydownK).toEqual([65,66,0]);
        expect(key.keydownC).toEqual([0,0,0]);
        expect(key.keypressK).toEqual([0,0,0]); // value with phantomjs is [97,66,232]
        expect(key.keypressC).toEqual([97,66,232]);
        expect(key.keyupK).toEqual([65,66,0]);
        expect(key.keyupC).toEqual([0,0,0]);
        expect(input).toEqual("aBè");
    });

    it("send key event with a string",function(done) {
        webpage.evaluate(resetKeyCode);
        webpage.sendEvent("keyup", "aBè");
        readResult()
        expect(key.keydownK).toEqual(-1);
        expect(key.keydownC).toEqual(-1);
        expect(key.keypressK).toEqual(-1);
        expect(key.keypressC).toEqual(-1);
        expect(key.keyupK).toEqual(65);
        expect(key.keyupC).toEqual(0);
        expect(input).toEqual("");
    });

    // ----------------------------------------------- shift + keycode/char


});


