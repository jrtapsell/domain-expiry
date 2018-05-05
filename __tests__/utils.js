const index = require("../index");

module.exports = {
    forEachDomain(data) {
        data.forEach((item) => {
            it("Testing: " + item.domain, async () => {
                try {
                    const expiry = await index.getExpiry(item.domain);
                    expect(expiry.getTime()).toEqual(new Date(item.date).getTime());
                } catch (err) {
                    expect(typeof err.message).toEqual("string");
                    expect(err.message).toEqual(item.error);
                }

            });
        });
    }
};

it("Utility file", async () => {});