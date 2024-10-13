# SMART-HOME

## Overview
SMART-HOME is a web application focused on integrating smart devices within real estates. This project is structured into several components:

- **smart-home-server**: A Java Spring Boot application.
- **smart-home-client**: A React Typescript application for the frontend.
- **simulation**: A go script acting as an MQTT publisher.

## Technologies
- **Server-side**: Java Spring Boot
- **Client-side**: React TS
- **Database**: PostgreSQL
- **MQTT Broker**: Mosquitto
- **Time Series Database**: InfluxDB
- **Redis**: caching database queries
- **Nginx**: serving static content and reverse proxy

## Requirements
- Java 17
- Maven
- PostgreSQL (Port 5432)
- Mosquitto MQTT Broker (Port 1883)
- InfluxDB (Port 8086)
- Go 1.21
- Redis (Port 6380)
- Nginx (Port 84)

## Setup Instructions

### 1. Install Java 17 and Maven
Ensure Java 17 and Maven are installed on your system.

### 2. Setup PostgreSQL
- Install PostgreSQL and start the service.
- Set credentials in `application.properties` (`spring.datasource.username` and `spring.datasource.password`).
- Create a database named `smartHomeDB`.

### 3. Setup Mosquitto MQTT Broker
- Open cmd (administrator mode) and navigate to the Mosquitto installation directory.
- Create a password file using `mosquitto_passwd -c <password file> <username>`.
- Start the Mosquitto broker and set the necessary information in `application.properties` (`mqtt.host`, `mqtt.port`, `mqtt.username`, `mqtt.password`).

### 4. Setup InfluxDB
- Install InfluxDB from InfluxData and start it.
- Navigate to the InfluxData installation directory and run `influxd`.
- Set up an organization (e.g., 'tim19') and a bucket (e.g., 'smart-home') through the InfluxDB UI at `localhost:8086`.
- Replace the generated token in `application.properties`.

### 5. Install Go
Ensure GO 1.21 is installed on your system.


## Running the Applications
Start the applications in the following order:
1. Mosquitto Broker
2. PostgreSQL Database
3. InfluxDB
4. Run `npm run build` in `smart-home-client`
5. Run `docker-compose up` in `smart-home-server`
6. Run `smart-home-server`
7. Run `simulation` (`go run main.go`)
8. Open localhost:84 in browser

## Additional Information

### smart-home-server
Runs on port 8085. Use IDE configurations or terminal commands to start the application.

### smart-home-client
Runs on Nginx server on localhost:84

### simulation
A simple GO script that publishes data using MQTT. Starts using IDE configurations or terminal commands (go run main.go). 

