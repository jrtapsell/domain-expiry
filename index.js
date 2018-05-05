const net = require("net");
const moment = require("moment");

function grabWhois(domain, server) {
    if (server === null) {
        server = "whois.iana.org";
    }
    return new Promise((resolve, reject) => {
        try {

            const client = new net.Socket();

            let buffer = "";

            client.connect(43, server, () => client.write(domain + "\r\n"));

            client.on("data", (data) => buffer += data);
            client.on("close", () => resolve(buffer));
            client.on("error", (err) => reject(err));

        } catch (err) {
            reject(err);
        }
    });
}

function recursiveWhois(domain, server, resolve, reject) {
    grabWhois(domain, server)
      .then((data) => {
          let refer = data.match(/refer: *([^\s]+)/);
          if (refer) {
              let newServer = refer[1];
              if (newServer !== server) {
                  recursiveWhois(domain, newServer, resolve, reject);
              } else {
                  resolve(data);
              }
          } else {
              resolve(data);
          }
      }).catch(reject);
}

function whois(domain) {
    return new Promise((resolve, reject) => {
        recursiveWhois(domain, null, resolve, reject);
    });
}

const dateFormats = [
    {
        regex: /[0-9]{1,2}-[A-Z][a-z]{2}-[0-9]{4}/,
        handler: (date) => moment(date, "D-MMM-YYYY").toDate()
    },
    {
        regex: /([0-9]{2})\/([0-9]{2})\/([0-9]{4})/,
        handler: (date) => moment(date, "DD/MM/YYYY").toDate()
    },
    {
        regex: /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.[0-9]{1,3})?Z/,
        handler: (date) => moment(date).toDate()
    }
];

function parseDate(date) {
    return new Promise((resolve, reject) => {
        dateFormats.forEach((value) => {
            const match = date.match(value.regex);
            if (match) {
                resolve(value.handler(date));
            }
        });
        reject("Cannot parse: " + date);
    });
}


function getExpiry(domain) {
    if (typeof domain === "undefined") {
        return Promise.reject(new Error("Domain cannot be undefined"));
    }
    return whois(domain)
      .then((data) => {
          const expireLine = data.match(/(expiry|renewal)[^:]+:\s*([^\s]+)/i);
          if (expireLine) {
              return parseDate(expireLine[2]);
          }
          return Promise.reject(new Error("Cannot parse the whois data"));
      });
}

module.exports = {
    getExpiry
};