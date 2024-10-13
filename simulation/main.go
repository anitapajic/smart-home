package main

import (
	"encoding/json"
	"fmt"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"io"
	"math"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

type DeviceStatus struct {
	DeviceId  int       `json:"deviceId"`
	Name      string    `json:"name"`
	Online    bool      `json:"online"`
	Timestamp time.Time `json:"timestamp"`
}

type Device struct {
	DeviceID     int    `json:"deviceId"`
	Name         string `json:"name"`
	RealEstateID int    `json:"realEstateID"`
	Online       bool   `json:"online"`
	Type         string `json:"type"`
	Variant      string `json:"variant"`
	IsOn         bool   `json:"isOn"`
}

type SolarPanel struct {
	ID                   int     `json:"id"`
	Size                 float64 `json:"size"`
	SolarPanelEfficiency float64 `json:"solarPanelEfficiency"`
	IsOn                 bool    `json:"isOn"`
	ElectricityGenerated float64 `json:"electricityGenerated"`
}

type SolarPanelSystem struct {
	DeviceID     int          `json:"deviceId"`
	Name         string       `json:"name"`
	RealEstateID int          `json:"realEstateID"`
	Online       bool         `json:"online"`
	IsOn         bool         `json:"isOn"`
	Type         string       `json:"type"`
	Variant      string       `json:"variant"`
	SolarPanels  []SolarPanel `json:"solarPanels"`
}

type Measurement struct {
	DeviceID  int       `json:"deviceId"`
	Name      string    `json:"name"`
	Value     float64   `json:"value"`
	Timestamp time.Time `json:"timestamp"`
}

type GateMeasurement struct {
	DeviceID           int       `json:"deviceId"`
	Name               string    `json:"name"`
	RegistrationNumber string    `json:"registrationNumber"`
	Timestamp          time.Time `json:"timestamp"`
	IsPassed           bool      `json:"isPassed"`
}

type SwitchIsOnMessage struct {
	DeviceID   int    `json:"deviceId"`
	DeviceName string `json:"deviceName"`
	Variant    string `json:"variant"`
	IsOn       bool   `json:"isOn"`
	Success    bool   `json:"success"`
	Timestamp  string `json:"timestamp"`
	Username   string `json:"username"`
}

type HomeBatteryMessageIn struct {
	DeviceID  int     `json:"deviceId"`
	Direction float64 `json:"direction"`
	Name      string  `json:"name"`
	Value     float64 `json:"value"`
}

type HomeBatteryMessageOut struct {
	DeviceID  int       `json:"deviceId"`
	Direction float64   `json:"direction"`
	Name      string    `json:"name"`
	Value     float64   `json:"value"`
	Timestamp time.Time `json:"timestamp"`
}

type HomeBattery struct {
	DeviceID int     `json:"deviceId"`
	Name     string  `json:"name"`
	Value    float64 `json:"value"`
}

type ChargingVehicle struct {
	ID                  int     `json:"id"`
	RegistrationNumber  string  `json:"registrationNumber"`
	BatteryCapacity     float64 `json:"batteryCapacity"`
	CurrentLevelBattery float64 `json:"currenLevelBattery"`
	WantedLevelBattery  float64 `json:"wantedLevelBattery"`
	CarChargerID        int     `json:"carChargerId"`
}

const (
	ThSensor   = "TH_SENSOR"
	Lamp       = "LAMP"
	Gate       = "GATE"
	Battery    = "HOME_BATTERY"
	Panel      = "SOLAR_PANELS"
	CarCharger = "CAR_CHARGER"
)

var registrationNumbers = []string{
	"38J765", "42U89J", "1OP098", "26J5K3", "78J24P",
}

var solarPanelSystems []SolarPanelSystem
var devices []Device
var batteries []Device
var lamps []Device
var gates []Device
var dhts []Device
var carChargers []Device
var vehicles []ChargingVehicle
var client mqtt.Client

func handleNewDeviceMessage(payload []byte) {
	var newDevice Device
	err := json.Unmarshal(payload, &newDevice)
	if err != nil {
		fmt.Printf("Error decoding newDevice message: %v\n", err)
		return
	}

	// Add the new device to the devices list
	devices = append(devices, newDevice)
	fmt.Println(len(devices), "Devices len")
	switch newDevice.Variant {
	case ThSensor:
		dhts = append(dhts, newDevice)
	case Gate:
		gates = append(gates, newDevice)
	case Lamp:
		lamps = append(lamps, newDevice)
	case CarCharger:
		carChargers = append(carChargers, newDevice)
	case Battery:
		batteries = append(batteries, newDevice)
	}
	// You can perform any additional logic or actions related to a new device here
}

func handleNewSolarPanelSystemMessage(payload []byte) {
	var newDevice SolarPanelSystem
	err := json.Unmarshal(payload, &newDevice)
	if err != nil {
		fmt.Printf("Error decoding newDevice message: %v\n", err)
		return
	}
	fmt.Println("newSolarPanelSystem")
	fmt.Println(newDevice)

	// Add the new device to the devices list
	solarPanelSystems = append(solarPanelSystems, newDevice)
}

func handleHomeBatteryMessage(payload []byte) {
	var measurement HomeBatteryMessageIn
	err := json.Unmarshal(payload, &measurement)
	if err != nil {
		fmt.Printf("Error decoding homeBattery message: %v\n", err)
		return
	}

	if measurement.Direction == 1.0 {
		homeBattery := HomeBattery{
			DeviceID: measurement.DeviceID,
			Name:     measurement.Name,
			Value:    measurement.Value,
		}

		returned := setBatteryValue(homeBattery)
		newMeasurement := HomeBatteryMessageOut{
			DeviceID:  returned.DeviceID,
			Direction: 0.0,
			Name:      returned.Name,
			Value:     returned.Value,
			Timestamp: time.Now(),
		}

		message, err := json.Marshal(newMeasurement)
		if err != nil {
			fmt.Printf("Error encoding homeBattery message: %v\n", err)
			return
		}

		// Assuming `client` is your MQTT client
		token := client.Publish("homeBattery", 0, false, string(message))
		token.Wait()
	}
}

func setBatteryValue(homeBattery HomeBattery) HomeBattery {
	for _, battery := range batteries {
		if battery.DeviceID == homeBattery.DeviceID {
			return homeBattery
		}
	}
	return homeBattery

}

func handleSwitchIsOnMessage(payload []byte) {
	var switchIsOnMessage SwitchIsOnMessage
	err := json.Unmarshal(payload, &switchIsOnMessage)
	if err != nil {
		fmt.Printf("Error decoding switchIsOn message: %v\n", err)
		return
	}

	// Now you can use switchIsOnMessage as a strongly-typed struct
	fmt.Printf("Received switchIsOn message: %+v\n", switchIsOnMessage)

	switch switchIsOnMessage.Variant {
	case Panel:
		for i, solarPanelSystem := range solarPanelSystems {
			if solarPanelSystem.DeviceID == switchIsOnMessage.DeviceID {
				solarPanelSystems[i].IsOn = !solarPanelSystem.IsOn
				break
			}
		}
	case ThSensor:
		for i, dht := range dhts {
			if dht.DeviceID == switchIsOnMessage.DeviceID {
				dhts[i].IsOn = !dht.IsOn
				break
			}
		}
	case Gate:
		for i, gate := range gates {
			if gate.DeviceID == switchIsOnMessage.DeviceID {
				gates[i].IsOn = !gate.IsOn
				break
			}
		}
	case Lamp:
		for i, lamp := range lamps {
			if lamp.DeviceID == switchIsOnMessage.DeviceID {
				lamps[i].IsOn = !lamp.IsOn
				break
			}
		}
	case CarCharger:
		for i, charger := range carChargers {
			if charger.DeviceID == switchIsOnMessage.DeviceID {
				carChargers[i].IsOn = !charger.IsOn
				break
			}
		}
	}
}

func handleNewVehicleMessage(payload []byte) {
	var newVehicle string
	err := json.Unmarshal(payload, &newVehicle)
	if err != nil {
		fmt.Printf("Error decoding newDevice message: %v\n", err)
		return
	}
	fmt.Println(newVehicle)
	registrationNumbers = append(registrationNumbers, newVehicle)
}

var messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	topic := msg.Topic()
	payload := msg.Payload()

	switch topic {
	case "newDevice":
		handleNewDeviceMessage(payload)
	case "newSolarPanelSystem":
		handleNewSolarPanelSystemMessage(payload)
	case "homeBattery":
		handleHomeBatteryMessage(payload)
	case "switchIsOn":
		handleSwitchIsOnMessage(payload)
	case "newVehicle":
		handleNewVehicleMessage(payload)
	default:
		fmt.Printf("Received message: %s from topic: %s\n", payload, topic)
	}
}

