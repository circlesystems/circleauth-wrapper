import { CircleAuthApi } from '@circlesystems/circleauth'
import { createHmac } from 'crypto'
 
let _apiInstance = null
let _isInitialized = false
let _appKey = false
let _readKey = false
let _writeKey = false

const wrapper = {}

function buildUrlSearchParamsString(paramsData) {
  if (!paramsData || typeof paramsData !== 'object') {
    throw Error('paramsData must be an object')
  }

  const urlParams = new URLSearchParams()
  for (const propName of Object.getOwnPropertyNames(paramsData)) {
    urlParams.append(propName, paramsData[propName])
  }
  return '?' + urlParams.toString()
}

function generateQueryStringSignature(paramsData, secret) {
  const urlParams = buildUrlSearchParamsString(paramsData)
  return computeSignature(urlParams, secret)
}

function buildPostParams(paramsData) {
  if (!paramsData || typeof paramsData !== 'object') {
    throw Error('paramsData must be an object')
  }
  const params = {}
  for (const propName of Object.getOwnPropertyNames(paramsData)) {
    params[propName] = paramsData[propName]
  }
  return params
}

function generatePostBody(paramsData) {
  let requestData = buildPostParams(paramsData);
  const signature = computeSignature(JSON.stringify(requestData), _writeKey);
  return JSON.stringify({
    data: requestData,
    signature: signature,
  });
}

function computeSignature(message, secret) {
  const computed = createHmac('sha256', secret).update(message).digest('Base64')
  return computed
}

function checkSignature(message, secret, receivedSignature) {
  const computed = computeSignature(message, secret)
  return receivedSignature === computed
}

function checkQueryStringSignature(paramsData, signature) {
  if (!paramsData) {
    throw Error('Unexpected query string params.')
  }

  const urlParams = buildUrlSearchParamsString(paramsData)
  if (!checkSignature(urlParams, _readKey, signature)) {
    throw Error('QueryString signature does not match.')
  }
  return true
}

function checkJsonSignature(objData) {
  if (!objData || !objData.signature || !objData.data) {
    throw Error('Unexpected return JSON.')
  }

  const stringData = JSON.stringify(objData.data)
  if (!checkSignature(stringData, _readKey, objData.signature)) {
    throw Error('Data signature does not match.')
  }
}

function validateWrapperInitialized() {
  if (!_isInitialized) {
    throw Error('You must first call configure(config) before calling API functions.')
  }
}

wrapper.configure = function (config) {
  if (!config.appKey) { throw new TypeError('appKey option is required') }
  if (!config.readKey) { throw new TypeError('readKey option is required') }
  if (!config.writeKey) { throw new TypeError('writeKey option is required') }

  _appKey = config.appKey
  _readKey = config.readKey
  _writeKey = config.writeKey
  _apiInstance = new CircleAuthApi()
  _isInitialized = true
}

wrapper.validateLoginCallbackSignature = async function (userID, sessionID, authID, type, signature) {
  validateWrapperInitialized()
  return checkQueryStringSignature({userID, sessionID, authID, type}, signature)
}

wrapper.validate2FACallbackSignature = async function (userID, sessionID, authID, type, customID, signature) {
  validateWrapperInitialized()
  return checkQueryStringSignature({userID, sessionID, authID, type, customID}, signature)
}

wrapper.create2FA = async function (customID, returnUrl, webhookUrl, phone, email, question, userID, mobileReturnUrl) {
  try {
    validateWrapperInitialized()

    const body = generatePostBody({
      customID,
      returnUrl,
      webhookUrl,
      phone,
      email,
      question,
      userID,
      mobileReturnUrl,
    })
    const returnValue = await _apiInstance.create2FA(body, _appKey)
    checkJsonSignature(returnValue)
    return returnValue
  } catch (error) {
    console.log(error)
    throw error
  }
}

wrapper.getSession = async function (sessionID) {
  try {
    validateWrapperInitialized()
    const s = sessionID;
    const generatedSignature = generateQueryStringSignature({ s }, _writeKey)
    const returnValue = await _apiInstance.getSession(_appKey, s, generatedSignature)
    checkJsonSignature(returnValue)
    return returnValue
  } catch (error) {
    console.log(error)
    throw error
  }
}

// no signature validation - prefer to use the wrapper.getSession() function
wrapper.getRawSession = async function (sessionID) {
  try {
    validateWrapperInitialized()
    const s = sessionID;
    const generatedSignature = generateQueryStringSignature({ s }, _writeKey)
    const returnValue = await _apiInstance.getSession(_appKey, s, generatedSignature)
    return returnValue
  } catch (error) {
    console.log(error)
    throw error
  }
}

wrapper.getUserSession = async function (sessionID, userID) {
  try {
    validateWrapperInitialized()

    const generatedSignature = generateQueryStringSignature({ sessionID, userID }, _writeKey)
    const returnValue = await _apiInstance.getUserSession(_appKey, sessionID, userID, generatedSignature)
    checkJsonSignature(returnValue)
    return returnValue
  } catch (error) {
    console.log(error)
    throw error
  }
}

// no signature validation - prefer to use the wrapper.expireUserSession() function
wrapper.expireRawUserSession = async function (sessionID, userID) {
  try {
    validateWrapperInitialized()
    const body = generatePostBody({sessionID, userID})
    const returnValue = await _apiInstance.expireUserSession(body, _appKey)
    return returnValue
  } catch (error) {
    console.log(error)
    throw error
  }
}

wrapper.expireUserSession = async function (sessionID, userID) {
  try {
    validateWrapperInitialized()
    const body = generatePostBody({sessionID, userID})
    const returnValue = await _apiInstance.expireUserSession(body, _appKey)
    checkJsonSignature(returnValue)
    return returnValue
  } catch (error) {
    console.log(error)
    throw error
  }
}

/**
 * Expose Circle Auth `wrapper`.
 */
export default wrapper