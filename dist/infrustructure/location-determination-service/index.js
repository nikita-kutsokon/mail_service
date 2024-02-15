"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getContactLocationByIpAddress = async (ip) => {
    if (!ip)
        return undefined;
    try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.LOCATION_API_KEY}&ip=${ip}`);
        console.log(response);
        const { city, country_name, time_zone } = await response.json();
        return {
            city,
            country: country_name,
            timezone: time_zone.name
        };
    }
    catch (error) {
        return undefined;
    }
};
exports.default = {
    getContactLocationByIpAddress
};
//# sourceMappingURL=index.js.map