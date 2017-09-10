CURRENT_DIR=`pwd`

# install packages

cd $CURRENT_DIR/infoboard/frontend && npm install && npm install --only=dev
cd $CURRENT_DIR/infoboard/backend && npm install

# build frontend
cd $CURRENT_DIR/infoboard/frontend
node webpack-build && sleep 10 && rm -rf dist && mkdir dist && cp index.html ./dist && mv build ./dist/build