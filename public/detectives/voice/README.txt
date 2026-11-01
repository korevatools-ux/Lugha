Real voice recordings for the Lugha detectives (optional)

Synthetic voices already follow the visitor's country. To use REAL people instead
(for example a Zimbabwean man and woman), record each line as an .mp3 and list it here.

1. Put the files in a folder named after the 2-letter country code, e.g.  voice/ZW/m-1.mp3
2. Edit manifest.json, for example:
   { "ZW": { "lang": "en",
             "m": ["ZW/m-1.mp3", "ZW/m-2.mp3", "ZW/m-3.mp3"],
             "f": ["ZW/f-1.mp3", "ZW/f-2.mp3", "ZW/f-3.mp3"] } }
3. Upload the website folder to Cloudflare again.

Lines to record (in order):
 He  1  Hello! I'm your language detective. Every day we solve a new word together.
 He  2  Ready for a lesson? It only takes ten minutes.
 He  3  Hallo! Habari! Bonjour! Which language shall we crack today?
 She 1  Hi! I'm here to help you find the right words.
 She 2  Shall we start? Your first lesson is free, like all of them!
 She 3  Every word is a clue. Let's find the next one together.
