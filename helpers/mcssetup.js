

function setupMCS()
{
  mcs.mobileBackendManager.platform = new mcs.BrowserPlatform();
  mcs.mobileBackendManager.setConfig(mcs_config);
  this.backend = mcs.mobileBackendManager.getMobileBackend("Haven_Backend");
  if (this.backend != null)
  {
    this.backend.setAuthenticationType("basicAuth");
  }
}

function login(user, pass) {
  function failure(response, data) {
      console.warn(response);
  }
 
  function success(response, data) {
      console.warn("successful login");
  }
 
  backend.Authorization.authenticateAnonymous(success, failure);
}

setupMCS();
login();
