# Circle Auth Wrapper

Circle Auth Wrapper - Node.js client for [Circle Auth API](https://circleauth.gocircle.ai/docs/)
<br>

Circle Auth allows you to quickly implement userless/passwordless login and 2FA (no more paying for SMS to have 2FA)

## Installation

First make sure to get your credentials on [Circle Auth Console](https://console.gocircle.ai/), if you want to test first, use [Circle Auth - Demo](https://circleauth.gocircle.ai/demo)

### For [Node.js](https://nodejs.org/)

#### npm

Install it via:

```shell
npm install @circlesystems/circleauth-wrapper --save
```

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var circleauthwrapper = require('@circlesystems/circleauth-wrapper');

circleauthwrapper.configure({
  appKey: APPLICATION_APPKEY,
  readKey: APPLICATION_READKEY,
  writeKey: APPLICATION_WRITEKEY,
})
try {
  let data = await circleauthwrapper.create2FA(customID, returnUrl, webhookUrl, phone, email, question, userID, mobileReturnUrl)
  console.log('API called successfully. Returned data: ' + data);
} catch (error) {
  console.error(error);
}
```

## Documentation

* circleauthwrapper.configure(config)
* circleauthwrapper.create2FA(customID, returnUrl, webhookUrl, phone, email, question, userID, mobileReturnUrl)
* circleauthwrapper.getSession(sessionID)
* circleauthwrapper.getUserSession(sessionID, userID)
* circleauthwrapper.expireUserSession(sessionID, userID)

## Distribuition

1.  Update package `version` at `package.json`.
2.  Open terminal and run `npm publish`.
3.  Visit https://www.npmjs.com/package/@circlesystems/circleauth-wrapper to check latest version.
