/// <reference path="decoder/opusDecoder.ts" />
/// <reference path="decoder/speexDecoder.ts" />
/// <reference path="decoder/theoraDecoder.ts" />
/// <reference path="encoder/opusEncoder.ts" />
/// <reference path="encoder/speexEncoder.ts" />
/// <reference path="encoder/theoraEncoder.ts" />
/// <reference path="resampler/speexdspResampler.ts" />

namespace tt {
    export import OpusDecoder       = ttLibJs.decoder.OpusDecoder;
    export import SpeexDecoder      = ttLibJs.decoder.SpeexDecoder;
    export import TheoraDecoder     = ttLibJs.decoder.TheoraDecoder;
    export import OpusEncoder       = ttLibJs.encoder.OpusEncoder;
    export import SpeexEncoder      = ttLibJs.encoder.SpeexEncoder;
    export import TheoraEncoder     = ttLibJs.encoder.TheoraEncoder;
    export import SpeexdspResampler = ttLibJs.resampler.SpeexdspResampler;
}