---
name: Playlist Import
about: For creating a task list for importing a new playlist
title: Create Playlist XXXX
labels: playlist-import
assignees: crookedneighbor
---

- [ ] Initial playlist import
  - [ ] Refresh any expired Spotify env variables
  - [ ] Set playlist id and slug env variables
  - [ ] run script `node ./scripts/populate-playlist.js`
- [ ] metadata
  - [ ] double check all buy links are for the correct song
  - [ ] add any missing buy links
  - [ ] add artist website links
  - [ ] verify explicit tag for each
  - [ ] verify no id requires the populating script to be adjusted
  - [ ] add missing lyrics using lyrics-parser tool
  - [ ] add blurbs for each song
- [ ] Playlist metadata
  - [ ] add metadata for playlist
  - [ ] draw cover art for playlist
- [ ] og-shares
  - [ ] mark which lyrics to share as part of og shares
  - [ ] generate og-shares
- [ ] update /playlists to include link to playlist
