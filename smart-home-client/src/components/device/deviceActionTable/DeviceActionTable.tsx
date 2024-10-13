import { useEffect, useState } from "react";
import { Action } from "../../../models/Action";
import { formatDateTime } from "../../../utils/functions/formatDateTime";
import { ScrollableContainer, StyledPagination, StyledTable, TableWrapper } from "./DeviceActionTable.styled";
import { Pagination, PaginationProps } from "semantic-ui-react";
import '../../../../node_modules/semantic-ui-css/semantic.min.css';

type DeviceActionTableProps = {
    actions: Action[];
    searchInput: string;
};
export default function DeviceActionTable({ actions, searchInput }: DeviceActionTableProps) {
    const [sortedActions, setSortedActions] = useState(actions);
    const [sortField, setSortField] = useState<string>('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    useEffect(() => {
        const newSortedActions = [...actions].sort((a, b) => {
            if (sortField === 'timestamp') {
                return sortOrder === 'asc' ?
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() :
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }

            let valueA = a[sortField as keyof Action];
            let valueB = b[sortField as keyof Action];
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();

            return sortOrder === 'asc' ?
                valueA > valueB ? 1 : (valueA < valueB ? -1 : 0) :
                valueA < valueB ? 1 : (valueA > valueB ? -1 : 0);
        });
        setSortedActions(newSortedActions);
    }, [actions, sortField, sortOrder]);


    const onSortChange = (field: string) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const renderSortArrow = (field: string) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? '↑' : '↓';
        }
        return null;
    };

    const totalNumberOfPages = Math.ceil(sortedActions.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedActions.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        if (typeof data.activePage === 'number') {
            setCurrentPage(data.activePage);
        }
    };

    const highlightText = (text: string, search: string) => {
        if (!search.trim()) {
            return text;
        }

        const regex = new RegExp(`(${search})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
        );
    };
    return (
        <TableWrapper>
            <ScrollableContainer>
                <StyledTable>
                    <thead>
                        <tr>
                            <th onClick={() => onSortChange('timestamp')}>Date and time {renderSortArrow('timestamp')}</th>
                            <th onClick={() => onSortChange('username')}>Username {renderSortArrow('username')}</th>
                            <th onClick={() => onSortChange('userFullName')}>Name {renderSortArrow('userFullName')}</th>
                            <th onClick={() => onSortChange('actionName')}>Action description {renderSortArrow('actionName')}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((action) => (
                                <tr key={action.deviceId}>
                                    <td>{formatDateTime(action.timestamp)}</td>
                                    <td>{highlightText(action.username, searchInput)}</td>
                                    <td>{highlightText(action.userFullName, searchInput)}</td>
                                    <td>{highlightText(action.actionName, searchInput)}</td>
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
    )
}