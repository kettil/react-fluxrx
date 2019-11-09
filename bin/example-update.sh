#!/bin/bash

cd $(dirname ${0})/..

find $(pwd)/example -type d -depth 1 -print0 | while IFS= read -r -d '' examplePath; do
    echo '########################################'
    echo $examplePath
    cd $examplePath
    rm -rf build node_modules
    npm install
    npm outdated
    npm update
    npm run build
    rm -rf build
done
