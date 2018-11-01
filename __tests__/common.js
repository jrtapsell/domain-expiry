const utils = require("./utils");

const data = [
    {"domain": "jrtapsell.co.uk", "date": "2022-12-03T00:00:00.000Z"},
    {"domain": "google.com", "date": "2020-09-14T04:00:00Z"},
    {"domain": "facebook.com", "date": "2028-03-30T04:00:00Z"},
    {"domain": "nxdomain.nxdomain", "error": "Cannot parse the whois data"},
    {"domain": undefined, "error": "Domain cannot be undefined"}
];

module.exports = utils.forEachDomain(data);
