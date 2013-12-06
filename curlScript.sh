#!/bin/bash
# http://www.yilmazhuseyin.com/blog/dev/curl-tutorial-examples-usage/

var=$(curl -s http://localhost:8888/test)
echo -ne "Checking Test Function - "
if [ "$var" == "Hello World" ]; then
	echo "Test PASSED"
else
	echo "Test FAILED"
fi


var1=$(curl -s --data "name=richard&location=guildford&address=GU50by" http://localhost:8888/devices)
echo -ne "Checking Devices function - "
if [ "$var1" == "Hello World" ]; then
	echo "Test PASSED"
else
	echo "$var1"
	echo "Test FAILED"
fi
