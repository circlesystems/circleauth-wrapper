# unicauth

Unicauth Wrapper - Node.js client

## Installation

### For [Node.js](https://nodejs.org/)

#### npm

Install it via:

```shell
npm install @habloapp/unicauth-wrapper --save
```

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var unicauthwrapper = require('@habloapp/unicauth-wrapper');

unicauthwrapper.configure({
  appKey: APPLICATION_APPKEY,
  readKey: APPLICATION_READKEY,
  writeKey: APPLICATION_WRITEKEY,
})
try {
  let data = await unicauthwrapper.create2FA(customID, returnUrl, webhookUrl, phone, email, question, userID, mobileReturnUrl)
  console.log('API called successfully. Returned data: ' + data);
} catch (error) {
  console.error(error);
}
```

## Documentation

* unicauthwrapper.configure(config)
* unicauthwrapper.create2FA(customID, returnUrl, webhookUrl, phone, email, question, userID, mobileReturnUrl)
* unicauthwrapper.getSession(s)
* unicauthwrapper.getUserSession(sessionID, userID)
* unicauthwrapper.expireUserSession(sessionID, userID)
