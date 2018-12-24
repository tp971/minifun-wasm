use wasm_bindgen::prelude::*;
use libminifun::{Scope, Token, TokenInfo};
use libminifun::parser::{Parser, ParserError};
use std::io::Read;

#[wasm_bindgen]
extern {
    fn minifun_println(s: String);
    fn minifun_prompt(cont: bool);
}

#[wasm_bindgen]
pub struct State {
    scope: Scope,
    row: usize,
    col: usize,
    buf: Vec<u8>
}

#[wasm_bindgen]
pub fn new_state() -> State {
    State {
        scope: Scope::new(),
        row: 1,
        col: 1,
        buf: Vec::new()
    }
}

#[wasm_bindgen]
pub fn add_line(state: &mut State, line: &str) {
    for next in line.bytes() {
        state.buf.push(next);
    }
    state.buf.push(b'\n');

    loop {
        //minifun_println(format!("buf: {:?}", state.buf.as_slice()));
        let mut parser = Parser::with_offset(
            "stdin".to_string(), state.buf.as_slice().bytes(), state.row, state.col);
        match &parser.parse_stmt_eof() {
            Ok(Some(stmt)) => {
                match stmt.eval(&mut state.scope) {
                    Ok(Some(val)) =>
                        minifun_println(format!("{}", val)),
                    Ok(None) =>
                        {},
                    Err(e) =>
                        minifun_println(format!("{}", e))
                }
            },
            Ok(None) => {
                state.row = parser.row();
                state.col = parser.col();
                drop(parser);
                state.buf.clear();
                break;
            },
            Err(ParserError::Unexpected(TokenInfo { token: Token::EOF, .. }, _)) => {
                minifun_prompt(true);
                return;
            },
            Err(err) => {
                minifun_println(format!("{}", err));
                parser.skipline();
            },
        }
        state.row = parser.row();
        state.col = parser.col();

        let mut buf2 = Vec::new();
        if let Some(ch) = parser.ch() {
            if ch == '\r' || ch == '\n' {
                state.row -= 1;
            }

            let mut buf = [0; 4];
            for b in ch.encode_utf8(&mut buf).bytes() {
                buf2.push(b);
            }
        }
        for ch in parser.into_iter() {
            buf2.push(ch.unwrap());
        }
        state.buf = buf2;
    }

    minifun_prompt(false);
}
