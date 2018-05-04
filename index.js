const net = require("net");
const moment = require("moment");

function grabWhois(domain, server) {
    if (server === undefined) {
        server = "whois.iana.org";
    }
    if (domain === undefined) {
        return Promise.reject("Domain cannot be undefined");
    }
    return new Promise((resolve, reject) => {
        try {

            const client = new net.Socket();

            let buffer = "";

            client.connect(43, server, function () {
                client.write(domain + "\r\n");
            });

            client.on("data", function (data) {
                buffer += data;
            });

            client.on("close", function () {
                resolve(buffer);
            });

            client.on("error", function (err) {
                reject(err);
            });
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
        recursiveWhois(domain, undefined, resolve, reject)
    })
}


function parseDate(date) {
    return new Promise((resolve, reject) => {
        let textual = date.match(/[0-9]{1,2}-[A-Z][a-z]{2}-[0-9]{4}/);
        if (textual) {
            resolve(moment(date, "D-MMM-YYYY").toDate());
        }
        let ukForm = date.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/);
        if (ukForm) {
            resolve(moment(date, "DD/MM/YYYY").toDate());
        }
        let iso = date.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.[0-9]+)?Z/);
        if (iso) {
            resolve(moment(date).toDate());
        }
        reject("Cannot parse: " + date);
    })
}


function getExpiry(domain) {
    return whois(domain)
      .then(data => {
          const expireLine = data.match(/expiry date:\s*([^\s]+)/i);
          if (expireLine) {
              return parseDate(expireLine[1]);
          }
          return Promise.reject("Cannot parse the whois data\n" + data);
      })
}

module.exports = {
    getExpiry
};