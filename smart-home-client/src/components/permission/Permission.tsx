import { useEffect, useState } from "react";
import { CustomInputLabel, InputContainer } from "../../pages/NewRealEstatePage/NewRealEstatePage.styled";
import { AddButton, AddPermissionButton, RemoveButton, StyledDeviceForm } from "../device/deviceForm/DeviceForm.styled";
import { CenteredDiv, HeaderWrapper, Title3 } from "../shared/styled/SharedStyles.styled";
import { ScrollableContainer, StyledPagination, StyledTable } from "../device/deviceActionTable/DeviceActionTable.styled";
import { NewPermission, Permission } from "../../models/Permission";
import PermissionService from "../../services/PermissionService/PermissionService";
import { Pagination, PaginationProps } from "semantic-ui-react";
import { CustomInput, DeviceFormFieldsContainer, StyledPermission } from "./Permission.styled";
import IconButton from "../shared/iconButton/IconButton";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


export type PermissionProps = {
    realEstate: number;
    device?: number;
};

export default function PermissionForm({
    realEstate,
    device,
}: PermissionProps) {


    const [username, setUsername] = useState('');
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [searchInput2, setSearchInput2] = useState('');


    const handlePageChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        if (typeof data.activePage === 'number') {
            setCurrentPage(data.activePage);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUsername(value);
        setSearchInput2(value);
    };

    useEffect(() => {
        if (device) {
            PermissionService.getAllDevicePermissions(device).then(response => {
                setPermissions(response.data);
            }).catch(error => {
                console.error("Error fetching real estates' devices: ", error);
            });
        }
        else {
            PermissionService.getAllRealEstatePermissions(realEstate).then(response => {
                setPermissions(response.data);
            }).catch(error => {
                console.error("Error fetching real estates' devices: ", error);
            });
        }

    }, [realEstate, device, refresh]);




    const handleAddPermission = () => {
        const permission: NewPermission = {
            id: 0,
            username: username,
            deviceId: device || 0,
            estateId: realEstate
        }

        if (device) {

            PermissionService.addDevicePermission(permission).then(response => {
                let newPermission: Permission = response.data;
                setPermissions(prevPermissions => [...prevPermissions!, newPermission]);
                setUsername('')

            }).catch(error => {
                setUsername('')
                alert("Invalid username")
            });
        }
        else {
            PermissionService.addRealEstatePermission(permission).then(response => {
                let newPermissions: Permission[] = response.data;
                setPermissions(prevPermissions => [...prevPermissions!, ...newPermissions]);
                setUsername('')

            }).catch(error => {
                setUsername('')
                alert("Invalid username")

            });
        }


    };


    const handleRemovePermission = (id: number) => {
        let permission: Permission = permissions?.filter(permission => permission.id === id)[0]!;
        let removePermission: NewPermission = {
            id: permission.id,
            username: permission.user.username,
            deviceId: permission.device.id,
            estateId: permission.estate.id
        }
        PermissionService.removeDevicePermission(removePermission).then(response => {
            console.log(response)
            const updatedPermissions = permissions!.filter((permission) => permission.id !== id);
            setPermissions(updatedPermissions);
        }).catch(error => {
            console.error("Error fetching real estates' devices: ", error);
        });
    };

    const handleRemoveAllPermissions = () => {
        let removePermission: NewPermission = {
            id: 0,
            username: username,
            deviceId: 0,
            estateId: realEstate
        }
        PermissionService.removeRealEstatePermission(removePermission).then(response => {
            console.log(response)
            setRefresh(!refresh)

        }).catch(error => {
            console.error("Error fetching real estates' devices: ", error);
        });
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

    const filteredPermissions = permissions?.filter(permission => {
        const matchesSearch = permission.user.username.toLowerCase().includes(searchInput2.toLowerCase());
        return matchesSearch;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalNumberOfPages = Math.ceil(filteredPermissions.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPermissions.slice(indexOfFirstItem, indexOfLastItem);


    return (
        <>
            <StyledPermission>
                <CenteredDiv >
                    <StyledDeviceForm style={{ minWidth: " 500px" }}>
                        <HeaderWrapper>
                            <Title3>Permissions</Title3>
                        </HeaderWrapper>
                        <DeviceFormFieldsContainer>
                            <InputContainer>
                                <CustomInput
                                    type="text"
                                    placeholder=""
                                    name="username"
                                    className={username.length > 0 ? '' : 'invalidInput'}
                                    value={username}
                                    onChange={handleInputChange}
                                />
                                <CustomInputLabel >Username</CustomInputLabel>
                                {device && (
                                    <>
                                        <AddButton style={{ marginTop: "5px" }} onClick={(event) => { event.preventDefault(); handleAddPermission(); }}>
                                            Add Permission
                                        </AddButton>
                                    </>
                                )}
                                {!device && (
                                    <>
                                        <div style={{ marginBottom: "10px" }}>
                                            <AddPermissionButton onClick={(event) => { event.preventDefault(); handleAddPermission(); }}>
                                                Add All Permissions
                                            </AddPermissionButton>
                                            <RemoveButton onClick={(event) => { event.preventDefault(); handleRemoveAllPermissions(); }}>
                                                Remove All Permissions
                                            </RemoveButton>
                                        </div>
                                       
                                    </>
                                )}
                            </InputContainer>
                        </DeviceFormFieldsContainer>
                        {currentItems.length > 0 && (
                            <>
                                <ScrollableContainer style={{ marginTop: "20px" }}>
                                    <StyledTable>
                                        <thead>
                                            <tr>
                                                <th>Real Estate</th>
                                                <th>Device</th>
                                                <th>Username</th>
                                                <th>Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems ? currentItems.map((permission: Permission) => (
                                                <tr key={permission.id}>
                                                    <td>{permission.estate.name}</td>
                                                    <td>{permission.device.name}</td>
                                                    <td>{highlightText(permission.user.username, searchInput2)}</td>

                                                    <td>
                                                        <IconButton
                                                            style={{ marginRight: 2 }}
                                                            icon={faTrash}
                                                            onClick={(event) => { event.preventDefault(); handleRemovePermission(permission.id) }}
                                                        />
                                                        
                                                    </td>
                                                </tr>
                                            )) :
                                                <>{permissions}</>}
                                        </tbody>
                                    </StyledTable>
                                </ScrollableContainer>
                                <StyledPagination>
                                    <Pagination
                                        activePage={currentPage}
                                        totalPages={totalNumberOfPages}
                                        onPageChange={handlePageChange}
                                    />
                                </StyledPagination>
                            </>
                        )}
                    </StyledDeviceForm>
                </CenteredDiv>
            </StyledPermission>
        </>
    )
}