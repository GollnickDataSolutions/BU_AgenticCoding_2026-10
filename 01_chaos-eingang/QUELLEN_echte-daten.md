# Quellen für echte Beispieldaten (statt Dummy-Dateien)

Der Übungsordner `01_chaos-eingang/` enthält synthetische Dummy-Dateien **und
zusätzlich einige echte, frei lizenzierte Beispieldateien** (siehe Abschnitt 0).
Diese Datei dokumentiert die konkret hinzugefügten echten Dateien sowie weitere
Quellen, mit denen sich Dummy-Daten ersetzen lassen – inklusive Lizenzhinweisen.

> **Hinweis zum Speicherort:** Diese Datei liegt direkt in `01_chaos-eingang/`.
> Achtung: Sie ist damit Teil des „nicht verändern"-Inputs der Sortierübung. Vor dem
> tatsächlichen Lauf der Übung diese Datei entfernen (oder ignorieren lassen), damit
> der Agent sie nicht mit einsortiert.

---

## 0. Bereits eingefügte echte Beispieldateien (mit Quelle)

Diese Dateien wurden am 2026-06-22 real heruntergeladen und liegen in diesem Ordner.
Das Änderungsdatum wurde bewusst auf Dez 2025 – März 2026 gestreut, damit der
Lern-Stolperstein „verteilte Daten" (Sortieren nach Jahr/Monat) erhalten bleibt.

**Bilder (alle echten Fotos/Screenshots):**

| Datei | Motiv | Quelle | Urheber | Lizenz |
|---|---|---|---|---|
| `DSC00045.JPG` | Küsten-Luftaufnahme, türkises Wasser | <https://www.pexels.com/photo/462162/> | Pixabay | Pexels / CC0, keine Attribution nötig |
| `foto.jpg` | Zwei Labrador-Welpen im Blumenfeld | <https://www.pexels.com/photo/1108099/> | Chevanon Photography | Pexels License, keine Attribution nötig |
| `foto - Kopie.jpg` | **byte-identische Dublette** von `foto.jpg` (Stolperstein) | (Kopie, gleiche Quelle) | Chevanon Photography | Pexels License |
| `IMG_2031.jpg` | Fantasy-Wald, blaue Schmetterlinge & Pilze | <https://www.pexels.com/photo/326055/> | Pixabay | Pexels / CC0, keine Attribution nötig |
| `IMG_2032.jpg` | Stapel bunter Textilien/Teppiche | <https://www.pexels.com/photo/365067/> | Digital Buggu | Pexels License, keine Attribution nötig |
| `WhatsApp Image 2026-02-14.jpeg` | Urlaubsmotiv: Steg an Malediven-Resort | <https://www.pexels.com/photo/1268855/> | Asad Photo Maldives | Pexels License, keine Attribution nötig |
| `IMG_8842.jpg` | Aktenordner / Dokumente | <https://www.pexels.com/photo/357514/> | Pixabay | Pexels / CC0, keine Attribution nötig |
| `foto_schreibtisch.jpg` | Schreibtisch mit Laptop, Charts, Lebenslauf | <https://www.pexels.com/photo/590016/> | Lukas Blazek | Pexels License, keine Attribution nötig |
| `Bildschirmfoto_code.jpg` | Quellcode auf Bildschirm (Screenshot-artig) | <https://www.pexels.com/photo/270348/> | Pixabay | Pexels / CC0, keine Attribution nötig |
| `DSC00891.JPG` | Hände zählen Geldscheine (Finanzmotiv) | <https://www.pexels.com/photo/4386431/> | Karola G (kaboompics.com) | Pexels License, keine Attribution nötig |
| `Screenshot 2026-03-01 142210.png` | Echter LibreOffice-Screenshot (UI-Auswahl) | <https://commons.wikimedia.org/wiki/File:LibreOffice_-_Selecting_the_user_interface.png> | Wikimedia-Autor | **CC-BY-SA** – Namensnennung + ShareAlike nötig |

