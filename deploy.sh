#!/bin/bash

if [ -n "$1" ]; then
	echo iniciando despliegue de producción...
	ng build --prod
	docker build --tag remote-frontend:$1 .
	docker tag remote-frontend:$1 rubenfgr/remote-frontend:$1
	docker push rubenfgr/remote-frontend:$1
	echo despliege de producción finalizado!
else
	echo Necesitas pasar un parámetro con el nombre de la etiqueta 
fi
