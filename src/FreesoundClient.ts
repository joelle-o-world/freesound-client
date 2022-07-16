import axios, { AxiosInstance } from "axios";
import open from "open";
import { askQuestion } from "./askQuestion";
import { getEnvironmentVariable } from "./getEnvironmentVariable";
import qs from "qs";

export class FreesoundClient {
  private axios: AxiosInstance;
  private clientId: string;
  private apiKey: string;

  /**
   * Asynchronously create a new authenticated api client.
   */
  public static async connect(
    clientId = getEnvironmentVariable("FREESOUND_API_CLIENT_ID"),
    apiKey: string = getEnvironmentVariable("FREESOUND_API_KEY")
  ): Promise<FreesoundClient> {
    const instance = new FreesoundClient(clientId, apiKey);
    await instance.doOauth();
    return instance;
  }

  private constructor(clientId: string, apiKey: string) {
    this.clientId = clientId;
    this.apiKey = apiKey;
    this.axios = axios.create({
      baseURL: "https://freesound.org/apiv2",
      timeout: 1000,
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    });
  }

  async doOauth() {
    const authorizationCode = await this.loginWithBrowser();
    const access_token = await this.createAccessToken(authorizationCode);
  }

  async loginWithBrowser(): Promise<string> {
    const url = this.axios.getUri({
      url: "oauth2/authorize/",
      params: { client_id: this.clientId, response_type: "code" },
    });
    console.log("Opening browser...");
    open(url);
    const authcode = await askQuestion(
      "Please enter the authorization code from the browser: "
    );

    return authcode;
  }

  private async createAccessToken(authorizationCode: string) {
    try {
      const response = await this.axios.post(
        "oauth2/access_token",
        qs.stringify({
          client_id: this.clientId,
          client_secret: this.apiKey,
          grant_type: "authorization_code",
          code: authorizationCode,
        })
      );
      console.log(response.data);
    } catch (err: any) {
      console.error("Unable to oauth2 access token:", err.response.data);
      console.error("Request:", err.request);
      throw err;
    }
  }
}

FreesoundClient.connect().then(async (freesound) => {
  console.log("done");
});
