import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';
import { Address }  from '../../models/Address';

interface MapProps {
    markers: { id: number; lat: number; lng: number; title: string }[];
    handleAddressOnClick: (address: Address) => void;
}

const MapComponent: React.FC<MapProps> = ({ markers,handleAddressOnClick }:MapProps) => {
    const mapOptions = {
        center: [45.2671, 19.8335] as LatLngTuple,
        zoom: 13,
    };

    const tileLayerOptions = {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    };

    const [clickedPosition, setClickedPosition] = useState<[number, number] | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    const handleMapClick = (e: any) => {
        if (e.latlng) {
            setClickedPosition([e.latlng.lat, e.latlng.lng]);
            setShowPopup(true);
            console.log(address,"1")
        }
    };

  
    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    useEffect(() => {
        const fetchData = async () => {
            if (clickedPosition) {
                const [lat, lng] = clickedPosition;
                const apiKey = 'ba2dfb00dee14254a7ee9781cbf4adb8'; 

                try {
                    const response = await fetch(
                        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=en&pretty=1`
                    );

                    const data = await response.json();
                    const firstResult = data.results[0];

                    if (firstResult) {
                        const { city, country, road, house_number } = firstResult.components;
                        
                        const formattedAddress: Address={
                            location: `${road ? road + ' ' : ''}${house_number ? house_number  : ''}`,
                            city: `${city ? city : ''}`,
                            country: `${country || ''}`,
                            longitude: lng,
                            latitude: lat,
                        }
                        console.log(formattedAddress)
                        handleAddressOnClick(formattedAddress)
                    } else {
                        setAddress('Address not found');
                    }
                } catch (error) {
                    console.error('Error fetching address:', error);
                    setAddress('Error fetching address');
                }
            }
        };



        fetchData();
    }, [clickedPosition]);


    return (
        <MapContainer {...mapOptions} style={{ height: '100%', margin:"40px 20px 80px 40px"}}>
            <TileLayer {...tileLayerOptions} />
            {markers.map(marker => (
                <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={redIcon}>
                    <Popup>{marker.title}</Popup>
                </Marker>
            ))}
            {clickedPosition && (
                <Marker position={clickedPosition} icon={redIcon}>
                    <Popup>
                        {address ? (
                            <>
                                <div>Address:</div>
                                <div>{address}</div>
                            </>
                        ) : (
                            <div>Loading address...</div>
                        )}
                    </Popup>
                </Marker>
            )}
            <MapEventHandlers events={{ click: handleMapClick }} />
        </MapContainer>
    );
};

const MapEventHandlers: React.FC<{ events: { [key: string]: Function } }> = ({ events }) => {
    const map = useMapEvents(events);
    return null;
};

export default MapComponent;

