# Sigil

Sigil is an iOS app for leaving short messages at real-world locations. You write something, pin it to wherever you're standing (or blur it out to a wider area if you'd rather not share your exact spot), and it just sits there until a stranger walks close enough to find it.

The idea borrows from the soapstone messages in FromSoftware's action RPGs — leaving something behind for the next person, with no way to know who'll read it or when. I wanted to see what that mechanic feels like mapped onto actual physical space instead of a game world.

<p align="center">
  <img src="screenshots/inscription-builder.png" width="260" alt="Composing an inscription with a photo and caption" />
  <img src="screenshots/legacy-profile.png" width="260" alt="A profile screen showing posted inscriptions" />
  <img src="screenshots/word-bank-search.png" width="260" alt="Searching the caption word bank" />
</p>

## What's actually in it

You can browse a live map or a nearby-feed list of inscriptions other people have left, with nearby pins clustering together and splitting apart as you zoom in. Tap one to see the photo full-screen and "appraise" it if it resonates with you. If you want to be notified when you walk near a new one, there's an opt-in proximity alert — the detection happens entirely on-device through iOS geofencing, so no location data ever leaves your phone for that feature specifically.

<p align="center">
  <img src="screenshots/map-clusters.png" width="280" alt="The world map with inscriptions clustering by region" />
</p>

Accounts are anonymous by default. You can use the whole app without signing up for anything, and claim it later with an email or Sign In with Apple if you want your inscriptions to follow you across devices.

<p align="center">
  <img src="screenshots/account-creation.png" width="260" alt="The account claim screen" />
  <img src="screenshots/proximity-alerts.png" width="260" alt="The proximity alerts settings modal" />
  <img src="screenshots/fullscreen-photo.png" width="260" alt="Viewing an inscription's photo full-screen" />
</p>

## A few things worth mentioning if you're reading the code

Area-mode inscriptions never store a precise coordinate in the first place — the imprecision happens at write time, not as a display-layer blur over real data. That felt like the only honest way to do it once I thought about what "private" actually needs to mean here.

The nearby-feed and map queries run through a PostGIS RPC in Supabase rather than pulling everything down and filtering client-side. Row-level security sits on every table, and rate limiting is enforced by a database trigger, not app code, since a client can always be bypassed.

The proximity alerts turned out to be the hardest part by a wide margin. iOS only lets you monitor about 20 geofence regions at once, but inscriptions are scattered worldwide, so I ended up building a rolling "leash" region around wherever the geofence list was last refreshed — walk far enough and it re-registers the nearest set. No continuous background location tracking involved.

## Built with

React Native + Expo (TypeScript), Supabase for the backend (Postgres, PostGIS, Auth, Storage), RevenueCat for the subscription tier.

## Where things stand

Still in development — I'm working through the App Store submission process now.

## Links

- [Privacy Policy](https://tahadeol.github.io/Sigil/privacy.html)
- [Terms of Service](https://tahadeol.github.io/Sigil/terms.html)
- [Support](https://tahadeol.github.io/Sigil/)
