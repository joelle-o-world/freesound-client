import { login } from "./connect";

(async function main() {
  const freesound = await login();
  // @ts-ignore
  console.log((await freesound.axios.get("me")).data);
})();