func sub(client mqtt.Client, topic string) {
	token := client.Subscribe(topic, 1, nil)
	token.Wait()
	fmt.Printf("Subscribed to topic: %s \n", topic)
}

var connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	fmt.Println("Connected")
	sub(client, "newDevice")
	sub(client, "newSolarPanelSystem")
	sub(client, "homeBattery")
	sub(client, "switchIsOn")
	sub(client, "newVehicle")
}

var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	fmt.Printf("Connect lost: %v", err)
}

func initializeMQTTClient(broker string, port int) {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("%s:%d", broker, port))
	opts.SetClientID("go_mqtt_client")
	opts.SetUsername("client")
	opts.SetPassword("password")
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler

	client = mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}
}

func initializeDevices(){
	getVehicles("http://localhost:8085/api/vehicles")
	getSolarPanelSystems("http://localhost:8085/api/devices/solarPanelSystems")
	getDevices("http://localhost:8085/api/devices")
	lamps = filterDevicesByVariant(devices, Lamp)
	gates = filterDevicesByVariant(devices, Gate)
	dhts = filterDevicesByVariant(devices, ThSensor)
	batteries = filterDevicesByVariant(devices, Battery)
	carChargers = filterDevicesByVariant(devices, CarCharger)
	for i := 1; i <= 5; i++ {
		vehicle := ChargingVehicle{
			ID:                  i,
			RegistrationNumber:  fmt.Sprintf("ABC123%d", i),
			BatteryCapacity:     20.0,
			CurrentLevelBattery: 20.0,
			WantedLevelBattery:  90.0,
			CarChargerID:        0,
		}
		vehicles = append(vehicles, vehicle)
	}
}

