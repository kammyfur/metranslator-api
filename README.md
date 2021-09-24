# metranslator-api

A translation API that can translate English to Metroz and Metroz to English

## Usage
```plaintext
node index.js <mode> <target language> <message>
```

* `<mode>`:
  * `debug`   to get debugging information and pretty-printed JSON
  * `release` to get beautiful data with details
  * `api`     to get machine-readable data, as a JSON object

* `<target language>`:
  * `en`      to translate from **Metroz**  to **English**
  * `mt`      to translate from **English** to **Metroz**

* `<message>`: The message you want to translate