"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationByIpAddress = void 0;
const API_KEY = process.env.LOCATION_API_KEY;
const getLocationByIpAddress = async (ip) => {
    if (!ip)
        return undefined;
    try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${Array.isArray(ip) ? ip[0] : ip}`);
        const { city, country_name, time_zone } = await response.json();
        return {
            city,
            country: country_name,
            timezone: time_zone.name
        };
    }
    catch {
        return undefined;
    }
};
exports.getLocationByIpAddress = getLocationByIpAddress;
//# sourceMappingURL=contactLocation.service.js.map