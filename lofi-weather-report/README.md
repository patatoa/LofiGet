# Lofi Weather Report

This is the web ui for [https://www.lofiweatherreport.com](https://www.lofiweatherreport.com). This is a Next.JS app. It expects to be server side rendered. (Due to the relative frequency this page would need to re regenerated, I decided server side rendered would be the most efficient service method.)

## Environment Variables

The app expects the following environment variables

- *NEXT_PUBLIC_FRAMES_COLLECTION*: Firestore collection for frames data.
- *NEXT_PUBLIC_SKY_DURATIONS_COLLECTION*: Firestore collection for sky duration data.
