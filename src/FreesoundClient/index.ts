import axios, {AxiosInstance} from "axios";
import qs from "qs";
import FormData from "form-data";
import {Readable} from "stream";

const timeout = 30000;

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
        timeout,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
    } else if (this.apiKey) {
      this.axios = axios.create({
        baseURL: "https://freesound.org/apiv2",
        timeout,
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
        params: {client_id: this.clientId, response_type: "code"},
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

  public async refreshAccessToken(refreshToken: string) {
    try {
      const response = await this.axios.post(
        "oauth2/access_token",
        qs.stringify({
          client_id: this.clientId,
          client_secret: this.apiKey,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        })
      );
      return {
        accessToken: response.data.accessToken,
        newRefreshToken: response.data.refresh_token,
      };
    } catch (err) {
      console.error("Error refreshing access token:", err);
      return null;
    }
  }

  async me() {
    return (await this.axios.get("me")).data;
  }

  async *mySounds() {
    const uri = (await this.me()).sounds;
    for await (const result of this.page(uri)) yield result;
  }

  async *myPacks() {
    const uri = (await this.me()).packs;
    for await (const result of this.page(uri)) yield result;
  }

  async pendingUploads() {
    return (await this.axios.get(`sounds/pending_uploads`)).data;
  }

  private async *page(...args: Parameters<typeof this.axios.get>) {
    try {
      let response = await this.axios.get(...args);
      for (let result of response.data.results) yield result;

      while (response.data.next) {
        response = await this.axios.get(response.data.next);
        for (let result of response.data.results) yield result;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async *search(searchText: string) {
    for await (let result of this.page("search/text", {
      params: {query: searchText},
    }))
      yield result;
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
    let packId, packName;
    if (soundInfo.pack) {
      const packInfo = (await this.axios.get(soundInfo.pack)).data;
      packId = packInfo.id;
      packName = packInfo.name;
    }
    const uri = soundInfo.download;
    const response = await this.axios.get(uri, {responseType: "stream"});
    return {
      type: soundInfo.type,
      stream: response.data,
      soundId,
      name: soundInfo.name,
      packId,
      packName,
    };
  }

  async upload(
    stream: Readable,
    options: {
      name: string;
      license?:
      | "Attribution"
      | "Attribution Noncommercial"
      | "Creative Commons 0";
      description: string;
      tags: string[];
      pack?: string;
    }
  ) {
    const form = new FormData();
    form.append("name", options.name);
    form.append("license", options.license || "Attribution");
    form.append("audiofile", stream);
    form.append("description", options.description);
    form.append("tags", options.tags.join(" "));
    if (options.pack) form.append("pack", options.pack);

    try {
      await this.axios.post("sounds/upload/", form);
    } catch (err: any) {
      console.log(err.response.data);
      throw err;
    }
  }

  public async packInfo(packId: string) {
    return await this.axios.get(`packs/${packId}`);
  }

  public listSoundsInPack(packId: string) {
    return this.page(`packs/${packId}/sounds`);
  }
}
