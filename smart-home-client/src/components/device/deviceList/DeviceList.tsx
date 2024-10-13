import { Device } from "../../../models/Device"
import DeviceCard from "../deviceCard/DeviceCard"
import { ItemsListStyle } from "../../shared/styled/SharedStyles.styled"
import { useState } from "react"
import { Pagination, PaginationProps } from "semantic-ui-react"
import { StyledPagination } from "../deviceActionTable/DeviceActionTable.styled"

export type DeviceListProps = {
    devices: Device[]
    onOnlineSwitchIcon(deviceId: number): void;
    onDetails: (device: Device) => void;
    searchInput? : string;
    isPermissionVisible: boolean;
}

export default function DeviceList({ devices, onOnlineSwitchIcon, onDetails, searchInput, isPermissionVisible}: DeviceListProps) {
   
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const totalNumberOfPages = Math.ceil(devices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = devices?.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        if (typeof data.activePage === 'number') {
            setCurrentPage(data.activePage);
        }
    };
    

    return (
        <>
            <ItemsListStyle>
                {currentItems?.map((device: Device) => (
                    <DeviceCard
                        key={device.id}
                        device={device}
                        onPowerOffIcon={onOnlineSwitchIcon}
                        onDetails={() => onDetails?.(device)}
                        showMore={false}
                        searchInput={searchInput}
                        isPermissionVisible = {isPermissionVisible}
                    />
                ))}
            </ItemsListStyle>
            {currentItems.length > 0 && (
                <StyledPagination>
                    <Pagination
                        activePage={currentPage}
                        totalPages={totalNumberOfPages}
                        onPageChange={handlePageChange}
                    />
                </StyledPagination>
            )}
        </>
    )
}