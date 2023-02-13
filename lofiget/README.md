# Lofi Get

A python app that grabs the current frame of "Chill Lo-Fi Beats to study to", analyzes, and upload it to storage.

## Environment Variables

The app expects the following environment variables

- *lofigirlframes*: gcs bucket for snapshots
- *ytUrl*: address for youtube stream
- *framesCollection*: Firestore collection for frames data.
- *skyDurationsCollection*: Firestore collection for sky duration data.
- *currentSkyCollection*: Firestore collection for data relating to the current sky status.

## Credits

- [https://github.com/qaixerabbas/youtube-frame-capture](https://github.com/qaixerabbas/youtube-frame-capture)
