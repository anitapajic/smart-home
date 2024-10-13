import { EnergyTransaction } from "../../../models/VEU-devices/EnergyTransaction"
import { Frame, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Period } from "../../../models/Measure";
import EnergyTransactionService from "../../../services/DeviceService/EnergyTransactionService/EnergyTransactionService";
import ReactApexChart from "react-apexcharts";
import { InputContainer } from "../../../pages/NewRealEstatePage/NewRealEstatePage.styled";
import { AllInputContainer, FilterLabel, FilterSelect, FilterDate, FilterButton } from "../../device/deviceGraph/DeviceGraph.styled";
import { InfoContainer } from "../realEstateCard/RealEstateCard.styled";
import { CardContainer, CardsWrapper, ChartsContainer, ChartWithInputs, Name } from "./EnergyGraph.styled";



export interface EnergyGraphProps {
    transactions?: EnergyTransaction[]
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



export default function EnergyGraph() {
    const stompClient = over(new SockJS('http://localhost:8085/ws'));
    stompClient.debug = () => { };

    const { id } = useParams();
    const [transactionsToGrid, setTransactionsToGrid] = useState<EnergyTransaction[] | null>(null)
    const [transactionsFromGrid, setTransactionsFromGrid] = useState<EnergyTransaction[] | null>(null)
    const [selectedPeriod, setSelectedPeriod] = useState(periods[1]); // Default to 1 Hours
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedPeriod1, setSelectedPeriod1] = useState(periods[1]);
    const [startDate1, setStartDate1] = useState<Date | null>(null);
    const [endDate1, setEndDate1] = useState<Date | null>(null);
    const [period, setPeriod] = useState<Period>(
        {
            from: null,
            to: null,
            periodType: "h",
            period: 1,
        }
    )
    const [toGridChart, setToGridChart] = useState<any>({
        series: [
            {
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
    const [fromGridChart, setFromGridChart] = useState<any>({
        series: [
            {
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

    function getDataToGrid(measures: EnergyTransaction[]) {
        return measures.map(measure => ({
            x: new Date(new Date(measure.timestamp).getTime() + 60 * 60 * 1000),
            y: parseFloat(measure.toGrid.toFixed(2)),
        }));
    }
    function getDataFromGrid(measures: EnergyTransaction[]) {
        return measures.map(measure => ({
            x: new Date(new Date(measure.timestamp).getTime() + 60 * 60 * 1000),
            y: parseFloat(measure.fromGrid.toFixed(2)),
        }));
    }
    function getGraphToGrid(measures: EnergyTransaction[]) {
        const data = getDataToGrid(measures);
        console.log(data)
        setToGridChart((prevState: any) => ({
            ...prevState,
            series: [
                {
                    data: data,
                },
            ],
        }));
    }
    function getGraphFromGrid(measures: EnergyTransaction[]) {
        const data = getDataFromGrid(measures);
        setFromGridChart((prevState: any) => ({
            ...prevState,
            series: [
                {
                    data: data,
                },
            ],
        }));
    }

    function getTransactionsToGrid() {
        EnergyTransactionService.getEnergyTransactionsToGrid(Number(id), period).then(response => {
            let transactions: EnergyTransaction[] = response.data;
            setTransactionsToGrid(transactions);
            getGraphToGrid(transactions);

        }).catch(error => {
            console.error("Error fetching devices measures: ", error);
        })
    }

    function getTransactionsFromGrid() {
        console.log("aaa")
        EnergyTransactionService.getEnergyTransactionsFromGrid(Number(id), period).then(response => {
            let transactions: EnergyTransaction[] = response.data;
            setTransactionsFromGrid(transactions);
            getGraphFromGrid(transactions);

        }).catch(error => {
            console.error("Error fetching devices measures: ", error);
        })
    }
    useEffect(() => {
        getTransactionsToGrid()
        getTransactionsFromGrid();
    }, [])

    const onConnected = () => {
        stompClient.subscribe("energyTransactions", onMessageReceive);
    }

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
    }, [transactionsToGrid, transactionsFromGrid]);

    const onMessageReceive = (message: Frame) => {
        const newMeasure: EnergyTransaction = JSON.parse(message.body);

        // Check conditions
        if (newMeasure.realEstateId === Number(id) && selectedPeriod.label.match("1 Hour")) {
            // Update transactionsToGrid
            const updatedToGrid = transactionsToGrid ? [...transactionsToGrid, newMeasure] : [newMeasure];
            setTransactionsToGrid(updatedToGrid);

            // Remove measures older than 1 hour
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            const filteredToGrid = updatedToGrid.filter(
                measure => new Date(measure.timestamp) > oneHourAgo
            );
            
            getGraphToGrid(filteredToGrid);
        }
        // Check conditions
        if (newMeasure.realEstateId === Number(id) && selectedPeriod1.label.match("1 Hour")) {
            // Update transactionsFromGrid
            const updatedFromGrid = transactionsFromGrid ? [...transactionsFromGrid, newMeasure] : [newMeasure];
            setTransactionsFromGrid(updatedFromGrid);

            // Remove measures older than 1 hour
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            const filteredFromGrid = updatedFromGrid.filter(
                measure => new Date(measure.timestamp) > oneHourAgo
            );
            getGraphFromGrid(filteredFromGrid);
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
    const handlePeriodChange1 = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selected = periods.find((period) => period.label.match(selectedValue));
        if (selected) {
            setSelectedPeriod1(selected)
            if (!selected.label.match('-')) {
                setStartDate1(null);
                setEndDate1(null);
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
    const handleStartDateChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newDate = value ? new Date(value) : null;
        let newEndDate = endDate1;
        // Validate if the period is within the allowed range
        if (newDate && endDate1 && Math.abs(newDate.getTime() - endDate1.getTime()) > 30 * 24 * 60 * 60 * 1000) {
            // If the period exceeds 30 days, adjust the end date
            newEndDate = new Date(newDate.getTime() + 30 * 24 * 60 * 60 * 1000)
            setEndDate1(newEndDate);
        }

        setStartDate1(newDate);
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
    const handleEndDateChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newDate = value ? new Date(value) : null;
        let newStartDate = startDate1;

        // Validate if the period is within the allowed range
        if (startDate1 && newDate && Math.abs(startDate1.getTime() - newDate.getTime()) > 30 * 24 * 60 * 60 * 1000) {
            // If the period exceeds 30 days, adjust the start date
            newStartDate = new Date(newDate.getTime() - 30 * 24 * 60 * 60 * 1000)
            setStartDate1(newStartDate);
        }

        setEndDate1(newDate);
        setPeriod(
            {
                from: newStartDate,
                to: newDate,
                periodType: period.periodType,
                period: period.period,
            });
    };

    return (
        <>
            <CardsWrapper>
                <CardContainer>
                    <Name>To grid:</Name>
                    <InfoContainer>
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
                            <FilterButton onClick={getTransactionsToGrid}>Filter</FilterButton>
                        </AllInputContainer>
                        {transactionsToGrid && transactionsToGrid.length > 0 ? (
                            <ChartsContainer>
                                {/* First Chart for Transactions To Grid */}
                                <ChartWithInputs>
                                    <ReactApexChart options={toGridChart.options} series={toGridChart.series} type="line" height={350} />
                                </ChartWithInputs>
                            </ChartsContainer>
                        ) : (
                            <AllInputContainer>
                                <br />
                                <h2>No data</h2>
                            </AllInputContainer>
                        )}
                    </InfoContainer>
                </CardContainer>
                <CardContainer>
                    <Name>From grid:</Name>
                    <InfoContainer>
                        <AllInputContainer>
                            <InputContainer>
                                <FilterLabel htmlFor="periodDropdown">Select Period:</FilterLabel>
                                <FilterSelect id="periodDropdown" value={selectedPeriod1.label} onChange={handlePeriodChange1}>
                                    {periods.map((period) => (
                                        <option key={period.label} value={period.label}>
                                            {period.label}
                                        </option>
                                    ))}
                                </FilterSelect>
                            </InputContainer>
                            {selectedPeriod1.label.match('-') && (
                                <>
                                    <InputContainer>
                                        <FilterLabel>From: </FilterLabel>
                                        <FilterDate
                                            type="date"
                                            value={startDate1 ? startDate1.toISOString().split("T")[0] : ""}
                                            onChange={handleStartDateChange1}
                                            placeholder="Choose start date"
                                            isValid={true}
                                        />
                                    </InputContainer>
                                    <InputContainer>
                                        <FilterLabel>To: </FilterLabel>
                                        <FilterDate
                                            type="date"
                                            value={endDate1 ? endDate1.toISOString().split("T")[0] : ""}
                                            onChange={handleEndDateChange1}
                                            min={startDate1 ? startDate1.toISOString().split("T")[0] : ""}
                                            placeholder="Choose end date"
                                            isValid={true}
                                        />
                                    </InputContainer>
                                </>
                            )}
                            <FilterButton onClick={getTransactionsFromGrid}>Filter</FilterButton>
                        </AllInputContainer>
                        {transactionsFromGrid && transactionsFromGrid.length > 0 ? (
                            <ChartsContainer>
                                {/* First Chart for Transactions To Grid */}
                                <ChartWithInputs>
                                    <ReactApexChart options={fromGridChart.options} series={fromGridChart.series} type="line" height={350} />
                                </ChartWithInputs>
                            </ChartsContainer>
                        ) : (
                            <AllInputContainer>
                                <br />
                                <h2>No data</h2>
                            </AllInputContainer>
                        )}
                    </InfoContainer>
                </CardContainer>
            </CardsWrapper>
        </>
    )
}