func main() {
	var broker = "localhost"
	var port = 1883
	initializeMQTTClient(broker, port)
	initializeDevices()
	publishOnlineStatus(client, true)

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGTERM)

	// Initialize ticker and done channels
	ticker := time.NewTicker(5 * time.Second)
	done := make(chan bool)

	// Start each update function in its own goroutine
	go func() {
		for {
			select {
			case <-ticker.C:
				go publishOnlineStatus(client, true)
				go updateLampMeasurements(client, lamps)
				go updateGateMeasurements(client, gates)
				go updateDHTMeasurements(client, dhts)
				go updateSolarPanelMeasurements(client, solarPanelSystems)
				go updateCarChargerMeasurements(client, carChargers)
			case <-done:
				return
			}
		}
	}()

	// Wait for interrupt signal
	<-signalChannel

	// Signal termination to all goroutines and wait for them to finish
	close(done)

	// Cleanup
	ticker.Stop()
	publishOnlineStatus(client, false)
	client.Disconnect(250)

}

func getDevices(apiURL string) {
	resp, err := http.Get(apiURL)
	if err != nil {
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)
	//var devices []Device
	err = json.NewDecoder(resp.Body).Decode(&devices)
	if err != nil {
	}

}

func getSolarPanelSystems(apiURL string) {
	resp, err := http.Get(apiURL)
	if err != nil {
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)

	err = json.NewDecoder(resp.Body).Decode(&solarPanelSystems)
	if err != nil {
	}
}

func getVehicles(apiURL string) {
	resp, err := http.Get(apiURL)
	if err != nil {
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)
	var newRegistrationNumbers []string
	err = json.NewDecoder(resp.Body).Decode(&newRegistrationNumbers)
	if err != nil {
	}
	registrationNumbers = append(registrationNumbers, newRegistrationNumbers...)
}

