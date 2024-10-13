/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { RealEstate } from "../../../models/RealEstate";
import { ScrollableContainer, StyledPagination, StyledTable, TableWrapper } from "../../device/deviceActionTable/DeviceActionTable.styled";
import { Pagination, PaginationProps } from "semantic-ui-react";
import { useEffect, useState } from "react";

type RealEstatesTableProps = {
    realEstates: RealEstate[];
    searchInput?: string | undefined;
};
export default function RealEstatesTable({ realEstates, searchInput }: RealEstatesTableProps) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');


    function getPropertyValue<T extends object>(obj: T, path: string): any {
        return path.split('.').reduce((acc: any, part: string) => acc && acc[part], obj);
    }
    const sortRealEstates = () => {
        realEstates.sort((a, b) => {
            if (sortField === '') return 0;

            const fieldA = getPropertyValue(a, sortField);
            const fieldB = getPropertyValue(b, sortField);

            if (typeof fieldA === 'string' && typeof fieldB === 'string') {
                return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
            } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
                return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
            }

            return 0;
        });
    };

    useEffect(() => {
        sortRealEstates();
    }, [sortField, sortOrder, realEstates]);



    const handleSortChange = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const renderSortArrow = (field: string) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? '↑' : '↓';
        }
        return null;
    };

    const totalNumberOfPages = Math.ceil(realEstates.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = realEstates?.slice(indexOfFirstItem, indexOfLastItem);

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

    const handleButton2Click = (id: number) => {
        console.log("prelazak na stranicu")
        navigate(`/energy-consumption/${id}`)
    }

    return (
        <>
            <TableWrapper>
                <ScrollableContainer>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th onClick={() => handleSortChange('name')}>Name {renderSortArrow('name')}</th>
                                <th onClick={() => handleSortChange('address.country')}>Country {renderSortArrow('address.country')}</th>
                                <th onClick={() => handleSortChange('address.city')}>City {renderSortArrow('address.city')}</th>
                                <th onClick={() => handleSortChange('address.location')}>Street {renderSortArrow('address.location')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((realEstate) => (
                                    <tr key={realEstate.id} onClick={() => handleButton2Click(realEstate.id)}>
                                        <td>{highlightText(realEstate.name, searchInput)}</td>
                                        <td>{highlightText(realEstate.address.country, searchInput)}</td>
                                        <td>{highlightText(realEstate.address.city, searchInput)}</td>
                                        <td>{highlightText(realEstate.address.location, searchInput)}</td>
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