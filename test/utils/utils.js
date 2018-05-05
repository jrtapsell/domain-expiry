const index = require("../../index");

module.exports = {
    forEachDomain(data) {
        const ret = {};
        data.forEach(item => {
            ret[item.domain] = (test) => {
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
            };
        });
        return ret;
    }
};