func filterDevicesByVariant(devices []Device, variant string) []Device {
	var filteredDevices []Device
	for _, device := range devices {
		if device.Variant == variant {
			filteredDevices = append(filteredDevices, device)
		}
	}
	return filteredDevices
}

// ALL DEVICES
func publishOnlineStatus(client mqtt.Client, status bool) {
	for _, device := range devices {
		// Generate and publish online status message
		onlineStatus := DeviceStatus{
			DeviceId:  device.DeviceID,
			Name:      device.Name,
			Online:    status,
			Timestamp: time.Now(),
		}

		message, err := json.Marshal(onlineStatus)
		if err != nil {
			fmt.Printf("Error serializing message for %s: %v\n", device.Name, err)
			continue
		}

		token := client.Publish(fmt.Sprintf("%d/isOnline", device.RealEstateID), 0, false, string(message))
		token.Wait()
		//fmt.Printf("Published %s\n", fmt.Sprintf("%d/isOnline", device.RealEstateID))
	}
}

// LAMPS
func updateLampMeasurements(client mqtt.Client, lamps []Device) {
	for _, lamp := range lamps {

		// Generate and publish measurement message
		brightnessLevel := math.Round(rand.Float64() * 100)
		measurement := Measurement{
			lamp.DeviceID,
			lamp.Name,
			brightnessLevel,
			time.Now(),
		}
		message, err := json.Marshal(measurement)
		if err != nil {
			fmt.Printf("Error serializing message for lamp %s: %v\n", lamp.Name, err)
			continue
		}

		token := client.Publish(fmt.Sprintf("%d/lamps", lamp.RealEstateID), 0, false, string(message))
		token.Wait()

		time.Sleep(1 * time.Second)

	}
}

// GATES
func updateGateMeasurements(client mqtt.Client, gates []Device) {
	for _, gate := range gates {

		// Generate and publish measurement message
		registrationNumber := getRandomRegistrationNumber()

		measurement := GateMeasurement{
			gate.DeviceID,
			gate.Name,
			registrationNumber,
			time.Now(),
			false,
		}
		message, err := json.Marshal(measurement)
		if err != nil {
			fmt.Printf("Error serializing message for lamp %s: %v\n", gate.Name, err)
			continue
		}

		token := client.Publish(fmt.Sprintf("%d/gates", gate.RealEstateID), 0, false, string(message))
		token.Wait()

		time.Sleep(1 * time.Second)
		
	}
}

func getRandomRegistrationNumber() string {
	randomIndex := rand.Intn(len(registrationNumbers))
	return registrationNumbers[randomIndex]
}

// DHTS
func updateDHTMeasurements(client mqtt.Client, dhts []Device) {
	for _, dht := range dhts {
		// Generate and publish measurement message
		temperature, humidity := generateTemperatureAndHumidity()

		measurement := Measurement{
			dht.DeviceID,
			dht.Name,
			temperature,
			time.Now(),
		}
		message, err := json.Marshal(measurement)
		if err != nil {
			fmt.Printf("Error serializing message for lamp %s: %v\n", dht.Name, err)
			continue
		}

		token := client.Publish(fmt.Sprintf("%d/temperature", dht.RealEstateID), 0, false, string(message))
		token.Wait()

		measurement = Measurement{
			dht.DeviceID,
			dht.Name,
			humidity,
			time.Now(),
		}
		message, err = json.Marshal(measurement)
		if err != nil {
			fmt.Printf("Error serializing message for lamp %s: %v\n", dht.Name, err)
			continue
		}

		token = client.Publish(fmt.Sprintf("%d/humidity", dht.RealEstateID), 0, false, string(message))
		token.Wait()

		time.Sleep(1 * time.Second)
	}

}

func generateTemperatureAndHumidity() (float64, float64) {
	now := time.Now()
	season := "summer"
	if now.Month() < 3 || now.Month() > 9 {
		season = "winter"
	}

	isDay := now.Hour() >= 6 && now.Hour() < 18
	baseTemperature := generateBaseTemperature(season, isDay)
	baseHumidity := generateBaseHumidity(baseTemperature)

	// Connect temperature and humidity values
	temperature := baseTemperature + randomFloat(-1, 1)
	humidity := baseHumidity + randomFloat(-2, 2)

	return temperature, humidity
}

