# md-oidc-js Library

Beispiel JavaScript Library zur Nutzung der Mobilcom-Debitel OpenID Connect (OIDC) Implementierung.

*Die Library ist derzeit vor allem für Demonstrationszwecken geeignet und nicht
für den produktiven Einsatz gedacht.*  

## Getting started

1. Die Library erstellen
  * Run `yarn install`
  * Run `yarn build`
2. Entwicklungs-Modus
  * Wenn alle Abhängigkeiten installiert sind kann der Entwicklungs-Modus mit `yarn dev` gestartet werden.
  Es wird eine Debug-Version der Library erstellt und Code-Änderungen überwacht,
  die Library wird bei Änderungen neu erstellt.  
3. Tests (bisher nicht gefüllt)
  * Run `yarn test`

## Scripts

* `yarn build` or `npm run build` - produces production version of your library under the `lib` folder
* `yarn dev` or `npm run dev` - produces development version of your library and runs a watcher
* `yarn test` or `npm run test` - well ... it runs the tests :)
* `yarn test:watch` or `npm run test:watch` - same as above but in a watch mode
