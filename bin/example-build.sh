#!/bin/bash

PATH_PROJECT="$(pwd)"
PATH_MODULE="$(cd $(dirname ${0})/..; pwd)"
PATH_BUILD="$PATH_PROJECT/.module"

cd $PATH_MODULE

if [ ! -d "./node_modules" ]; then
    npm install
fi
npm run build

mkdir -p $PATH_BUILD
rsync -ach --delete $PATH_MODULE/build $PATH_BUILD

# --------------------

diff -rq $PATH_MODULE/package.json $PATH_BUILD/package.json > /dev/null 2> /dev/null
if [ "$?" != 0 ]; then
    cp $PATH_MODULE/package.json $PATH_MODULE/package-lock.json $PATH_BUILD
    cd $PATH_BUILD

    npm install --production
fi
