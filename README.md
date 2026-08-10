# Sigil

A location-based social app where users leave short messages — inscriptions — pinned to real-world places, for strangers to discover as they pass by.

## What it does

- Compose a short message from a curated word bank, optionally attach a photo, and pin it to your exact location or a wider area for extra privacy
- Browse a live map or a nearby feed to find inscriptions other people have left around you
- Appraise the ones that resonate
- Get a local notification the moment you pass near an inscription — detection happens entirely on-device, and no location data is ever sent anywhere for this feature
- Start anonymously; claim an account with email or Sign In with Apple whenever you want to keep your inscriptions across devices

Sigil's central mechanic — an asynchronous message system tied to physical space — draws on the tradition of FromSoftware's action RPGs, reimagined for the real world.

## Why it's interesting, engineering-wise

- **Privacy by construction, not by display** — for area-based inscriptions, precise coordinates are never stored in the first place; the imprecision is a property of the data, not a rendering trick layered on top.
- **Geospatial computation lives server-side** — nearest-neighbor queries run through a PostGIS RPC, not client-side filtering over a full table.
- **On-device geofencing for proximity alerts** — works around iOS's ~20-region region-monitoring limit with a rolling "leash" region strategy, instead of continuous background location tracking.
- **Defense-in-depth access control** — Postgres Row-Level Security on every table, plus a database trigger enforcing rate limits, so the rules hold even against a client talking to the API directly.
- **Anonymous-first identity** — the app is fully usable without ever creating an account, then upgrades to email or Sign In with Apple later without losing any existing content.

## Stack

React Native + Expo (TypeScript) · Supabase (PostgreSQL + PostGIS, Auth, Storage) · RevenueCat

## Status

In active development, preparing for App Store submission.

## Privacy & Terms

- [Privacy Policy](https://tahadeol.github.io/Sigil/privacy.html)
- [Terms of Service](https://tahadeol.github.io/Sigil/terms.html)
- [Support](https://tahadeol.github.io/Sigil/)

## Screenshots

_Coming soon._
