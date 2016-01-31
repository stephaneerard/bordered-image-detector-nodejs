* Installation

```
npm install frenchex-bordered-images-detector-nodejs
```

* Usage

```
var Detector = require("frenchex-bordered-images-detector-nodejs");

Detector.detect(url)
    .then((isBorderImage) => {
        // your business logic
    });
```

* Docker server

Using docker compose, up a load balancer so you can scale easily the service
Scaling the service is done easily using docker network
You can tweak the docker-compose.yml file by importing it into your own
Simply install this as a dependency and make your docker-compose.yml file extend this one

** Start the LB and 1 instance

Load-balancing is done using nginx

```
docker-compose up -d
```

** Scale the service to 4 nodes

```
docker-compose scale detector=4
```
