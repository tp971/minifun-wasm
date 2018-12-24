(function() {
    var wasm;
    const __exports = {};


    let cachedTextDecoder = new TextDecoder('utf-8');

    let cachegetUint8Memory = null;
    function getUint8Memory() {
        if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory;
    }

    function getStringFromWasm(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
    }

    __exports.__wbg_minifunprintln_b03b06f7b187aee9 = function(arg0, arg1) {
        let varg0 = getStringFromWasm(arg0, arg1);

        varg0 = varg0.slice();
        wasm.__wbindgen_free(arg0, arg1 * 1);

        minifun_println(varg0);
    };

    __exports.__wbg_minifunprompt_664aa77d56c0bcd3 = function(arg0) {
        minifun_prompt(arg0 !== 0);
    };
    /**
    * @returns {State}
    */
    __exports.new_state = function() {
        return State.__wrap(wasm.new_state());
    };

    let cachedTextEncoder = new TextEncoder('utf-8');

    let WASM_VECTOR_LEN = 0;

    function passStringToWasm(arg) {

        const buf = cachedTextEncoder.encode(arg);
        const ptr = wasm.__wbindgen_malloc(buf.length);
        getUint8Memory().set(buf, ptr);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }
    /**
    * @param {State} arg0
    * @param {string} arg1
    * @returns {void}
    */
    __exports.add_line = function(arg0, arg1) {
        const ptr1 = passStringToWasm(arg1);
        const len1 = WASM_VECTOR_LEN;
        try {
            return wasm.add_line(arg0.ptr, ptr1, len1);

        } finally {
            wasm.__wbindgen_free(ptr1, len1 * 1);

        }

    };

    function freeState(ptr) {

        wasm.__wbg_state_free(ptr);
    }
    /**
    */
    class State {

        static __wrap(ptr) {
            const obj = Object.create(State.prototype);
            obj.ptr = ptr;

            return obj;
        }

        free() {
            const ptr = this.ptr;
            this.ptr = 0;
            freeState(ptr);
        }

    }
    __exports.State = State;

    __exports.__wbindgen_throw = function(ptr, len) {
        throw new Error(getStringFromWasm(ptr, len));
    };

    function init(path_or_module) {
        let instantiation;
        const imports = { './minifun_wasm': __exports };
        if (path_or_module instanceof WebAssembly.Module) {
            instantiation = WebAssembly.instantiate(path_or_module, imports)
            .then(instance => {
            return { instance, module: path_or_module }
        });
    } else {
        const data = fetch(path_or_module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            instantiation = WebAssembly.instantiateStreaming(data, imports);
        } else {
            instantiation = data
            .then(response => response.arrayBuffer())
            .then(buffer => WebAssembly.instantiate(buffer, imports));
        }
    }
    return instantiation.then(({instance}) => {
        wasm = init.wasm = instance.exports;

    });
};
self.wasm_bindgen = Object.assign(init, __exports);
})();
