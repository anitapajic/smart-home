import { useNavigate } from "react-router-dom";
import { CityDTO } from "../../../models/CityDTO";
import { ScrollableContainer, StyledPagination, StyledTable, TableWrapper } from "../../device/deviceActionTable/DeviceActionTable.styled";
import { useEffect, useState } from "react";
import { Pagination, PaginationProps } from "semantic-ui-react";

type CitiesTableProps = {
    cities: CityDTO[];
    searchInput?: string | undefined;
};
export default function CitiesTable({ cities, searchInput }: CitiesTableProps) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortedCities, setSortedCities] = useState<CityDTO[]>([]);
    const [sortField, setSortField] = useState<keyof CityDTO | ''>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


    useEffect(() => {
        const sorted = [...cities].sort((a, b) => {
            if (!sortField) return 0;

            const valueA = a[sortField];
            const valueB = b[sortField];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
            }

            return 0;
        });
        setSortedCities(sorted);
    }, [cities, sortField, sortOrder]);
    

    const handleSortChange = (field: keyof CityDTO) => {
        setSortField(field);
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    const renderSortArrow = (field: string) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? '↑' : '↓';
        }
        return null; 
    };

    const totalNumberOfPages = Math.ceil(sortedCities.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedCities?.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        if (typeof data.activePage === 'number') {
            setCurrentPage(data.activePage);
        }
    };

    const highlightText = (text: string, search: string | undefined) => {
        if (!search?.trim()) {
            return text;
        }

        const regex = new RegExp(`(${search})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
        );
    };

    const handleButton2Click = (city: string) => {
        navigate(`/energy-consumption2/${city}`)
    }
    return (
        <>
            <TableWrapper>
                <ScrollableContainer>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th onClick={() => handleSortChange('city')}>City {renderSortArrow('city')}</th>
                                <th onClick={() => handleSortChange('numOfRE')}>Number of real estates {renderSortArrow('numOfRE')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((city) => (
                                    <tr key={city.city} onClick={() => handleButton2Click(city.city)}>
                                    <td>{highlightText(city.city, searchInput)}</td>
                                    <td>{highlightText(city.numOfRE.toString(), searchInput)}</td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}><h2>No data</h2></td>
                                </tr>
                            )}
                        </tbody>
                    </StyledTable>
                </ScrollableContainer>
                {currentItems.length > 0 && (
                    <StyledPagination>
                        <Pagination
                            activePage={currentPage}
                            totalPages={totalNumberOfPages}
                            onPageChange={handlePageChange}
                        />
                    </StyledPagination>
                )}
            </TableWrapper>
        </>
    )
}