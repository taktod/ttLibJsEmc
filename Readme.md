とりあえず
npm install
typings install
bower install
とnativeに必要なものをインストールすることで終わるようにしておきたい。

とりあえずmacでのセットップについて

```
$ brew install node
$ brew install automake
$ brew install cmake
$ brew install libtool
$ npm install -g gulp
$ npm install tsd
$ npm install tsc
$ npm install -g electron-prebuilt
$ npm install -g electron-packager
```
このあたりが必要
emscripten関連が必要なので、emsdk(emsdk_portableでしたっけ)が別途必要で、pathを通しておいてください。
$ emcc --helpでemccのヘルプがでてくる感じで

```
$ cd native
$ git clone https://github.com/taktod/ttLibC.git
$ cd ttLibC
$ git checkout develop
$ cd ../
$ git clone https://git.xiph.org/opus.git
$ cd opus
$ git checkout 3a1dc9d
$ cd ../
$ curl -O http://downloads.xiph.org/releases/ogg/libogg-1.3.2.tar.gz
$ curl -O http://downloads.xiph.org/releases/theora/libtheora-1.1.1.tar.bz2
$ tar zxvf libogg-1.3.2.tar.gz
$ tar zxvf libtheora-1.1.1.tar.bz2
$ git clone https://git.xiph.org/vorbis.git
$ git clone http://git.xiph.org/speex.git
$ git clone http://git.xiph.org/speexdsp.git
```
c言語絡みで利用するライブラリをゲットしておく。
まぁx264とかfaacとかやってもいいけど、ライセンスとか利用条件がきついので、やらない。

libogg-1.3.2
configureスクリプトをO4で検索して、下にある*)の部分をO20からO2に書き換える。
```
$ emconfigure ./configure --host=x86_64 --prefix=`pwd`/../libs
$ make
$ make install
```

vorbis
```
$ ./autogen.sh
$ emconfigure ./configure --prefix=`pwd`/../libs PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig --disable-examples --disable-shared --disable-docs
$ make
$ make install
```

libtheora
```
$ emconfigure ./configure --prefix=`pwd`/../libs --disable-asm --disable-shared --disable-oggtest --disable-vorbistest --disable-examples PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig
$ make
$ make install
```

speex
```
$ ./autogen.sh
$ emconfigure ./configure --disable-shared --disable-sse --disable-binaries --prefix=`pwd`/../libs PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig
$ make
$ make install
```

speexdsp
```
$ ./autogen.sh
$ emconfigure ./configure --disable-shared --disable-examples --prefix=`pwd`/../libs PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig
$ make
$ make install
```

opus
```
$ ./autogen.sh
$ emconfigure ./configure --disable-shared --disable-asm --disable-rtcd --disable-doc --disable-extra-programs --prefix=`pwd`/../libs PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig
$ make
$ make install
```

ttLibC
```
$ autoreconf
$ emconfigure ./configure --enable-all PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig --disable-socket --disable-file --prefix=`pwd`/../libs
$ make
$ make install
```

これで準備OK

こいつらこまる。
