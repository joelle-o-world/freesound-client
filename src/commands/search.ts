import { login } from "../connect";

export async function search(argv: string[]) {
  // TODO: Output as a string
  let limit = 20;
  for await (const result of (await login()).search(argv[0])) {
    console.log(`${result.id} - ${result.name}`);
    if (--limit == 0) break;
  }
}
