# Lugha Flutter migration

## Product decision
The final Lugha learning client must be Flutter. The current HTML/PWA is a behavior and content reference, not the final UI.

## Target platforms
- Android
- iOS
- Web
- Windows desktop where browser/audio/plugin support allows

## Preserve
- Cloudflare Worker AI endpoint and provider-secret boundary.
- Firebase Authentication and per-user Firestore progress rules.
- Existing lessons, flashcards, dictation, speech practice and offline lesson content.
- Provider fallback, retry and rate-limit behavior.

## Migration phases
1. Inventory the current app routes, learning flows, lesson data and localization.
2. Define typed Flutter repositories for auth, progress, content and AI requests.
3. Build Flutter onboarding, lesson library, flashcards, dictation and speaking practice.
4. Port all 15 supported languages and verify fonts/input/audio behavior for each.
5. Cache lesson content and progress safely offline; sync when online.
6. Use the existing Worker for AI calls; never embed provider keys in the Flutter binary.
7. Add Flutter tests for lesson completion, progress isolation, AI quota exhaustion and offline recovery.

## Acceptance criteria
The same Flutter feature/domain code serves supported targets; AI and sync failures never block cached lessons; Firebase rules remain enforced. The existing PWA bundle is an interim deployment reference, not a Flutter release.