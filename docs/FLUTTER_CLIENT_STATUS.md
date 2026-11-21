# Lugha Flutter client status

## Build
```sh
flutter pub get
flutter analyze --fatal-infos
flutter test
flutter run -d chrome
```

CI targets Android, Web and Windows. The native iOS scaffold is generated, but a native iOS build requires a macOS runner.

## Migration state
The Flutter workspace shell is in place for Learn, Flashcards, Speaking, Dictionary, Progress and Profile. Existing Worker AI endpoint, Firebase Authentication and per-user Firestore security remain the service baseline. The next work is porting the lesson catalogue and 15-language content, progress sync, offline caching, speech practice and AI quota/fallback behavior.