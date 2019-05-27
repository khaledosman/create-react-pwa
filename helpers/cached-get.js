const axios = require('axios')
const ms = require('ms')

function cachedGet (url, config, { cacheKey = url, isOnlineFirst = false, dontShowErrorMessage = false, showErrorMessage } = { cacheKey: url, isOnlineFirst: false, dontShowErrorMessage: false, showErrorMessage: () => {} }) {
  // Get from cache and resolve if the access token is valid for best online performance as well as offline / lie-fi support, but make the call to the network anyway to update the cache for next visit. if there's nothing in the cache, fallback to the network
  if (isOnlineFirst) {
    // Online first approach
    // Get from network then fallback to cache
    return getFromNetworkAndSaveToCache(url, config, cacheKey)
      .catch(error => {
        if (!error.response) {
          // Network error
          if (!dontShowErrorMessage && error.message !== 'No cached response found' && error.message !== 'no token found' && error.message !== 'token expired') {
            showErrorMessage({ message: `Couldn't complete request, please try again later` })
          }
          return getFromCache(url, config, cacheKey)
        } else {
          throw error
        }
      })
  } else {
    // Offline first approach
    // Get from cache first, make the request anyway to update the cache then fallback to network
    return Promise.race([
      Promise.all([getFromCache(url, config, cacheKey), isTokenValid()]).then(([p1Res, p2Res]) => p1Res),
      getFromNetworkAndSaveToCache(url, config, cacheKey)
    ])
      .catch(error => {
        console.warn('error', error)
        if (!error.response) { // Network error or Results are not in cache
          if (error.message !== 'No cached response found' && error.message !== 'no token found' && error.message !== 'token expired') {
            // Network error

            if (!dontShowErrorMessage) {
              showErrorMessage({ message: `Couldn't complete request, please try again later` })
            }
          }
          return getFromNetworkAndSaveToCache(url, config)
        } else {
        // let the consumer catch and handle the error
          throw error
        }
      })
  }
}

function isTokenValid () {
  return new Promise((resolve, reject) => {
    const authInfo = window.localStorage.getItem('authInfo')
    const token = window.localStorage.getItem('token')
    if (token && authInfo) {
      const { access_token: accessToken, createdAt, expiresIn } = JSON.parse(authInfo)
      if (Date.now() >= new Date(createdAt).getTime() + ms(expiresIn)) {
        reject(new Error('token expired'))
      } else {
        resolve(accessToken)
      }
    } else {
      reject(new Error('no token found'))
    }
  })
}

function getFromCache (url, config, cacheKey = url) {
  return new Promise((resolve, reject) => {
    const cachedResponse = window.localStorage.getItem(cacheKey)
    if (cachedResponse) {
      const response = JSON.parse(cachedResponse)
      resolve(response)
    } else {
      reject(new Error('No cached response found'))
    }
  })
}

function getFromNetworkAndSaveToCache (url, config, cacheKey = url) {
  return axios.get(url, { ...config, timeout: 40000 })
    // .then(res => res.data)
    .then(response => {
      window.localStorage.setItem(cacheKey, JSON.stringify(response))
      return response
    })
}

module.exports.cachedGet = cachedGet
