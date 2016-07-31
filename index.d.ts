/// <reference path="../../../typings/globals/emscripten/index.d.ts" />
declare namespace ttLibJs {
    namespace decoder {
        /**
         * opusのdecoder
         */
        class OpusDecoder {
            private decoder;
            private buf;
            /**
             * コンストラクタ
             * @param sampleRate
             * @param channelNum
             */
            constructor(sampleRate: number, channelNum: number);
            private _allocate(size);
            /**
             * デコードを実施する
             * @param opus     変換対象のopusフレーム
             * @param pts      opusフレームのpts値
             * @param timebase opusフレームのtimebase値
             * @param callback デコード後のデータを受け取るcallback
             */
            decode(opus: Uint8Array, pts: number, timebase: number, callback: {
                (pcm: Int16Array): boolean;
            }): boolean;
            /**
             * デコーダーを閉じます。
             */
            close(): void;
        }
    }
}

/// <reference path="../../../typings/globals/emscripten/index.d.ts" />
declare namespace ttLibJs {
    namespace decoder {
        /**
         * speexのdecoder
         */
        class SpeexDecoder {
            private decoder;
            private buf;
            /**
             * コンストラクタ
             * @param sampleRate
             * @param channelNum
             */
            constructor(sampleRate: number, channelNum: number);
            private _allocate(size);
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
            decode(speex: Uint8Array, pts: number, timebase: number, sampleRate: number, sampleNum: number, channelNum: number, callback: {
                (pcm: Int16Array): boolean;
            }): boolean;
            /**
             * デコーダーを閉じます。
             */
            close(): void;
        }
    }
}

/// <reference path="../../../typings/globals/emscripten/index.d.ts" />
declare namespace ttLibJs {
    namespace decoder {
        /**
         * theoraのdecoder
         */
        class TheoraDecoder {
            private decoder;
            private buf;
            /**
             * コンストラクタ
             */
            constructor();
            private _allocate(size);
            /**
             * デコードを実施する
             * @param theora   変換対象のtheoraフレーム
             * @param callback 変換後のデータを受け取るcallback
             */
            decode(theora: Uint8Array, callback: {
                (y: Uint8Array, yStride: number, u: Uint8Array, uStride: number, v: Uint8Array, vStride: number): boolean;
            }): boolean;
            /**
             * 閉じる
             */
            close(): void;
        }
    }
}

/// <reference path="../../../typings/globals/emscripten/index.d.ts" />
declare namespace ttLibJs {
    namespace encoder {
        /**
         * pcmをopusに変換するエンコーダー
         */
        class OpusEncoder {
            private encoder;
            private buf;
            private bufSampleNum;
            private bufChannelNum;
            /**
             * コンストラクタ
             * @param sampleRate
             * @param channelNum
             * @param unitSampleNum
             */
            constructor(sampleRate: number, channelNum: number, unitSampleNum: number);
            private _allocate(sampleNum);
            /**
             * AudioBufferをエンコードする
             * @param buffer   変換対象のAudioBuffer
             * @param callback 変換後のデータを受け取るcallback
             */
            encodeBuffer(buffer: AudioBuffer, callback: {
                (opus: Uint8Array, pts: number, timebase: number, sampleRate: number, sampleNum: number, channelNum: number): boolean;
            }): boolean;
            /**
             * Int16ArrayのPCMデータをエンコードする
             * @param pcm      変換対象のInt16Array
             * @param callback 変換後のデータを受け取るcallback
             */
            encodeInt16Array(pcm: Int16Array, callback: {
                (opus: Uint8Array, pts: number, timebase: number, sampleRate: number, sampleNum: number, channelNum: number): boolean;
            }): boolean;
            /**
             * 閉じる
             */
            close(): void;
        }
    }
}

