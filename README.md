# An unofficial CLI for Freesound

## Usage

```
Usage: freesound [options] [command]

Options:
  -h, --help                     display help for command

Commands:
  whoami                         Get the username of the currently logged in
                                 freesound user
  sound                          Commands about sounds
  my
  search [options] <query>       Search the freesound sample database
  search-and-play <query>        Search the freesound database and play each
                                 result in sequence
  info <sound-id>                Fetch basic metadata about a sound
  uri <sound-id>                 Get the download link for the given sound
  download [options] <sound-id>  Download a sample
  upload [options] <files...>    Upload sounds from your computer
  pack
  play <sound-id>                Download and play a sound
  cache                          Manage freesound samples cached on your local
                                 machine
  pending                        Fetch a list of your pending uploads
  help [command]                 display help for command
```
