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
    },
    {
        regex: /([0-9]{4})-([0-9]{2})-([0-9]{2})/,
        handler: (date) => moment(date, "YYYY-MM-DD").toDate()
    },
    {
        regex: /([0-9]{2}).([0-9]{2}).([0-9]{4})/,
        handler: (date) => moment(date, "DD.MM.YYYY").toDate()
    },
    {
        regex: /([0-9]{2})-([0-9]{2})-([0-9]{4})/,
        handler: (date) => moment(date, "DD-MM-YYYY").toDate()
    },
    {
        regex: /([0-9]{2}).([0-9]{1}).([0-9]{4})/,
        handler: (date) => moment(date, "DD.M.YYYY").toDate()
    },
    {
        regex: /([0-9]{4}).([0-9]{2}).([0-9]{2})/,
        handler: (date) => moment(date, "YYYY.MM.DD").toDate()
    },
    {
        regex: /([0-9]{4})\/([0-9]{2})\/([0-9]{2})/,
        handler: (date) => moment(date, "YYYY/MM/DD").toDate()
    },
    {
        regex: /([0-9]{4})([0-9]{2})([0-9]{2})/,
        handler: (date) => moment(date, "YYYYMMDD").toDate()
    },
    {
        regex: /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z/,
        handler: (date) => moment(date).toDate()
    },
    {
        regex: /[0-9]{2}-[a-z]{3}-[0-9]{4}/i,
        handler: (date) => moment(date, "DD-MMM-YYYY").toDate()
    },
    {
        regex: /[a-z]{1,10} [0-9]{2} [0-9]{4}/i,
        handler: (date) => moment(date,"MMMM DD YYYY").toDate()
    },


];
 

function parseDate(date) {


        for(let i = 0; i < dateFormats.length; i++)
        {
              let value = dateFormats[i];

              const match = date.match(value.regex);
                    
              if (match) 
              {
         
                  return value.handler(date);
              }
          
        }
 

        return null;
    
}


function getExpiry(domain) {
    if (typeof domain === "undefined") {
        return Promise.reject(new Error("Domain cannot be undefined"));
    }
    return whois(domain)
      .then((data) => {
          
          let lines = data.split(/\r\n|\n\r|\n|\r/);


          for (var i = 0; i < lines.length; i++) 
          {
            
             let line = lines[i];
 
             //console.log( "Line: " + line);
              
             const expireLine = line.match(/(expir|renew|valid|paid)[^:]+:\s*([^\s]+)/i);

             if (expireLine) 
             {
                
                const line_split = line.split(":");

                let date = line_split[1].trim();

                //console.log("expireLine :"+ expireLine);
                //console.log("Found expirline " + date);
                //console.log("Found line " + line);
                
                let parse_result = parseDate(date);

                if ( parse_result != null )
                { 
                       return Promise.resolve(parse_result);
                }

 
              }

          }

 
          return Promise.reject(new Error("Cannot parse the whois data"));
      });
}

module.exports = {
    getExpiry
};
