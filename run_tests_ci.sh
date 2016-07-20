#!/bin/sh
tsc
cd tests
linklocal
npm install
meteor test --once --driver-package dispatch:mocha-phantomjs
