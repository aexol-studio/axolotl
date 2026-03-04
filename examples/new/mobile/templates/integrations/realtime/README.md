# Realtime Template (Opt-in, Pusher JS)

This template is not active by default.

## Why Pusher JS here

The starter uses a JS-first blueprint (`pusher-js`) to keep managed Expo compatibility and avoid native module setup in baseline starter scope.

Ably is a valid alternative; this starter blueprint chooses Pusher JS for lightweight setup and broad managed Expo fit.

## Install

```bash
npm install pusher-js
```

## Suggested runtime paths

- `src/config/realtime.ts`
- `src/providers/RealtimeProvider.tsx`
- `src/lib/realtime/pusherClient.ts`

## Blueprint source files in this template

- `templates/integrations/realtime/src/config.ts`
- `templates/integrations/realtime/src/client.ts`
- `templates/integrations/realtime/src/provider.tsx`
- tests in `templates/integrations/realtime/src/*.test.*`

## Env

- `EXPO_PUBLIC_PUSHER_KEY`
- `EXPO_PUBLIC_PUSHER_CLUSTER`

## Wiring

Add `RealtimeProvider` inside `AppProviders` only after copying files into runtime `src/`.

Guard startup with `isRealtimeConfigured()` and keep no-op behavior when env is missing.
