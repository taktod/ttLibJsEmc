#!/bin/bash

# 必要なもの取得
git clone https://github.com/taktod/ttLibC.git
cd ttLibC
git checkout develop
cd ..
git clone https://git.xiph.org/opus.git
cd opus
git checkout 3a1dc9d
cd ../
curl -O http://downloads.xiph.org/releases/ogg/libogg-1.3.2.tar.gz
curl -O http://downloads.xiph.org/releases/theora/libtheora-1.1.1.tar.bz2
tar zxvf libogg-1.3.2.tar.gz
tar zxvf libtheora-1.1.1.tar.bz2
git clone https://git.xiph.org/vorbis.git
git clone http://git.xiph.org/speex.git
git clone http://git.xiph.org/speexdsp.git

# あとはライブラリのコンパイル
cd libogg-1.3.2
patch configure < ../../native/ogg_configure.patch
emconfigure ./configure --host=x86_64 --prefix=`pwd`/../libs
make
make install
cd ..

cd vorbis
./autogen.sh
emconfigure ./configure --prefix=`pwd`/../libs PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig --disable-examples --disable-shared --disable-docs
make
make install
cd ..

cd libtheora-1.1.1
emconfigure ./configure --prefix=`pwd`/../libs --disable-asm --disable-shared --disable-oggtest --disable-vorbistest --disable-examples PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig
make
make install
cd ..

cd speex
./autogen.sh
emconfigure ./configure --disable-shared --disable-sse --disable-binaries --prefix=`pwd`/../libs PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig
make
make install
cd ..

cd speexdsp
./autogen.sh
emconfigure ./configure --disable-shared --disable-examples --prefix=`pwd`/../libs PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig
make
make install
cd ..

cd opus
./autogen.sh
emconfigure ./configure --disable-shared --disable-asm --disable-rtcd --disable-doc --disable-extra-programs --prefix=`pwd`/../libs PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig
make
make install
cd ..

cd ttLibC
autoreconf
emconfigure ./configure --enable-all PKG_CONFIG_PATH=`pwd`/../libs/lib/pkgconfig --disable-socket --disable-file --prefix=`pwd`/../libs
make
make install
cd ..
