import axios, { AxiosInstance } from "axios";
import { createWriteStream } from "fs";
import { resolve } from "path";
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

  async me() {
    return (await this.axios.get("me")).data;
  }

  async mySounds() {
    const uri = (await this.me()).sounds;
    console.log(uri);
    return (await this.axios.get(uri)).data;
  }

  private async *page(...args: Parameters<typeof this.axios.get>) {
    let response = await this.axios.get(...args);
    for (let result of response.data.results) yield result;

    while (response.data.next) {
      response = await this.axios.get(response.data.next);
      for (let result of response.data.results) yield result;
    }
  }

  async *search(searchText: string) {
    return this.page("search/text", {
      params: { query: searchText },
    });
  }

  async soundInfo(soundId: string) {
    let response = await this.axios.get(`sounds/${soundId}`);
    return response.data;
  }

  async downloadLink(soundId: string) {
    const soundInfo = await this.soundInfo(soundId);
    return soundInfo.download;
  }

  async download(soundId: string) {
    const soundInfo = await this.soundInfo(soundId);
    const uri = soundInfo.download;
    const extension = soundInfo.type;
    const filename = `${soundId}-${soundInfo.username}-${soundInfo.name}.${extension}`;
    const response = await this.axios.get(uri, { responseType: "stream" });

    return { suggestedFilename: filename, stream: response.data };
  }
}
