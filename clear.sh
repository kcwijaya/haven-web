#/!/bin/bash

COUNTER = 31
while [ $COUNTER -lt 87]; do 
	content = "$(curl -H "Content-type: application/json" -X DELETE http://havenapi.herokuapp.com/tasks/ "$COUNTER")"
	echo "$content"
	let COUNTER=COUNTER+1
done