**Daten:**

| Datei | Inhalt | Quelle | Urheber | Lizenz |
|---|---|---|---|---|
| `GE_aktienkurs.csv` | Echte Börsen-Tageskurse (General Electric, ab 2003) | <https://github.com/scikit-learn/examples-data/blob/master/financial-data/GE.csv> | scikit-learn `examples-data` | Open Source (BSD-3-Clause) |

> Die meisten Bilder stammen über das Pexels-CDN (`images.pexels.com`,
> Schema `…/photos/<ID>/pexels-photo-<ID>.jpeg`). Die Motive wurden bewusst
> **ohne erkennbare Gesichter** (Objekte/Tiere/Landschaft) gewählt, um
> Persönlichkeitsrechte / fehlende Model-Releases zu umgehen.
> **Ausnahme Lizenz:** Der PNG-Screenshot ist **CC-BY-SA** (Wikimedia) – bei
> Weitergabe Urheber nennen und unter gleicher Lizenz teilen.

---

## Zusammenfassung: Was lässt sich durch echte Daten ersetzen?

| Dummy-Typ | Echte Daten nutzbar? | Empfehlung |
|---|---|---|
| **Fotos** (`.jpg`, `.jpeg`, `.png`) | ✅ Ja, problemlos | Unsplash / Pexels / Pixabay |
| **CSV-Finanzdaten** (`tabelle.csv`) | ✅ Ja | offene/synthetische Finanz-Datensätze |
| **Belege/Rechnungen** (`rechnung.txt` etc.) | ⚠️ Eingeschränkt | echte Datasets sind Bilder + fremdsprachig → bricht das Plain-Text-Design |
| **Verträge / private Briefe** | ❌ Nein | keine guten freien Quellen, Datenschutz → synthetisch lassen |

---

## 1. Fotos – uneingeschränkt empfehlenswert ✅

Ersetzt: `DSC00045.JPG`, `foto.jpg`, `foto - Kopie.jpg`, `IMG_2031.jpg`,
`IMG_2032.jpg`, `WhatsApp Image 2026-02-14.jpeg`, `Screenshot 2026-03-01 142210.png`

Alle drei Plattformen erlauben **kostenlose kommerzielle Nutzung ohne Attributionspflicht**
(Credit ist nicht erforderlich, aber gern gesehen):

- **Unsplash** – seit 2017 eigene „Unsplash License" (vorher CC0): kostenlos,
  kommerziell, ohne Genehmigung/Nennung. <https://unsplash.com/license>
- **Pexels** – „Pexels License": frei für privat & kommerziell, keine Attribution nötig.
  <https://www.pexels.com/license/>
- **Pixabay** – seit 2019 eigene „Pixabay License" (vorher CC0): kostenlos,
  ohne Attribution. <https://pixabay.com/>
- Übersicht weiterer CC0-/Public-Domain-Quellen:
  <https://www.wpbeginner.com/showcase/16-sources-for-free-public-domain-and-cc0-licensed-images/>

**Wichtige Vorbehalte für den Kurseinsatz:**
- Kein Foto auf diesen Plattformen ist „verifiziert" – es gibt **keine Model-Releases**.
  Für Kursmaterial, das weiterverteilt wird, daher **Objekt-/Landschafts-/Produktfotos**
  bevorzugen, keine klar erkennbaren Personen.
