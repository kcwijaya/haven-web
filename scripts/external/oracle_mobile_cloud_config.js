var mcs = require(__dirname + '/mcs.js');

var mcs_config = {
  "logLevel": mcs.LOG_LEVEL.INFO,
  "logHTTP": true,
  "mobileBackends": {
    "Haven_Backend": {
      "default": true,
      "baseUrl": "https://teamhaven-a432811.mobileenv.us2.oraclecloud.com:443",
      "applicationKey": "34a5be8e-066c-42a4-b551-592c465f21ff",
      "authorization": {
        "basicAuth": {
          "backendId": "b56f2256-33fa-4f9c-af80-129f9e546ad8",
          "anonymousToken": "QTQzMjgxMV9URUFNSEFWRU5fTU9CSUxFX0FOT05ZTU9VU19BUFBJRDpVcGZ1a2o5LnQwc3pkaQ=="
        }
      }
    }
  },
  // "sync": {
  //   "periodicRefreshPolicy": "PERIODIC_REFRESH_POLICY_REFRESH_NONE",
  //   "policies": [
  //     {
  //       "path": '/mobile/custom/firstApi/tasks',
  //       "fetchPolicy": 'FETCH_FROM_SERVICE_ON_CACHE_MISS'
  //     },
  //     {
  //       "path": '/mobile/custom/secondApi/tasks',
  //     }
  //   ]
  // },
  "syncExpress": {
    "handler": "OracleRestHandler",
    "policies": [
      {
        "path": '/mobile/custom/firstApi/tasks/:id(\\d+)?',
      },
      {
        "path": '/mobile/custom/secondApi/tasks/:id(\\d+)?',
      }
    ]
  }

};

module.exports = mcs_config;
