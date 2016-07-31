/// <reference path="../../../typings/globals/emscripten/index.d.ts" />

namespace ttLibJs {
    declare function _theoraEncoder_make(
        width:number,
        height:number
    ):number;

    declare function _theoraEncoder_encode(
        encoder:number,
        y:number,
        ySize:number,
        u:number,
        uSize:number,
        v:number,
        vSize:number,
        callback:number
    ):boolean;

    declare function _theoraEncoder_close(
        encoder:number
    ):void;

    export namespace encoder {
        /**
         * yuvデータをtheoraに変換するエンコーダー
         */
        export class TheoraEncoder {
            private encoder:number;
            private width:number;
            private height:number;
            private buf:Uint8Array; // ここにメモリーデータを上書きする。
            /**
             * コンストラクタ
             * @param width
             * @param height
             */
            constructor(
                    width:number,
                    height:number) {
                this.encoder = _theoraEncoder_make(
                    width,
                    height);
                this.width = width;
                this.height = height;
                this._allocate(width * height * 3 / 2);
            }
            private _allocate(size:number):void {
                var bufPtr:number = Module._malloc(size);
                this.buf = Module.HEAPU8.subarray(bufPtr, bufPtr + size);
                // このbufにwebGLからpixel情報を更新してやればよいという話になる。
            }
            /**
             * 変換bufferを参照する
             */
            public refBuffer():Uint8Array {
                if(this.encoder == 0) {
                    return null;
                }
                return this.buf;
            }
            /**
             * エンコードを実施する。
             * @param callback 変換後のデータを受け取るcallback
             */
            public encode(callback:{(theora:Uint8Array):boolean}):boolean {
                if(this.encoder == 0) {
                    return false;
                }
                var wh:number = this.width * this.height;
                var funcPtr:number = Module.Runtime.addFunction((
                        theoraPtr:number,
                        theoraLength:number) => {
                    return callback(
                        Module.HEAPU8.subarray(theoraPtr, theoraPtr + theoraLength)
                    );
                });
                var result:boolean = _theoraEncoder_encode(
                    this.encoder,
                    this.buf.byteOffset,
                    wh,
                    this.buf.byteOffset + wh,
                    wh >> 2,
                    this.buf.byteOffset + wh + (wh >> 2),
                    wh >> 2,
                    funcPtr);
                Module.Runtime.removeFunction(funcPtr);
                return result;
            }
            /**
             * 閉じる
             */
            public close():void {
                if(this.encoder == 0) {
                    return;
                }
                _theoraEncoder_close(this.encoder);
                Module._free(this.buf.byteOffset);
                this.encoder = 0;
            }
        }
    }
}