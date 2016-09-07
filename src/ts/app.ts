/// <reference path="../../typings/index.d.ts" />
/// <reference path="ttLibJsEmc.ts" />

$(() => {
    console.log("test");
    // これで問題なく動作する。
    $("#start").on("click", () => {
        // speexdspのテスト
/*
        document.getElementById('title').innerText = "ttLibJsEmcのテストページ(speexdspテスト)";
        var context:AudioContext = new AudioContext();
        var scriptNode:ScriptProcessorNode = context.createScriptProcessor(0, 1, 1);
        var player:tt.BufferPlayer = new tt.BufferPlayer(context);
        var playerNode:AudioNode = player.refNode();*/

        // theoraのテスト
        document.getElementById('title').innerText = "ttLibJsEmcのテストページ(theoraテスト)";
        navigator.getUserMedia({
            audio:false,
            video:true
        },
        (stream:MediaStream) => {
            var original:HTMLVideoElement = <HTMLVideoElement>document.getElementById('original');
            original.src = URL.createObjectURL(stream);
            original.play();
            var display:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('display');
            var capture:tt.SceneCapture = new tt.SceneCapture(320, 240);
            var drawer:tt.SceneDrawer = new tt.SceneDrawer(display);
            var encoder:tt.TheoraEncoder = new tt.TheoraEncoder(320, 240);
            var decoder:tt.TheoraDecoder = new tt.TheoraDecoder();
            (function() {
                capture.drain(original, encoder.refBuffer());
                encoder.encode((theora:Uint8Array):boolean => {
                    return decoder.decode(theora, (
                            y:Uint8Array, yStride:number,
                            u:Uint8Array, uStride:number,
                            v:Uint8Array, vStride:number):boolean => {
                        drawer.draw(
                            y, yStride,
                            u, uStride,
                            v, vStride);
                        return true;
                    });
                });
                requestAnimationFrame(<FrameRequestCallback>arguments.callee);
            })();
        },
        (error:MediaStreamError) => {
            console.log("error");
        });
// workerの動作テストしたやつ。
/*
        document.getElementById('title').innerText = "ttLibJsEmcのテストページ(workerテスト)";
        var worker:Worker = new Worker('js/theoraEncoderEmc.js');
        worker.addEventListener('message', (e:MessageEvent) => {
            console.log(e.data);
        }, false);
        worker.postMessage({type:'setup'}); // Send data to our worker.
        var u8:Uint8Array = new Uint8Array([1,2,3,4]);
        worker.postMessage({type:'test', data:u8}, [u8.buffer]);*/
/*
        document.getElementById('title').innerText = "ttLibJsEmcのテストページ(theoraWorkerテスト)";
        navigator.getUserMedia({
            audio:false,
            video:true
        },
        (stream:MediaStream) => {
            var original:HTMLVideoElement = <HTMLVideoElement>document.getElementById('original');
            original.src = URL.createObjectURL(stream);
            original.play();
            var display:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('display');
            var capture:tt.SceneCapture = new tt.SceneCapture(320, 240);
            var drawer:tt.SceneDrawer = new tt.SceneDrawer(display);
            var encoder:Worker = new Worker('js/theoraEncoder.js');
            var decoder:tt.TheoraDecoder = new tt.TheoraDecoder();
            var yuv:Uint8Array = new Uint8Array(320 * 240 * 3 / 2);
            encoder.addEventListener('message', (e:MessageEvent) => {
                if(e.data.type == 'buffer') {
                    // bufferがきたら自身のデータを吸い上げて、相手に送り返す
                    capture.drain(original, e.data.buffer);
                    encoder.postMessage({type:'encode', buffer:e.data.buffer}, [e.data.buffer.buffer]);
                }
                else if(e.data.type == 'result') {
                    // theoraのフレームができてる。
                    decoder.decode(e.data.buffer, (
                            y:Uint8Array, yStride:number,
                            u:Uint8Array, uStride:number,
                            v:Uint8Array, vStride:number):boolean => {
                        drawer.draw(y, yStride, u, uStride, v, vStride);
                        return true;
                    });
                }
            }, false);
            encoder.postMessage({type:'make', width:320, height:240});
            // makeを実施したら、あとはyuvデータを送ればよいが・・・
            (function() {
                if(yuv != null) {
                    console.log("データを送る。");
                    capture.drain(original, yuv);
                    // これを変換にまわさなければならない
                    encoder.postMessage({type:'encode', buffer:yuv});
//                    yuv = null;
                }
                setTimeout(arguments.callee, 150);
//                requestAnimationFrame(<FrameRequestCallback>arguments.callee);
            })();
        },
        (error:MediaStreamError) => {
            console.log("error");
        }); */
    });
});
