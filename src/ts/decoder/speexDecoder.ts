/// <reference path="../../../typings/globals/emscripten/index.d.ts" />

namespace ttLibJs {
    declare function _speexDecoder_make(
        sampleRate:number,
        channelNum:number
    ):number;

    declare function _speexDecoder_decode(
        decoder:number,
        speexData:number,
        speexSize:number,
        pts:number,
        pts_upper:number,
        timebase:number,
        sampleRate:number,
        sampleNum:number,
        channelNum:number,
        callback:number
    ):boolean;

    declare function _speexDecoder_close(
        decoder:number
    ):void;

    export namespace decoder {
        /**
         * speexのdecoder
         */
        export class SpeexDecoder {
            private decoder:number;
            private buf:Uint8Array;
            /**
             * コンストラクタ
             * @param sampleRate
             * @param channelNum
             */
            constructor(
                    sampleRate:number,
                    channelNum:number) {
                this.decoder = _speexDecoder_make(
                    sampleRate,
                    channelNum);
                this._allocate(65536);
            }
            private _allocate(size:number):void {
                var bufPtr:number = Module._malloc(size);
                this.buf = Module.HEAPU8.subarray(bufPtr, bufPtr + size);
            }
            /**
             * デコードを実施する
             * @param speex      変換対象のspeexフレーム
             * @param pts        speexフレームのpts値
             * @param timebase   speexフレームのtimebase値
             * @param sampleRate 該当フレームのサンプルレート
             * @param sampleNum  該当フレームが保持するサンプル数
             * @param channelNum 該当フレームが保持するチャンネル数
             * @param callback   デコード後のデータを受け取るcallback
             */
            public decode(
                    speex:Uint8Array,
                    pts:number,
                    timebase:number,
                    sampleRate:number,
                    sampleNum:number,
                    channelNum:number,
                    callback:{(pcm:Int16Array):boolean}):boolean {
                if(this.decoder == 0) {
                    return false;
                }
                if(speex == null) {
                    return true;
                }
                var length:number = speex.length;
                var srcSpeex:Uint8Array = null;
                if(speex.buffer == Module.HEAPU8.buffer) {
                    srcSpeex = speex;
                }
                else {
                    if(length > this.buf.length) {
                        console.log("より大きなサイズが必要になったので、reallocする"); 
                        Module._free(this.buf.byteOffset);
                        this._allocate(length);
                    }
                    this.buf.set(speex);
                    srcSpeex = this.buf.subarray(0, length);
                }
                var funcPtr:number = Module.Runtime.addFunction((
                        pcmPtr:number,
                        pcmSize:number) => {
                    return callback(Module.HEAP16.subarray(pcmPtr / 2, (pcmPtr + pcmSize) / 2));
                });
                var result:boolean = _speexDecoder_decode(
                    this.decoder,
                    srcSpeex.byteOffset,
                    length,
                    pts & 0xFFFFFFFF,
                    (pts >> 32) & 0xFFFFFFFF,
                    timebase,
                    sampleRate,
                    sampleNum,
                    channelNum,
                    funcPtr);
                Module.Runtime.removeFunction(funcPtr);

                return result;
            }
            /**
             * デコーダーを閉じます。
             */
            public close():void {
                if(this.decoder == 0) {
                    return;
                }
                _speexDecoder_close(this.decoder);
                Module._free(this.buf.byteOffset);
                this.decoder = 0;
            }
        }
    }
}