/// <reference path="../../../typings/globals/emscripten/index.d.ts" />
declare namespace ttLibJs {
    namespace encoder {
        /**
         * pcmをspeexに変換するエンコーダー
         */
        class SpeexEncoder {
            private encoder;
            private buf;
            private bufSampleNum;
            private bufChannelNum;
            /**
             * コンストラクタ
             * @param sampleRate
             * @param channelNum
             * @param quality
             */
            constructor(sampleRate: number, channelNum: number, quality: number);
            private _allocate(sampleNum);
            /**
             * AudioBufferをエンコードする
             * @param buffer   変換対象のAudioBuffer
             * @param callback 変換後のd−たを受け取るcallback
             */
            encodeBuffer(buffer: AudioBuffer, callback: {
                (speex: Uint8Array, pts: number, timebase: number, sampleRate: number, sampleNum: number, channelNum: number): boolean;
            }): boolean;
            /**
             * Int16ArrayのPCMデータをエンコードする。
             * @param pcm      変換対象のInt16Array
             * @param callback 変換後のデータを受け取るcallback
             */
            encodeInt16Array(pcm: Int16Array, callback: {
                (speex: Uint8Array, pts: number, timebase: number, sampleRate: number, sampleNum: number, channelNum: number): boolean;
            }): boolean;
            /**
             * 閉じる
             */
            close(): void;
        }
    }
}

/// <reference path="../../../typings/globals/emscripten/index.d.ts" />
declare namespace ttLibJs {
    namespace encoder {
        /**
         * yuvデータをtheoraに変換するエンコーダー
         */
        class TheoraEncoder {
            private encoder;
            private width;
            private height;
            private buf;
            /**
             * コンストラクタ
             * @param width
             * @param height
             */
            constructor(width: number, height: number);
            private _allocate(size);
            /**
             * 変換bufferを参照する
             */
            refBuffer(): Uint8Array;
            /**
             * エンコードを実施する。
             * @param callback 変換後のデータを受け取るcallback
             */
            encode(callback: {
                (theora: Uint8Array): boolean;
            }): boolean;
            /**
             * 閉じる
             */
            close(): void;
        }
    }
}

/// <reference path="../../../typings/globals/emscripten/index.d.ts" />
declare namespace ttLibJs {
    namespace resampler {
        /**
         * speexdspによるリサンプル動作
         */
        class SpeexdspResampler {
            private resampler;
            private buf;
            private bufSampleNum;
            private bufChannelNum;
            /**
             * コンストラクタ
             * @param channelNum
             * @param inputSampleRate
             * @param outputSampleRate
             * @param quality
             */
            constructor(channelNum: number, inputSampleRate: number, outputSampleRate: number, quality: any);
            private _allocate(sampleNum);
            /**
             * AudioBufferをリサンプルします。
             * @param buffer   変換対象のAudioBuffer
             * @param callback 結果データを受け取るcallback
             */
            resampleBuffer(buffer: AudioBuffer, callback: {
                (pcm: Int16Array): boolean;
            }): boolean;
            /**
             * Int16Arrayをリサンプルします。
             * @param pcm      変換対象のInt16Array
             * @param callback 結果データを受け取るcallback
             */
            resampleInt16Array(pcm: Int16Array, callback: {
                (pcm: Int16Array): boolean;
            }): boolean;
            /**
             * 閉じる
             */
            close(): void;
        }
    }
}

/// <reference path="decoder/opusDecoder.d.ts" />
/// <reference path="decoder/speexDecoder.d.ts" />
/// <reference path="decoder/theoraDecoder.d.ts" />
/// <reference path="encoder/opusEncoder.d.ts" />
/// <reference path="encoder/speexEncoder.d.ts" />
/// <reference path="encoder/theoraEncoder.d.ts" />
/// <reference path="resampler/speexdspResampler.d.ts" />
declare namespace tt {
    export import OpusDecoder = ttLibJs.decoder.OpusDecoder;
    export import SpeexDecoder = ttLibJs.decoder.SpeexDecoder;
    export import TheoraDecoder = ttLibJs.decoder.TheoraDecoder;
    export import OpusEncoder = ttLibJs.encoder.OpusEncoder;
    export import SpeexEncoder = ttLibJs.encoder.SpeexEncoder;
    export import TheoraEncoder = ttLibJs.encoder.TheoraEncoder;
    export import SpeexdspResampler = ttLibJs.resampler.SpeexdspResampler;
}
