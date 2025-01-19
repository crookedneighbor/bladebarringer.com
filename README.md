# bladebarringer.com

## Installing

```bash
npm install
```

## Developing

Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Spotify Playlist Scripts

The script to setup a new playlist page do a bunch of things. 

1. Creates a `.svx` file for the playlist and each of the tracks.
1. Imports the lyrics
1. Populates buy links from Bandcamp

For this to work, we need to set a few environmental variables. First thing, [login to Spotify in a browser](https://spotify.com/login).

Once you're logged in, follow these steps to get the `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` enviromental variables. If you've already done this once, you shouldn't need to fetch them again.

* Navigate to the [Spotify Dashboard](https://developer.spotify.com/dashboard)
* Go to the settings for your app (or create a new one)
* Copy the client ID and client secrent and set them as the `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` env variables.

If you are importing the playlist for the first time, it will also attempt to import the lyrics for the song, which need additional credentials. To find them, follow these steps:

* Go to [the Spotify lyrics page](https://open.spotify.com/lyrics)
* Open the dev tools (may need to use the menu bar, Spotify has right clicking disabled)
* Inspect the network request for [/color-lyrics](https://spclient.wg.spotify.com/color-lyrics) and grab the `Authorization` header and the `Client-Token` header
* Save the `Authorization` header (without the Bearer prefix) in the `SPOTIFY_LYRICS_ACCESS_TOKEN` environmental variable
* Save the `Client-Token` header in the `SPOTIFY_LYRICS_CLIENT_TOKEN` environmental variable

These values expire, so you may need to repeat the process if too much time passes between fetching them and making the requests.

Finally, set the `SPOTIFY_PLAYLIST_ID` and `PLAYLIST_SLUG` evironmental variables. To find the `SPOTIFY_PLAYLIST_ID`, simply copy the link to the playlist on Spotify, and copy the id portion from the link. For the `PLAYLIST_SLUG`, set it to whatever you want the slug of the url to be. For instance, for a 2024 playlist, the slug could be `2024`.

Finally, from the root of the repo, run:

```bash
node ./scripts/populate-playlist.js
```
