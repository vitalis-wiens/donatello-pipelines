#!bin/bash

# bundleGenerator should be already be prepared (if not copy it from the bundleBase) it contains the basic code for the react app
cd bundleGenerator
cd src 
cp -rd ../../src/Implementation ./

#// zip it 
cd ..

zip -r demoBundle * 
mv demoBundle.zip ../src/demoBundle.zip