import axios, { AxiosInstance } from "axios";

export class FreesoundClient {
  axios: AxiosInstance;

  /**
   * Asynchronously create a new authenticated api client.
   */
  public static async connect(
    apiKey: string = this.getKeyFromEnvironmentVariable()
  ): Promise<FreesoundClient> {
    const instance = new FreesoundClient(apiKey);
    return instance;
  }

  private static getKeyFromEnvironmentVariable(): string {
    const token = process.env["FREESOUND_API_KEY"];
    if (token) return token;
    else throw new Error("expected environment variable $FREESOUND_API_KEY");
  }

  private constructor(apiKey: string) {
    this.axios = axios.create({
      baseURL: "https://freesound.org/apiv2",
      timeout: 1000,
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    });
  }
}

FreesoundClient.connect().then(async (freesound) => {
  try {
    const response = await freesound.axios.get("me");
    if (response.status >= 200 && response.status < 300)
      console.log(response.data);
    else console.log(response.status, response.statusText);
  } catch (err) {
    // @ts-ignore
    console.error(err?.response?.data);
    console.error(err);
  }
});
