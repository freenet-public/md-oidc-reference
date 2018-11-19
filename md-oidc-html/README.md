# md-oidc-html

Beispiel für eine Single Page Application mit der Mobilcom-Debitel OpenID Connect
Implementierung (OIDC).

*Die Web-Applikation ist vor allem für Demonstrationszwecken geeignet und nicht
für den produktiven Einsatz gedacht.*

Eine Beispiel-Installation ist unter [https://md.singer-tc.de ](https://md.singer-tc.de) zu finden

## Features

* Oauth-Callback Behandlung in der index.html
* Softlogin (aka Remember-Me) Check im Hintergrund mittels iFrame
* Anzeige der zentralen Login-Seite im iFrame
* Demo für die Sperre der Navigation während des Login-Prozesses in der Applikation,
  dazu ist eine Verzögerung von 5 Sekunden im Prozess eingebaut.
* Überwachung des Login-Status mittels OpenID Session Management.

Eine Übersicht des Ablaufs in der index.html bzw index.js ist in
``doc/Application_Init.png`` zu finden.

## Voraussetzungen

* [Node](https://nodejs.org) > 7.6
* [Yarn](https://yarnpkg.com)

## Benutzung

Installieren der Abhängigkeiten:

```sh
 yarn install 
```

Die Benutzung setzt https sowie eine korrekte Konfiguration im OIDC mit gültiger 
Rücksprung URL voraus. Es wird als lokaler Hostname "md.freenet.local:7890"
erwartet (siehe auch src/config/config.json).

Es muss daher "md.freenet.local" in die lokale hosts Datei eingetragen werden, z.B. mit:

```echo -e "127.0.0.1\tmd.freenet.local" >> /etc/hosts``` 

Für die Benutzung ist zudem eine Client ID für einen im OIDC konfigurierten 
Client notwendig, dessen Einstellungen für die Nutzung mit der Applikation
angepasst sind. Die Einstellungen sind in src/config/config.json ersichtlich
und können bei Bedarf angepasst werden.

Die Client ID kann beim Start über ``--env.clientId={client id}`` übergeben werden.

Development Server starten:

```sh
yarn start --env.clientId={client id}
```

Für Produktion bauen (ggf. vorher eine neue Konfiguration eintragen!):

```sh
yarn build --env.clientId={client id}
```

Es ist aber auch möglich, eine Konfigurationsdatei mit dem Namen ``.md-oidc.<env>`` der Client ID 
in das Home-Verzeichnis des ausführenden Benutzers zu legen. ``<env>`` muss dann durch "dev" 
for den Development Server und "prod" für die produktive Version ersetzt werden.

Z.B.
```cat ~/.md-oidc.dev
{
  "clientId": "{client id}"
}
```
