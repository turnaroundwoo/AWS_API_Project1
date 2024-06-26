import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  LocationClient,
  SearchPlaceIndexForTextCommand,
} from "@aws-sdk/client-location";
import { awsConfig, mapConfig } from "../aws-exports"; // aws-exports.js에서 awsConfig를 import합니다.

const Map = () => {
  const [locations, setLocations] = useState([]);
  const { mapKey } = mapConfig; // awsConfig에서 mapKey를 가져옵니다.
  const mapStyles = [
    {
      elementType: "geometry",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#8ec3b9" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1a3646" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [{ color: "#4b6878" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#64779e" }],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [{ color: "#4b6878" }],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [{ color: "#334e87" }],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [{ color: "#023e58" }],
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#283d6a" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6f9ba5" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{ color: "#023e58" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#3C7680" }],
    },
    {
      featureType: "road",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#304a7d" }],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#98a5be" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#2c6675" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#255763" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#b0d5ce" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#023e58" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [{ color: "#98a5be" }],
    },
    {
      featureType: "transit",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d2c4d" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [{ color: "#283d6a" }],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#3a4762" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0e1626" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#4e6d70" }],
    },
  ];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const client = new LocationClient(awsConfig); // awsConfig를 사용하여 LocationClient를 생성합니다.

        const newLocations = [];
        const awsRegions = [
          { name: "us-east-1", label: "미국 동부 (버지니아 북부)" },
          { name: "us-east-2", label: "미국 동부 (오하이오)" },
          { name: "us-west-1", label: "미국 서부 (캘리포니아)" },
          { name: "us-west-2", label: "미국 서부 (오레곤)" },
          { name: "ap-south-1", label: "아시아 태평양 (뭄바이)" },
          { name: "ap-northeast-3", label: "아시아 태평양 (오사카)" },
          { name: "ap-northeast-2", label: "아시아 태평양 (서울)" },
          { name: "ap-southeast-1", label: "아시아 태평양 (싱가포르)" },
          { name: "ap-southeast-2", label: "아시아 태평양 (시드니)" },
          { name: "ap-northeast-1", label: "아시아 태평양 (도쿄)" },
          { name: "ca-central-1", label: "캐나다 (중부)" },
          { name: "eu-central-1", label: "유럽 (프랑크푸르트)" },
          { name: "eu-west-1", label: "유럽 (아일랜드)" },
          { name: "eu-west-2", label: "유럽 (런던)" },
          { name: "eu-west-3", label: "유럽 (파리)" },
          { name: "eu-north-1", label: "유럽 (스톡홀름)" },
          { name: "sa-east-1", label: "남아메리카 (상파울루)" },
        ];

        for (const region of awsRegions) {
          const command = new SearchPlaceIndexForTextCommand({
            IndexName: "myindex",
            Text: region.label, // 변경된 부분: 지역 레이블을 사용하여 검색
            MaxResults: 1,
          });

          const response = await client.send(command);
          if (response.Results.length > 0) {
            const place = response.Results[0].Place;
            newLocations.push({
              name: region.label,
              lat: place.Geometry.Point[1],
              lng: place.Geometry.Point[0],
            });
          }
        }
        setLocations(newLocations);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocations();

    // Cleanup function
    return () => {
      // Cleanup 코드가 여기 들어갈 수 있습니다.
    };
  }, []);

  // 마커가 표시될 위치의 평균 값을 계산합니다.
  const calculateAverageLocation = () => {
    if (locations.length === 0) return null;

    let sumLat = 0;
    let sumLng = 0;

    locations.forEach((location) => {
      sumLat += location.lat;
      sumLng += location.lng;
    });

    const avgLat = sumLat / locations.length;
    const avgLng = sumLng / locations.length;

    return { lat: avgLat, lng: avgLng };
  };

  const mapContainerStyle = {
    width: "80%",
    height: "100%",
  };

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={mapKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={calculateAverageLocation()} // 평균 위치를 지도의 중심으로 설정합니다.
          zoom={2}
          options={{ styles: mapStyles }}
        >
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              label={location.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
