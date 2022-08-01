import createPlayer from "play-sound";

let player: ReturnType<typeof createPlayer>;

/**
 * Play an audio file in a node cli context.
 */
export async function play(file: string) {
  return new Promise<void>((fulfil, reject) => {
    if (!player) player = createPlayer();
    player.play(file, (err) => {
      if (err) reject(err);
      else fulfil();
    });
  });
}
