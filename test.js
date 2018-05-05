const index = require("./index");
const fs = require("fs");

const data = [];

if (fs.existsSync("./domains.json")) {
    data.push(...require("./domains.json"))
}

if (fs.existsSync("./localDomains.json")) {
    data.push(...require("./localDomains.json"))
}

data.forEach(item => {
    module.exports[item.domain] = (test) => {
        test.expect(1);
        index.getExpiry(item.domain)
          .then(p => {
              if (item.error) {
                  test.ok(false)
              } else {
                  test.equal(p.getTime(), new Date(item.date).getTime());
                  test.done();
              }
          }).catch(p => {
              if (item.error) {
                  test.equal(p.message, item.error);
                  test.done();
              } else {
                  test.ok(false);
              }
        });
    }
});