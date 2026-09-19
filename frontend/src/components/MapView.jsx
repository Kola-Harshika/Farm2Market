import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { mapService } from '../services/mapService';
import { Award } from 'lucide-react';

export const MapView = ({
  farmerLocation = { latitude: 17.3850, longitude: 78.4867 },
  markets = [],
  bestOption = null
}) => {

  const farmerPos = [farmerLocation.latitude, farmerLocation.longitude];

  // Icons
  const farmerIcon = mapService.createFarmerIcon();
  const bestIcon = mapService.createBestMandiIcon();
  const mandiIcon = mapService.createMandiIcon();

  // Polyline coordinates for best mandi route
  const bestRouteCoords = bestOption
    ? [farmerPos, [bestOption.latitude, bestOption.longitude]]
    : [];

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/15 shadow-sm overflow-hidden space-y-2">
      <div className="p-4 border-b border-emerald-900/10 flex items-center justify-between">
        <div>
          <h4 className="text-base sm:text-lg font-black text-emerald-950">
            Interactive Mandi Geographic Network
          </h4>
          <p className="text-xs text-emerald-900/60 font-semibold">
            OpenStreetMap geospatial visualization with road freight linkages
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
          Leaflet GIS Engine
        </span>
      </div>

      <div className="h-80 sm:h-96 w-full relative z-0">
        <MapContainer
          center={farmerPos}
          zoom={9}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Farmer Location Pin */}
          <Marker position={farmerPos} icon={farmerIcon}>
            <Popup>
              <div className="p-1 text-xs">
                <b className="text-emerald-800 text-sm">📍 Your Location</b>
                <p className="mt-1 text-slate-600">Farmer origin point ({farmerLocation.latitude.toFixed(3)}, {farmerLocation.longitude.toFixed(3)})</p>
              </div>
            </Popup>
          </Marker>

          {/* Connect Best Mandi with Route Line */}
          {bestRouteCoords.length > 0 && (
            <Polyline
              positions={bestRouteCoords}
              color="#2B9348"
              weight={4}
              dashArray="6, 8"
              opacity={0.8}
            />
          )}

          {/* Mandi Pins */}
          {markets.map((m) => {
            const isBest = bestOption && bestOption.mandi_id === m.mandi_id;
            const pos = [m.latitude, m.longitude];

            return (
              <Marker
                key={m.mandi_id}
                position={pos}
                icon={isBest ? bestIcon : mandiIcon}
              >
                <Popup>
                  <div className="p-1.5 text-xs space-y-1 max-w-[200px]">
                    {isBest && (
                      <div className="flex items-center gap-1 text-[11px] font-black text-emerald-700 uppercase">
                        <Award className="w-3.5 h-3.5" /> Best Option
                      </div>
                    )}
                    <div className="font-extrabold text-sm text-emerald-950">
                      {m.mandi_name}
                    </div>
                    <div className="text-slate-500">
                      {m.district} • {m.road_distance_km || m.distance_km} km away
                    </div>
                    <div className="pt-1 border-t border-slate-100 flex justify-between font-bold">
                      <span>Hist. Price:</span>
                      <span className="text-emerald-900">₹{m.historical_comparable_price?.toLocaleString()}/q</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Est. Freight:</span>
                      <span className="text-rose-700">₹{m.estimated_transport_cost?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-black text-emerald-800 pt-0.5 border-t border-slate-100">
                      <span>Est. Net:</span>
                      <span>₹{m.estimated_net_value?.toLocaleString()}</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${farmerLocation.latitude},${farmerLocation.longitude}&destination=${m.latitude},${m.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block text-center bg-emerald-800 text-white py-1 px-2 rounded-lg font-bold hover:bg-emerald-700"
                    >
                      Get Driving Route
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-emerald-950 font-bold">
          <span className="flex items-center gap-1">🚜 Farmer</span>
          <span className="flex items-center gap-1">⭐ Recommended Mandi</span>
          <span className="flex items-center gap-1">🏢 Alternative Mandis</span>
        </div>
        <span className="text-[11px] text-emerald-900/60 italic">
          Click any mandi pin to view net price calculations & directions.
        </span>
      </div>
    </div>
  );
};
