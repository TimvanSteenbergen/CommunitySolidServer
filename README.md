# Lokale test-Solid-server

Een lokale [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer)
om de Solid Pod Browser-app tegenaan te testen, zonder een account bij een
externe provider nodig te hebben.

## Starten

```
npm run dev
```

(of via de preview-tool in de sessie: launch-config `css-server`.)

## Test-account

- **Issuer / Identity Provider**: `http://localhost:3000/`
- **E-mail**: `test@example.org`
- **Wachtwoord**: `test1234`
- **WebID**: `http://localhost:3000/test/profile/card#me`
- **Pod-root**: `http://localhost:3000/test/`

Dit account + pod wordt automatisch aangemaakt bij het opstarten via
`seed.json` (idempotent: bestaat het al, dan logt de server alleen een
waarschuwing en gaat door).

## Type index

CSS 7.x voorziet pods standaard niet van een `solid:privateTypeIndex`
(in tegenstelling tot bijv. Inrupt PodSpaces/NSS). Omdat de Solid Pod
Browser-app die nodig heeft om data-definities te registreren, is er
handmatig een toegevoegd:

- `data/test/profile/card$.ttl` kreeg een `solid:privateTypeIndex` en
  `pim:storage` triple.
- `data/test/settings/privateTypeIndex.ttl` is aangemaakt als leeg
  `solid:TypeIndex`.

Beide zijn alleen voor de eigenaar leesbaar/schrijfbaar (via de
root-`.acl` die standaard toegang voor de owner overal in de pod
regelt) - precies zoals een echte privé type index zich gedraagt.

## Lock-timeout verruimd

CSS' standaard `file.json`-config zet de resource-lock-expiratie op
6000ms (`config/util/resource-locker/file.json` in het package). Voor een
klein testbestand is dat ruim genoeg, maar een écht bestand (bv. een foto
rechtstreeks uit bestandsbeheer gesleept in plaats van via de
bestandsdialoog gekozen) kan langer duren om weg te schrijven, wat dan
een `500 Lock expired after 6000ms` geeft bij het opslaan. `config/longer-
lock.json` overschrijft (via Components.js' `Override`-mechanisme) alleen
de `expiration`-parameter van `urn:solid-server:default:ResourceLocker`
naar 120000ms (2 minuten), zonder de rest van de locker-configuratie te
hoeven herhalen. `npm run dev` geeft deze config als tweede `-c`-vlag mee
naast de standaard `@css:config/file.json`.

## Let op

Dit is puur lokale test-infrastructuur (geen echte account bij een
provider). De data in `data/` is wegwerp-testdata.
"# CommunitySolidServer" 
