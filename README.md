# C.R 4 Vegas - Control Remoto - BACKEND
Proyecto para el control remoto y estadística de datos para la Comunidad de Regantes las 4 Vegas de Almería. En la parte de aplicación se va a utilizar Angular para el frontend y NodeJS con Typescript para el backend, el servidor intermedio entre la aplicación y los microcontroladores será EMQX, para la comunicación con los nodos finales se van a utilizar módulos SIM800L integrados con arduinos nano, junto a una variedad de sensores y actuadores.
El objetivo principal es crear un login para autenticación y autorización, y el uso de mapas para el despliege de los microcontroladores por las diferentes unidades de control de la red de tuberías de la comunidad.

***

## FRONTEND
- Framework: Angular

**Dependencias**
```json
@angular/material
bootstrap
jquery
mapbox-gl
ngx-mqtt
ngx-socket-io
popper.js
```

**Dependencias de desarrollo**
```json
@types/bootstrap
@types/mapbox-gl
```

## Base de datos - Diagrama relacional
![Diagrama Relacional](/img/cr4vegas_remoto_RELACIONAL_1.png "Diagrama Relacional")



