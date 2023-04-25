import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const GoogleMapWrapper = ({ setCoord, location, height = '250px' }) => {

    //we neeed return data by props 
    const [localitation, setlocalitation] = useState({ lat: 18.849296, lng: -99.200293 });

    const containerStyle = {
        width: '100%',
        height,
    };

    let center = {};
    location ? center = { lat: location.lat, lng: location.lng } : center = {
        lat: 18.851596018716762,
        lng: -99.2007897875399
    }


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCzWqVdxNVIAEru0dS3PJnMocuyEfQxDfI'
    })

    const [map, setMap] = React.useState(null)


    const onClick = ({ latLng }) => {

        setlocalitation({
            lat: latLng.lat((e) => e),
            lng: latLng.lng((e) => e)
        })

        setCoord({
            lat: latLng.lat((e) => e),
            lng: latLng.lng((e) => e)
        })
    }

    const onMarkerClick = (props, marker, e) => {
    }
    useEffect(() => {
    },[])


    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={15}
            center={localitation ? localitation : center}
            onClick={onClick}
        >
            {
                location ?
                    (<Marker onClick={onMarkerClick} draggable={false} title={'Lugar de incidencia'} name={'Report'}
                        position={location}
                    />) :
                    (<Marker
                        onClick={onMarkerClick} draggable={false} title={'Lugar de incidencia'} name={'Report'}
                        position={{ lat: localitation.lat, lng: localitation.lng }}
                    />)
            }
        </GoogleMap>
    ) : <></>

}

export default React.memo(GoogleMapWrapper);