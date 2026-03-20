# sf-apex-testing

Agente autonomo che crea o sistema classi di test Apex. Dato il nome di una classe o trigger, analizza il codice sorgente, scansiona i pattern di dati esistenti, valuta i test già presenti, scrive test significativi, li deploya su sandbox e corregge gli errori in autonomia.

## Come si usa

```
/sf-apex-testing AccountTriggerHandler
/sf-apex-testing QuoteLineService
/sf-apex-testing testa questa classe: OpportunityUtils
```

## Output

- Classe di test funzionante deployata su sandbox
- Riepilogo: comportamenti testati, eventuali bug trovati nel sorgente, gap di coverage
- Aggiornamento di `.claude/sf-test-learnings.md` con i pattern scoperti

## Come funziona internamente

1. **Selezione org**: sceglie automaticamente la sandbox (preferisce `aetna-dev`). Non deploya mai in produzione.
2. **Discovery**: trova la classe/trigger sorgente e l'eventuale test class esistente
3. Lancia in parallelo 3 agenti di analisi:
   - `sf-source-analyzer` — comportamenti, branch, dipendenze
   - `sf-data-scanner` — pattern dati, factory, custom settings, validation rules
   - `sf-test-analyzer` — qualità dei test esistenti (keep / fix / rewrite)
4. **Ragiona** sui 3-5 comportamenti più rilevanti in produzione
5. **Scrive** la classe di test con asserzioni business-level, bulk test, dati espliciti
6. **Deploya e testa** via `sf-test-runner` (max 5 iterazioni di fix automatico)
7. **Aggiorna** `.claude/sf-test-learnings.md` con i pattern scoperti

## Regole non negoziabili

- Asserzioni reali con messaggi business-level (no `assertTrue(true)`)
- Bulk test (200 record) per trigger e batch
- Dati di test espliciti — vietato `SeeAllData=true`
- `Test.startTest()/stopTest()` solo attorno all'azione da testare
- Focus sui comportamenti rilevanti in produzione, non sulla copertura riga per riga

## File generati

- `force-app/main/default/classes/[NomeClasse]_TEST.cls` — classe di test
- `.claude/sf-test-learnings.md` — learnings cumulativi da condividere col team