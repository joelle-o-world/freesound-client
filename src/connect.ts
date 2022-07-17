import { RCFile } from "./rw-rc";
import { askQuestion } from "./askQuestion";
import { FreesoundClient } from "./FreesoundClient";
import open from "open";

const rcfile = new RCFile<{
  /**
   * The OAuth bearer token.
   */
  accessToken: string;

  refreshToken: string;

  apiKey: string;
  clientId: string;
}>("freesound");

export async function login(): Promise<FreesoundClient> {
  const freesound =
    (await loginWithAccessToken()) ||
    (await loginWithRefreshToken()) ||
    (await loginWithBrowser());
  if (freesound) return freesound;
  else throw "Unable to connect";
}

async function loginWithAccessToken(): Promise<FreesoundClient | null> {
  const clientId = await rcfile.askAndStore("clientId");
  const apiKey = await rcfile.askAndStore("apiKey");

  const { accessToken } = await rcfile.read();
  if (accessToken) {
    const freesound = new FreesoundClient({ accessToken, clientId, apiKey });
    if (await freesound.testConnection()) return freesound;
    else return null;
  }
  return null;
}

async function loginWithRefreshToken() {
  // TODO: Implement!
  return null;
}

async function loginWithBrowser(): Promise<FreesoundClient | null> {
  const clientId = await rcfile.askAndStore("clientId");
  const apiKey = await rcfile.askAndStore("apiKey");

  const freesound = new FreesoundClient({
    clientId,
    apiKey,
  });

  const url = freesound.loginPageUrl();
  open(url);
  const authorizationCode = await askQuestion(
    "Please enter the authorization code from the browser: "
  );

  const { access_token, refresh_token } = await freesound.createAccessToken(
    authorizationCode
  );

  await rcfile.modify({
    accessToken: access_token,
    refreshToken: refresh_token,
  });

  return await loginWithAccessToken();
}
