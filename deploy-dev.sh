#!/bin/bash

if [ -n "$1" ]; then
	echo iniciando despliegue...
	ng build --prod
	docker build --tag dev-remote-frontend:$1 .
	docker tag dev-remote-frontend:$1 rubenfgr/dev-remote-frontend:$1
	docker push rubenfgr/dev-remote-frontend:$1
	echo despliege finalizado!
else
	echo Necesitas pasar un parámetro con el nombre de la etiqueta 
fi
