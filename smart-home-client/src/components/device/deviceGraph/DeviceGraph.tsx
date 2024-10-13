import { useEffect, useState } from "react"
import { CardContainer, InfoContainer, Name } from "../deviceCard/DeviceCard.styled"
import { Measure, Period } from "../../../models/Measure"
import DeviceService from "../../../services/DeviceService/DeviceService"
import { InputContainer } from "../../../pages/NewRealEstatePage/NewRealEstatePage.styled";
import ReactApexChart from "react-apexcharts";
import { AllInputContainer, FilterButton, FilterDate, FilterLabel, FilterSelect } from "./DeviceGraph.styled";
import { Frame, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from "react-router-dom";
import { Device } from "../../../models/Device";


export interface GraphProps {
    device: Device
}
export const periods = [
    { label: "-", value: 0, type: "h" },
    { label: "1 Hour", value: 1, type: "h" },
    { label: "6 Hours", value: 6, type: "h" },
    { label: "12 Hours", value: 12, type: "h" },
    { label: "24 Hours", value: 24, type: "h" },
    { label: "1 Week", value: 1, type: "w" },
    { label: "1 Month", value: 1, type: "m" },
];




export default function DeviceGraph({device}: GraphProps) {
    const stompClient = over(new SockJS('http://localhost:8085/ws'));

    stompClient.debug = () => { };

    const { deviceId } = useParams();

    const [measures, setMeasures] = useState<Measure[] | null>(null)
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
                type: 'line',
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
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [uniqueTopics, setUniqueTopics] = useState<string[]>([]);


    function getUniqueTopics(measures: Measure[]) {
        const topicsSet = new Set(measures.map(measure => measure.topic));
        return Array.from(topicsSet);
    }

    function getData(topic: string, measures: Measure[]) {
        // console.log(measures[measures.length-1].timestamp)
        // console.log(new Date(measures[measures.length-1].timestamp) )
        return measures.filter(measure => measure.topic === topic)
            .map(measure => ({
                x: new Date(new Date(measure.timestamp).getTime() + 60 * 60 * 1000),
                y: parseFloat(measure.value.toFixed(2)),
            }));
    }

    function getGraph(measures: Measure[], topic: string) {
        const data = getData(topic, measures);
        setState((prevState: any) => ({
            ...prevState,
            series: [
                {
                    name: topic,
                    data: data,
                },

            ],

        }));
    }

    function getMeasures() {
        DeviceService.getDeviceMeasures(Number(deviceId), period).then(response => {
            let measures: Measure[] = response.data;
            setMeasures(measures);

            if (uniqueTopics.length === 0) {
                const uniqueTopics = getUniqueTopics(measures);
                setUniqueTopics(uniqueTopics);
                setSelectedTopic(uniqueTopics[0])
                if (uniqueTopics.length > 0) {
                    getGraph(measures, uniqueTopics[0]);
                }
            }
            else {
                getGraph(measures, selectedTopic!);
            }

        }).catch(error => {
            console.error("Error fetching devices measures: ", error);
        })
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
    }, [selectedTopic, measures, device.realEstate?.id]);

    const onConnected = () => {
        const baseTopic = `${device.realEstate?.id}/`;
        stompClient.subscribe(`${baseTopic}temperature`, onMessageReceive);
        stompClient.subscribe(`${baseTopic}humidity`, onMessageReceive);
        stompClient.subscribe(`${baseTopic}lamps`, onMessageReceive);
    }


    const onMessageReceive = (message: Frame) => {
        const topic = (message.headers as any).destination
        const newMeasure: Measure = JSON.parse(message.body)
        newMeasure.topic = topic
        if (newMeasure.deviceId === Number(deviceId) && selectedPeriod.label.match("1 Hour") && selectedTopic?.match(topic)) {
            if(measures?.length === 0){
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

            getGraph(filteredMeasures, topic);
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
        getGraph(measures!, selectedValue)
    }


    return (
        <CardContainer >
            <InfoContainer>
                <Name>
                    {selectedTopic ? `${selectedTopic.split("/").at(1)!.charAt(0).toUpperCase() + selectedTopic.split("/").at(1)!.slice(1)} graph` : 'Graph'}
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



                {measures && measures?.length > 0 ? (
                    <>
                        <br />
                        <AllInputContainer>
                            <InputContainer>
                                <FilterLabel htmlFor="topicDropdown">Select measure:</FilterLabel>
                                <FilterSelect style={{ width: 250 }}
                                    id="topicDropdown"
                                    value={selectedTopic! || ""}
                                    onChange={handleChangeTopic}
                                >
                                    {uniqueTopics.map((topic) => (
                                        <option key={topic} value={topic}>
                                            {topic.split("/").at(1)}
                                        </option>
                                    ))}
                                </FilterSelect >
                            </InputContainer>

                        </AllInputContainer>
                        <ReactApexChart options={state.options} series={state.series} type="line" height={350} />

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