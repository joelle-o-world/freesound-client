# An unofficial CLI for Freesound

## Usage

```
Usage: freesound [options] [command]

Options:
  -h, --help               display help for command

Commands:
  whoami                   Get the username of the currently logged in
                           freesound user
  my
  search <query>           Search the freesound sample database
  search-and-play <query>  Search the freesound database and play each result
                           in sequence
  info <sound-id>          Fetch basic metadata about a sound
  uri <sound-id>           Get the download link for the given sound
  download <sound-id>      Download a sample
  upload <files...>        Upload sounds from your computer
  pack
  play <sound-id>          Download and play a sound
  help [command]           display help for command
```
