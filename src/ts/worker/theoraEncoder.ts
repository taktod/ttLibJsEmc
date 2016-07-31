/// <reference path="../encoder/theoraEncoder.ts" />
/// <reference path="../../../node_modules/typescript/lib/lib.webworker.d.ts" />

/**
 * とりあえず・・・
 * workerと主体とのデータのやり取りで、bufferのコピーを渡すことができるが、渡した側の参照が消える。
 * よってここに書き込んでくれと渡して、相手側で更新して、それを参照するということはできない
 * emscripten側のbufferとしてデータを渡したかったら、emscriptenのbufferにデータをコピーしないとだめ
 * 
 * よって次のようにする必要があるか？
 * どこかでデータをallocする。
 * 主体側 -> yuvデータを抽出する。
 * 抽出データをworker側に送る。
 * worker側では、データをemscriptenの処理bufferにコピーしなければいけない。
 * 
 * いままでの動作では、encoder初期化時にbufferを準備。
 * このbufferに直接yuvデータをwebGLから取得する
 * という処理にしていた。
 */
interface WorkerGlobalScope extends EventTarget, WorkerUtils, DedicatedWorkerGlobalScope, WindowConsole {
    postMessage(message:any, type?:any):void;
}

var encoder:ttLibJs.encoder.TheoraEncoder = null;
var yuv:Uint8Array = null;
self.addEventListener('message', (e:MessageEvent) => {
    switch(e.data.type) {
    case 'make':
        if(e.data.width == undefined || e.data.height == undefined) {
            console.log("invalid make arguments.");
            return;
        }
        encoder = new ttLibJs.encoder.TheoraEncoder(e.data.width, e.data.height);
//        var yuv:Uint8Array = new Uint8Array(e.data.width * e.data.height * 3 / 2);
//        self.postMessage({type:'buffer', buffer:yuv}, [yuv.buffer]);
        break;
    case 'encode':
        if(e.data.buffer == undefined) {
            console.log("invalid send buffer.");
            return;
        }
        var yuv:Uint8Array = encoder.refBuffer();
        yuv.set(e.data.buffer);
        encoder.encode((theora:Uint8Array):boolean => {
            self.postMessage({type:'result', buffer:theora});
            return true;
        });
//        self.postMessage({type:'buffer', buffer:e.data.buffer}, [e.data.buffer.buffer]);
        break;
    case 'close':
        encoder.close();
        break;
    default:
        break;
    }
}, false);
