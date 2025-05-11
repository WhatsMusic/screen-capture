<!-- filepath: /Users/robertschulz/Developer/screen-capture/README.md -->
# Screen Capture & PiP-Recorder

Dieses Projekt kombiniert moderne Web-Technologien, um eine fortschrittliche Bildschirmaufnahme zu ermöglichen – inklusive Picture-in-Picture (PiP) für Webcam-Aufnahmen. Dabei wird ausschließlich die Browserumgebung genutzt, sodass keine Desktop-Anwendung (Electron) benötigt wird.

## Features

- **Bildschirmaufnahme (Screen Capture):** Nutzt die Web-API `navigator.mediaDevices.getDisplayMedia` für eine effiziente und flexible Aufnahme.
- **Kameraaufnahme (Picture-in-Picture):** Bindet eine Webcam-Aufnahme als PiP ein, die simultan mit der Bildschirmaufnahme aufgezeichnet wird.
- **Audio-Mix:** Ermöglicht das Mischen von Bildschirm- und Mikrofoneingaben.
- **Flexible Einstellungen:** Bietet Optionen zur Auswahl der Bitrate und dynamische Anpassungen an Audio-Prozesse (z. B. Hochpassfilter und Dynamik-Kompressor).
- **Client-/Server-Routing:** Dank Next.js erfolgt das Routing und die Darstellung über eine reaktive Weboberfläche.

## Voraussetzungen

- [Node.js](https://nodejs.org) v16 oder höher (ESM-Modus wird verwendet)
- Ein moderner Browser, der die benötigten Web-APIs (DisplayMedia, MediaDevices) unterstützt

## Installation

1. **Repository klonen:**

    ```bash
    git clone https://github.com/dein-benutzername/screen-capture.git
    cd screen-capture
    ```

2. **Abhängigkeiten installieren:**

    ```bash
    npm install
    ```

3. **Starten der Anwendung:**

    Starte den Entwicklungsserver mit:

    ```bash
    npm run dev
    ```

    Öffne anschließend [http://localhost:3000](http://localhost:3000) in deinem Browser, um den Screenrecorder zu nutzen.

## Projektstruktur

- `app/`: Enthält alle Next.js-Seiten und Komponenten zur Benutzeroberfläche.
- `README.md`: Diese Datei.
- `package.json`: Projektkonfiguration und Skripte für Build, Development und Produktion.

## Troubleshooting

- **Fehlende API-Unterstützung:** Stelle sicher, dass dein Browser die Web APIs wie `getDisplayMedia` unterstützt.
- **React Hook Warnungen:** Achte darauf, dass alle notwendigen Abhängigkeiten in den React Hooks (z. B. `useCallback`, `useEffect`) korrekt angegeben sind.

## Weiterführende Informationen

- [Next.js Dokumentation](https://nextjs.org/docs)
- [Web APIs zur Bildschirmaufnahme](https://developer.mozilla.org/docs/Web/API/Screen_Capture_API)

## Lizenz

Dieses Projekt ist lizenziert unter der [MIT Lizenz](LICENSE).
