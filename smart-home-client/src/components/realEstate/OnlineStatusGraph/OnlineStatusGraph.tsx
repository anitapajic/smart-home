import { useEffect, useState } from "react"
import { Measure, Period } from "../../../models/Measure"
import DeviceService from "../../../services/DeviceService/DeviceService"
import { InputContainer } from "../../../pages/NewRealEstatePage/NewRealEstatePage.styled";
import ReactApexChart from "react-apexcharts";
import { Frame, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from "react-router-dom";
import { convertToObject } from "typescript";
import { CardContainer, InfoContainer, Name } from "../../device/deviceCard/DeviceCard.styled";
import { AllInputContainer, FilterButton, FilterDate, FilterLabel, FilterSelect } from "./OnlineStatusGraph.styled";
import OnlineStatusService from "../../../services/DeviceService/OnlineStatusService/OnlineStatusService";
import { OnlineStatus } from "../../../models/OnlineStatus";
import { ChartWithInputs, ChartsContainer } from "../EnergyGraph/EnergyGraph.styled";
import { Device } from "../../../models/Device";


export interface GraphProps {
    device : Device
}
export const periods = [
    { label: "-", value: 0, type: "w" },
    { label: "1 Hour", value: 1, type: "mm" },
    { label: "6 Hours", value: 6, type: "h" },
    { label: "12 Hours", value: 12, type: "h" },
    { label: "24 Hours", value: 24, type: "h" },
    { label: "1 Week", value: 1, type: "w" },
    { label: "1 Month", value: 1, type: "m" },
];


export default function OnlineStatusGraph({device}: GraphProps) {

    const stompClient = over(new SockJS('http://localhost:8085/ws'));
    stompClient.debug = () => { };

    const { deviceId } = useParams();

    const [measures, setMeasures] = useState<OnlineStatus[] | null>(null)

    const [onlineStatus, setOnlineStatus] = useState<OnlineStatus[] | null>(null)

    const [selectedStatus, setSelectedStatus] = useState(""); // Dodato


    const [state, setState] = useState<any>({
        series: [
            {
                name: "",
                data: [],
            },
        ],
        options: {
            chart: {
                animations: {
                    enabled: false,
                },
                height: 350,
                type: 'bar',
                zoom: {
                    enabled: true
                },
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: true
                }
            },
            stroke: {
                curve: 'straight',
                width: 2, // Adjust the line width as needed

            },
            colors: ['#00a400'],
            dataLabels: {
                enabled: false,
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },

            xaxis: {
                type: 'datetime', // Assuming timestamp is a date
                title: {
                    text: 'Timestamp'
                }
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy HH:mm:ss', // customize the timestamp format as needed
                }
            },
            yaxis: {

                min: 0,
                max: 100,
                tickAmount: 11,
                title: {
                    text: 'Value'
                },
            },

        },


    })
    const [selectedPeriod, setSelectedPeriod] = useState(periods[1]); // Default to 1 Hours
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [period, setPeriod] = useState<Period>(
        {
            from: null,
            to: null,
            periodType: "h",
            period: 1,
        }
    )
    const [selectedTopic, setSelectedTopic] = useState("Online");
    const [uniqueTopics, setUniqueTopics] = useState<string[]>([]);


    function getGraph(measures: OnlineStatus[]) {
        const groupedData = groupMeasuresByInterval(measures);
        const data = getData(groupedData);
        setState((prevState: any) => ({
            ...prevState,
            series: [
                {
                    data: data,
                },
            ],
        }));
    }

    function groupMeasuresByInterval(measures: OnlineStatus[]) {
        const intervals = [];
        let currentTime = new Date(measures[0].timestamp);
        currentTime.setMinutes(0, 0, 0); // Reset minutes and seconds

        let intervalDuration;
        // console.log(selectedPeriod.type)
        switch (selectedPeriod.type) {
            case "mm":
                intervalDuration = 20 * 60 * 1000; // 10 minutes interval for hours
                break;
            case "h":
                intervalDuration = 60 * 60 * 1000; // 10 minutes interval for hours
                break;
            case "w":
                intervalDuration = 24 * 60 * 60 * 1000; // 24 hours interval for week
                break;
            case "m":
                intervalDuration = 24 * 60 * 60 * 1000; // 24 hours interval for month
                break;
            default:
                intervalDuration = selectedPeriod.value *60 * 60 * 1000; // default to hours
        }

        while (currentTime <= new Date(measures[measures.length - 1].timestamp)) {
            intervals.push({
                start: new Date(currentTime),
                end: new Date(currentTime.getTime() + intervalDuration),
            });
            currentTime = new Date(currentTime.getTime() + intervalDuration);
        }

        const groupedData = intervals.map((interval) => {
            const measuresInInterval = measures.filter(
                (measure) =>
                    new Date(measure.timestamp) >= interval.start &&
                    new Date(measure.timestamp) < interval.end
            );
            return {
                interval,
                truePercentage: getPercent(measuresInInterval, true),
                falsePercentage: getPercent(measuresInInterval, false),
            };
        });

        // console.log("GRUPISANI", groupedData);
        return groupedData;
    }


    function getPercent(measures: OnlineStatus[], value: boolean) {
        const totalMeasures = measures.length;
        const valueCount = measures.filter((measure) => measure.onlineStatus === value).length;

        // Adjust based on the selected topic
        if (selectedTopic === "Online") {
            return ((valueCount / totalMeasures) * 100).toFixed(2);
        } else {
            // Assuming Offline is the other option
            return (((totalMeasures - valueCount) / totalMeasures) * 100).toFixed(2);
        }
    }


    function getData(groupedData: any[]) {
        return groupedData.map((group) => ({
            x: group.interval.start,
            y: parseFloat(group.truePercentage),
        }));
    }



    function getMeasures() {
        OnlineStatusService.getAllOnlineStatus(Number(deviceId), period).then(response => {
            let onlineStatus: OnlineStatus[] = response.data;
            setOnlineStatus(onlineStatus);
            getGraph(onlineStatus)
            // console.log("STATUSSSS ", onlineStatus);
            // console.log(selectedTopic);



        }).catch(error => {
            console.error("Error fetching device's actions: ", error);
        });

    }





    useEffect(() => {
        getMeasures()

    }, [])

    useEffect(() => {

        if (!stompClient.connected) {
            stompClient.connect({}, onConnected, () => {
                console.log("Error connecting to WebSocket");
            });
        }

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect(() => {
                });
            }
        };
    }, [device.realEstate?.id]);

    const onConnected = () => {
        const baseTopic = `${device.realEstate?.id}/`;
        stompClient.subscribe(`${baseTopic}isOnline`, onMessageReceive);
    }


    const onMessageReceive = (message: Frame) => {
        const topic = (message.headers as any).destination
        //const newMeasure: Measure = JSON.parse(message.body)
        const newMeasure: OnlineStatus = JSON.parse(message.body)

        if (newMeasure.deviceId === Number(deviceId) && selectedPeriod.label.match("1 Hour") && selectedTopic?.match(topic)) {
            if (measures?.length === 0) {
                getMeasures()
                return
            }

            const updatedMeasures = measures ? [...measures, newMeasure] : [newMeasure];
            setMeasures(updatedMeasures);

            // Remove measures older than 1 hour
            const oneHourAgo = new Date(newMeasure.timestamp);
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            const filteredMeasures = updatedMeasures.filter(
                measure => new Date(measure.timestamp) > oneHourAgo
            );

            getGraph(filteredMeasures);
        }


    };



    const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selected = periods.find((period) => period.label.match(selectedValue));
        if (selected) {
            setSelectedPeriod(selected)
            if (!selected.label.match('-')) {
                setStartDate(null);
                setEndDate(null);
                setPeriod(
                    {
                        from: null,
                        to: null,
                        periodType: selected.type,
                        period: selected.value,
                    });
            }
        }
    };

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newDate = value ? new Date(value) : null;
        let newEndDate = endDate;
        // Validate if the period is within the allowed range
        if (newDate && endDate && Math.abs(newDate.getTime() - endDate.getTime()) > 30 * 24 * 60 * 60 * 1000) {
            // If the period exceeds 30 days, adjust the end date
            newEndDate = new Date(newDate.getTime() + 30 * 24 * 60 * 60 * 1000)
            setEndDate(newEndDate);
        }

        setStartDate(newDate);
        setPeriod(
            {
                from: newDate,
                to: newEndDate,
                periodType: period.periodType,
                period: period.period,
            });
    };


    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newDate = value ? new Date(value) : null;
        let newStartDate = startDate;

        // Validate if the period is within the allowed range
        if (startDate && newDate && Math.abs(startDate.getTime() - newDate.getTime()) > 30 * 24 * 60 * 60 * 1000) {
            // If the period exceeds 30 days, adjust the start date
            newStartDate = new Date(newDate.getTime() - 30 * 24 * 60 * 60 * 1000)
            setStartDate(newStartDate);
        }

        setEndDate(newDate);
        setPeriod(
            {
                from: newStartDate,
                to: newDate,
                periodType: period.periodType,
                period: period.period,
            });
    };

    const handleChangeTopic = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedTopic(selectedValue)
        getGraph(onlineStatus!)
    }


    return (
        <CardContainer >
            <InfoContainer>
                <Name>
                    {selectedTopic ? `${selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)} graph` : 'Online Status Graph'}
                </Name>
                <AllInputContainer>

                    <InputContainer>
                        <FilterLabel htmlFor="periodDropdown">Select Period:</FilterLabel>
                        <FilterSelect id="periodDropdown" value={selectedPeriod.label} onChange={handlePeriodChange}>
                            {periods.map((period) => (
                                <option key={period.label} value={period.label}>
                                    {period.label}
                                </option>
                            ))}
                        </FilterSelect>
                    </InputContainer>



                    {selectedPeriod.label.match('-') && (
                        <>
                            <InputContainer>
                                <FilterLabel>From: </FilterLabel>
                                <FilterDate
                                    type="date"
                                    value={startDate ? startDate.toISOString().split("T")[0] : ""}
                                    onChange={handleStartDateChange}
                                    placeholder="Choose start date"
                                    isValid={true}
                                />
                            </InputContainer>
                            <InputContainer>
                                <FilterLabel>To: </FilterLabel>
                                <FilterDate
                                    type="date"
                                    value={endDate ? endDate.toISOString().split("T")[0] : ""}
                                    onChange={handleEndDateChange}
                                    min={startDate ? startDate.toISOString().split("T")[0] : ""}
                                    placeholder="Choose end date"
                                    isValid={true}
                                />
                            </InputContainer>
                        </>
                    )}

                    <FilterButton onClick={getMeasures}>Filter</FilterButton>

                </AllInputContainer>



                {onlineStatus && onlineStatus?.length > 0 ? (
                    <>
                        <br />
                        <AllInputContainer>
                            <InputContainer>
                                <FilterLabel htmlFor="topicDropdown">Select measure:</FilterLabel>
                                <FilterSelect style={{ width: 250 }}
                                    id="topicDropdown"
                                    value={selectedTopic || ""}
                                    onChange={handleChangeTopic}
                                >
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </FilterSelect >
                            </InputContainer>

                        </AllInputContainer>
                        <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />

                    </>
                ) : (
                    <AllInputContainer>
                        <br />
                        <h2>No data</h2>
                    </AllInputContainer>
                )
                }


            </InfoContainer>
        </CardContainer>
    )

}