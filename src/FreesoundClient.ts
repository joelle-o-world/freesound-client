import axios, { AxiosInstance } from "axios";
import qs from "qs";

export class FreesoundClient {
  private axios: AxiosInstance;
  private clientId: string;
  private apiKey: string;
  private accessToken?: string;

  /**
   * Asynchronously create a new authenticated api client.
   */
  constructor(options: {
    accessToken?: string;
    apiKey: string;
    clientId: string;
  }) {
    this.clientId = options.clientId;
    this.apiKey = options.apiKey;
    this.accessToken = options.accessToken;

    if (this.accessToken) {
      this.axios = axios.create({
        baseURL: "https://freesound.org/apiv2",
        timeout: 1000,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
    } else if (this.apiKey) {
      this.axios = axios.create({
        baseURL: "https://freesound.org/apiv2",
        timeout: 1000,
        headers: {
          Authorization: `Token ${this.apiKey}`,
        },
      });
    } else throw new Error("apiKey is required");
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.axios.get("me");
      return true;
    } catch (err) {
      return false;
    }
  }

  loginPageUrl() {
    if (this.clientId)
      return this.axios.getUri({
        url: "oauth2/authorize/",
        params: { client_id: this.clientId, response_type: "code" },
      });
    else throw "Cannot get login page url without client id";
  }

  public async createAccessToken(authorizationCode: string) {
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
      return response.data;
    } catch (err: any) {
      console.error("Unable to oauth2 access token:", err.response.data);
      console.error("Request:", err.request);
      throw err;
    }
  }
}