- Die Übung sortiert **nach Datei-Datum** (Lern-Stolperstein „verteilte Daten 12/2025–03/2026").
  Heruntergeladene Fotos tragen das Download-Datum → Änderungsdatum nach dem Download
  künstlich auf die gewünschten Monate setzen (z. B. per Skript), sonst landen alle
  im selben Monat.

## 2. CSV-Finanzdaten – nutzbar ✅

Ersetzt: `tabelle.csv` (Einnahmen-/Ausgaben-Übersicht)

- **CORGIS Finance CSV** (aus Annual Survey of State Government Finances, US, frei):
  <https://corgis-edu.github.io/corgis/csv/finance/>
- **Kaggle – Personal Finance Data** (synthetische Einnahmen/Ausgaben mit Spalten
  Date, Description, Category, Amount, Type – passt strukturell exakt):
  <https://www.kaggle.com/datasets/ramyapintchy/personal-finance-data>
- **Excelx – Finance & Accounting Sample Data** (5 Datensätze, 100 % Dummy,
  „audit-ready"): <https://excelx.com/practice-data/finance-accounting/>

Hinweis: Die meisten sind ebenfalls synthetisch oder englischsprachig. Für den
deutschsprachigen Kurs ist die aktuelle handgemachte `tabelle.csv` oft passender –
echte Datensätze v. a. dann sinnvoll, wenn größere/realistischere Datenmengen
gewünscht sind.

## 3. Belege / Rechnungen – nur eingeschränkt ⚠️

Betrifft: `rechnung.txt`, `rechnung (1).txt`, `handwerker.txt`,
`Scan_20260312_0001.txt`, `KW10 an Steuerberater.txt`

Es gibt echte, öffentliche Beleg-Datensätze, die aber **dem Kursdesign widersprechen**:
Das README hält bewusst alle „Dokumente" als **lesbare Textdateien** (statt PDFs/Scans),
„damit die Inhalts-Analyse ohne PDF-Parser/OCR auf jedem Rechner funktioniert."
Die echten Datasets sind dagegen **gescannte Bilder** und meist **englisch/indonesisch**:

- **SROIE** (ICDAR 2019, ~1.000 gescannte Belege, EN): Benchmark für Receipt-OCR.
- **CORD** (Consolidated Receipt Dataset, 1.000 indonesische Belege, **CC-BY-4.0**):
  <https://openreview.net/pdf?id=SJl3z659UH>
- **ExpressExpense SRD** (200 Restaurant-Beleg-Fotos, frei):
  <https://expressexpense.com/blog/free-receipt-images-ocr-machine-learning-dataset/>
- Übersicht weiterer OCR-/Beleg-Datensätze:
  <https://www.shaip.com/blog/15-best-opensource-handwriting-dataset/>

**Empfehlung:** Nur einsetzen, wenn die Übung bewusst auf **bildbasierte Belege +
OCR** umgestellt werden soll (höhere Einstiegshürde, widerspricht Stufe-1-Ziel
„niedrige Barriere"). Sonst die synthetischen deutschen Textdateien beibehalten.

## 4. Verträge / private Briefe – synthetisch belassen ❌

Betrifft: `Unbenannt.txt` (Mietvertrag), `bewerbung_anschreiben_ENTWURF.txt`,
`Notizen.txt`, `dokument (1).txt`, `final_FINAL_v2.txt`

Für echte deutsche Verträge, Bewerbungen oder Privatkorrespondenz gibt es **keine
geeigneten frei lizenzierten Quellen**, und echte Exemplare sind **datenschutzrechtlich
heikel** (personenbezogene Daten). Diese Dateien sollten **synthetisch bleiben**.

---

## Fazit / Empfehlung

- **Lohnt sich:** Fotos durch echte Unsplash-/Pexels-/Pixabay-Bilder ersetzen
  (Objekte/Landschaften, Datei-Datum nachsetzen).
- **Optional:** `tabelle.csv` durch einen größeren offenen Finanz-CSV-Datensatz ersetzen.
- **Beibehalten:** Text-„Dokumente" (Belege, Verträge, Briefe) bleiben synthetisch –
  das ist eine bewusste didaktische Entscheidung (kein OCR, deutschsprachig, datenschutzkonform).

---

_Recherchiert am 2026-06-22. Lizenzbedingungen können sich ändern – vor Nutzung jeweils
aktuelle Lizenzseite prüfen._
