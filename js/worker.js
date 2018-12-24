importScripts("../wasm/minifun_wasm.js");

var minifun_state;

// not ordinarily necessary, but for streaming WASM compilation to
// work it needs to be served with a content-type of application/wasm,
// which isn't always the case (eg with php -S), so we remove for now:
delete WebAssembly.instantiateStreaming;

wasm_bindgen('../wasm/minifun_wasm_bg.wasm').then(function() {
    minifun_state = wasm_bindgen.new_state();
    postMessage({ "type": "println", line: "minifun interpreter ready" });
    postMessage({ "type": "prompt", cont: false });

    onmessage = function(msg) {
        try {
            wasm_bindgen.add_line(minifun_state, msg.data);
        } catch(e) {
            console.log(e.stack);
            postMessage({ "type": "eprintln", line: "minifun interpreter crashed" });
            postMessage({ "type": "eprintln", line: e.toString() });
            postMessage({ "type": "eprintln", line: "This error was presumably caused by a stack overflow (too deep recursion)" });
        }
    }
}).catch(function(err) {
    postMessage({ "type": "eprintln", cont: err });
});

function minifun_println(line) {
    postMessage({ "type": "println", line: line });
}

function minifun_prompt(cont) {
    postMessage({ "type": "prompt", cont: cont });
}