func generateBaseTemperature(season string, isDay bool) float64 {
	baseTemperature := 0.0
	switch season {
	case "summer":
		baseTemperature = randomFloat(25, 35)
	case "winter":
		baseTemperature = randomFloat(-5, 5)
	}

	if !isDay {
		baseTemperature -= 5
	}

	return baseTemperature
}

func generateBaseHumidity(baseTemperature float64) float64 {
	baseHumidity := randomFloat(40, 80)

	// Adjust base humidity based on temperature
	if baseTemperature > 30 {
		baseHumidity -= 5
	} else if baseTemperature < 10 {
		baseHumidity += 5
	}

	return baseHumidity
}

func randomFloat(min, max float64) float64 {
	return math.Round(min + rand.Float64()*(max-min))
}

// SOLAR PANELS
func updateSolarPanelMeasurements(client mqtt.Client, solarPanelSystems []SolarPanelSystem) {
	for _, solarPanelSystem := range solarPanelSystems {
		if solarPanelSystem.IsOn {
			totalEnergyPerMinute := 0.0
			for _, solarPanel := range solarPanelSystem.SolarPanels {
				irradiance := getSimulatedIrradiance(time.Now())
				totalEnergyPerMinute += calculateEnergyPerMinute(solarPanel.Size, solarPanel.SolarPanelEfficiency, irradiance)
			}
			res := fmt.Sprintf("%.2f", totalEnergyPerMinute)
			resFloat, err := strconv.ParseFloat(res, 64)

			measurement := Measurement{
				solarPanelSystem.DeviceID,
				solarPanelSystem.Name,
				resFloat,
				time.Now(),
			}
			message, err := json.Marshal(measurement)
			if err != nil {
				fmt.Printf("Error serializing message for lamp %s: %v\n", solarPanelSystem.Name, err)
				continue
			}

			token := client.Publish(fmt.Sprintf("%d/solarPanels", solarPanelSystem.RealEstateID), 0, false, string(message))
			token.Wait()
		}
	}
	time.Sleep(1 * time.Minute)

}

func calculateEnergyPerMinute(panelSize, panelEfficiency, irradiance float64) float64 {
	efficiencyDecimal := panelEfficiency / 100.0
	return (panelSize * irradiance * efficiencyDecimal) / 60.0
}

func getSimulatedIrradiance(currentTime time.Time) float64 {
	hour := currentTime.Hour()
	month := currentTime.Month()
	var irradiance float64

	// Dodavanje koeficijenta za godišnja doba
	seasonalCoefficient := getSeasonalCoefficient(month)

	if hour >= 6 && hour < 12 { // Morning
		irradiance = scaleIrradiance(hour-6) * seasonalCoefficient
	} else if hour >= 12 && hour < 18 { // Afternoon
		irradiance = scaleIrradiance(18-hour) * seasonalCoefficient
	} else { // Night
		irradiance = 0
	}

	return irradiance
}

func getSeasonalCoefficient(month time.Month) float64 {
	switch month {
	case time.December, time.January, time.February:
		return 0.75 // Zima
	case time.March, time.April, time.May:
		return 1.0 // Proleće
	case time.June, time.July, time.August:
		return 1.25 // Leto
	case time.September, time.October, time.November:
		return 1.0 // Jesen
	default:
		return 1.0
	}
}

func scaleIrradiance(hour int) float64 {
	return float64(hour * 10)
}

// CAR CHARGERS
func updateCarChargerMeasurements(client mqtt.Client, carChargers []Device) {
	time.Sleep(10 * time.Minute)

	for _, vehicle := range vehicles {
		vehicle.CarChargerID = getRandomCarCharger().DeviceID
		message, err := json.Marshal(vehicle)
		if err != nil {
			fmt.Printf("Error serializing message for vehicle %s: %v\n", vehicle.RegistrationNumber, err)
			continue
		}

		token := client.Publish("carCharger", 0, false, string(message))
		token.Wait()

	}
	time.Sleep(10 * time.Minute)

}

func getRandomCarCharger() Device {
	randomIndex := rand.Intn(len(carChargers))
	return carChargers[randomIndex]
}
