import { Pagination, PaginationProps } from "semantic-ui-react";
import { RealEstate } from "../../../models/RealEstate";
import { StyledPagination } from "../../device/deviceActionTable/DeviceActionTable.styled";
import { ItemsListStyle } from "../../shared/styled/SharedStyles.styled";
import RealEstateCard from "../realEstateCard/RealEstateCard";
import { useState } from "react";

export type RealEstateListProps = {
    realEstates: RealEstate[];
    isAdmin: boolean;
    isPermissionVisible : boolean;
    onAcceptRealEstate?: (realEstate: RealEstate) => void;
    onDeclineRealEstate?: (realEstate: RealEstate) => void;
    onDetails?: (realEstate: RealEstate) => void;
    searchInput? : string;
};

export default function RealEstateList({
    realEstates,
    isAdmin,
    isPermissionVisible,
    onAcceptRealEstate,
    onDeclineRealEstate,
    onDetails,
    searchInput
}: RealEstateListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 2;

    const totalNumberOfPages = Math.ceil(realEstates.length / itemsPerPage);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = realEstates?.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        if (typeof data.activePage === 'number') {
            setCurrentPage(data.activePage);
        }
    };
    return (
        <>
            <ItemsListStyle>
                {currentItems.map((realEstate: RealEstate) => (
                    <RealEstateCard
                        key={realEstate.id}
                        realEstate={realEstate}
                        isAdmin={isAdmin}
                        onAccept={() => onAcceptRealEstate?.(realEstate)}
                        onDecline={() => onDeclineRealEstate?.(realEstate)}
                        onDetails={() => onDetails?.(realEstate)} 
                        searchInput={searchInput}
                        isPermissionVisible = {isPermissionVisible}/>
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
    );
}