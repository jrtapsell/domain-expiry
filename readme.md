# domain-expiry
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjrtapsell%2Fdomain-expiry.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjrtapsell%2Fdomain-expiry?ref=badge_shield)[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4cbab68172b64225bdb4da39d89a93ca)](https://www.codacy.com/app/jrtapsell/domain-expiry?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jrtapsell/domain-expiry&amp;utm_campaign=Badge_Grade)[![Build Status](https://travis-ci.org/jrtapsell/domain-expiry.svg?branch=master)](https://travis-ci.org/jrtapsell/domain-expiry)[![npm version](https://badge.fury.io/js/domain-expiry.svg)](https://badge.fury.io/js/domain-expiry)[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1824/badge)](https://bestpractices.coreinfrastructure.org/projects/1824)[![codecov](https://codecov.io/gh/jrtapsell/domain-expiry/branch/master/graph/badge.svg)](https://codecov.io/gh/jrtapsell/domain-expiry)


# Features
- Allows checking the expiry date of a domain

# Usage
    const domain = require("domain-expiry");
    domain.getExpiry("jrtapsell.co.uk")
        .then(p => console.log("jrtapsell.co.uk expires on: " + p));

[RunKit](https://runkit.com/embed/1yqqvcyhpydi)

# Supported TLDs

This list is not exhaustive, if TLDs are not supported feel free to open an issue on GitHub.

- .uk
- .com
- .org
- .tech
- .net

See wiki for more information.

# Issues

Feel free to raise any issues on the linked Github repository.

# Contribution

Feel free to submit PRs to the linked Github repository.

PRs should have no issues on Codacy, and pass the tests on Travis.

# Vulnerabilities

If you wish to report a vulnerability publicly, feel free to use GitHub, or if it is more serious, or you wish to remain anonymous, contact me via [Keybase](https://keybase.io/jrtapsell).
## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjrtapsell%2Fdomain-expiry.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjrtapsell%2Fdomain-expiry?ref=badge_large)