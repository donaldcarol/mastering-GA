# Mastering GitHub Actions

Repository de laborator pentru învățarea GitHub Actions: de la primele joburi până la teste automate, containere, publicarea imaginilor și GitHub Releases.

Exemplele sunt exerciții independente. Unele simulează operații sau demonstrează intenționat comportamente nesigure; nu reprezintă un pipeline gata pentru producție. Configurarea branch protection, environments și secrets se face în GitHub și nu este inclusă integral în fișierele repository-ului.

## Pornire rapidă

1. Deschide tabul **Actions** al repository-ului.
2. Selectează workflow-ul dorit după nume.
3. Dacă definește `workflow_dispatch`, apasă **Run workflow** și completează inputurile.
4. Verifică joburile, logurile, pagina **Summary** și secțiunea **Artifacts**.

Workflow-urile cu `workflow_call` sunt apelate de alte workflow-uri. `release-demo.yml` pornește la publicarea unui tag `v*`, nu dintr-un buton de rulare manuală.

## Indexul exemplelor

### Structură, events și controlul execuției

| Fișier | Ce demonstrează |
|---|---|
| [01-building-blocks.yml](.github/workflows/01-building-blocks.yml) | Joburi, pași și comenzi; pornire la push, PR sau manual |
| [02-workflow-events.yaml](.github/workflows/02-workflow-events.yaml) | Evenimentul care declanșează rularea |
| [07-expressions.yaml](.github/workflows/07-expressions.yaml) | Context, expresii și pași condiționați de inputul `debug` |
| [10-execution-flow.yml](.github/workflows/10-execution-flow.yml) | Dependențe între joburi și deploy simulat |
| [14-execution-control.yml](.github/workflows/14-execution-control.yml) | `continue-on-error`, `outcome`, `conclusion`, cleanup și timeout |
| [15-job-control.yml](.github/workflows/15-job-control.yml) | `needs`, tratarea eșecurilor și rezultatele joburilor |
| [concurrency-demo.yml](.github/workflows/concurrency-demo.yml) | Gruparea rulărilor după resursă și anularea rulării anterioare |

### Build, artifacts și cache

| Fișier | Ce demonstrează |
|---|---|
| [node-demo-ci.yml](.github/workflows/node-demo-ci.yml) | Instalare, teste, build Node.js și transferul rezultatului între joburi |
| [react-build.yml](.github/workflows/react-build.yml) | Build React, artifact și deploy simulat |
| [13-caching.yml](.github/workflows/13-caching.yml) | Cache npm și build React |
| [artifacts-demo.yml](.github/workflows/artifacts-demo.yml) | Exemplu inițial de generare și transfer al unui raport |
| [artifacts-demo2.yml](.github/workflows/artifacts-demo2.yml) | Upload și download pentru artifactul `raport-test` |
| [list-artifacts.yml](.github/workflows/list-artifacts.yml) | Listarea artifactelor repository-ului, inclusiv ID și run ID |
| [read-artifact.yml](.github/workflows/read-artifact.yml) | Descărcarea `raport-test` dintr-o rulare indicată prin `source_run_id` |
| [cache-demo.yml](.github/workflows/cache-demo.yml) | Cheie de cache, `restore-keys` și `cache-hit` |

Pentru exercițiul de transfer al raportului, folosește `artifacts-demo2.yml`. Workflow-urile de build Node/React necesită directoarele aplicațiilor și fișierele de dependențe indicate în YAML.

### Environments, permissions și securitate

| Fișier | Ce demonstrează |
|---|---|
| [environments-demo.yml](.github/workflows/environments-demo.yml) | Staging → production, variabile și secrets de environment |
| [permissions-demo.yml](.github/workflows/permissions-demo.yml) | `issues: write`; creează efectiv un issue de exercițiu |
| [input-demo.yml](.github/workflows/input-demo.yml) | Diferența dintre interpolarea nesigură în script și transmiterea prin `env` |
| [lint-workflows.yml](.github/workflows/lint-workflows.yml) | Validarea workflow-urilor cu actionlint |
| [CODEOWNERS](.github/CODEOWNERS) | Ownership pentru workflow-uri și fișierul CODEOWNERS |

`input-demo.yml` conține intenționat un pas nesigur. Nu reutiliza acel pas ca model pentru inputuri necontrolate.

### Reusable workflows și composite actions

| Fișier | Ce demonstrează |
|---|---|
| [call-greeting.yml](.github/workflows/call-greeting.yml) | Apelarea unui reusable workflow cu input, secret și output |
| [reusable-greeting.yml](.github/workflows/reusable-greeting.yml) | Contractul `workflow_call`: inputs, secrets și outputs |
| [call-hello.yml](.github/workflows/call-hello.yml) | Două apeluri ale aceluiași reusable workflow |
| [reusable-hello.yml](.github/workflows/reusable-hello.yml) | Generarea și returnarea unui salut |
| [composite-demo.yml](.github/workflows/composite-demo.yml) | Apelarea unei acțiuni locale și citirea outputului |
| [greeting/action.yml](.github/actions/greeting/action.yml) | Composite action cu inputs, output și token primit explicit |

### Containere, rapoarte, teste și Releases

| Fișier | Ce demonstrează |
|---|---|
| [services-demo.yml](.github/workflows/services-demo.yml) | Client în containerul jobului și server PostgreSQL într-un service container |
| [Dockerfile](.github/images/ci-tools/Dockerfile) | Imagine cu Python 3.12, Git și curl |
| [publish-image.yml](.github/workflows/publish-image.yml) | Build și publicare în GHCR cu `packages: write` |
| [use-ci-image.yml](.github/workflows/use-ci-image.yml) | Reutilizarea imaginii `ghcr.io/donaldcarol/ci-tools:1.0` |
| [summary-demo.yml](.github/workflows/summary-demo.yml) | Raport Markdown bazat pe rezultatul unui pas |
| [tests-demo.yml](.github/workflows/tests-demo.yml) | Teste Python, log, artifact și Summary inclusiv la eșec |
| [release-demo.yml](.github/workflows/release-demo.yml) | Teste urmate de publicarea unui Release, doar la succes |
| [calculator.py](calculator.py), [test_calculator.py](test_calculator.py) | Funcția de adunare și testele ei cu `unittest` |

## Conceptele de reținut

### Workflow, job și step

- **Workflow**: fișierul YAML din `.github/workflows` care definește declanșarea și joburile.
- **Job**: grup de pași executați pe un runner. Joburile pot rula în paralel dacă nu au dependențe.
- **Step**: o comandă `run` sau apelul unei acțiuni prin `uses`.
- **`needs`**: se referă la joburi, nu la pași. Ordinea în YAML nu stabilește ordinea execuției.
- **`id`**: identifică un pas pentru referințe precum `steps.generate.outputs.message`.

Implicit, un job cu `needs` așteaptă succesul joburilor de care depinde. Un job eșuat sau omis poate determina omiterea joburilor dependente; condițiile explicite pot modifica acest comportament.

### Inputs, outputs și secrets

| Expresie | Semnificație |
|---|---|
| `inputs.person` | Valoare primită ca input |
| `steps.greeting.outputs.message` | Outputul unui pas din același job |
| `needs.call-greeting.outputs.message` | Outputul unui job de care depindem |
| `secrets.DEMO_TOKEN` | Secret disponibil rulării, conform regulilor de acces |
| `vars.APP_URL` | Variabilă de configurare |

Un reusable workflow expune valorile pe traseul **step output → job output → workflow output**.

O composite action grupează **pași**, iar un reusable workflow poate defini **joburi**. Apelul local `uses: ./.github/actions/greeting` indică directorul: GitHub caută automat în el `action.yml` sau `action.yaml`. Checkout-ul trebuie executat înaintea apelului acțiunii locale.

În exemplul composite, secretul este transmis explicit:

```yaml
with:
  person: Donald
  demo-token: ${{ secrets.DEMO_TOKEN }}
```

Secretul nu se transmite automat doar fiindcă există în repository. PR-urile din fork-uri nu primesc în mod normal repository secrets.

### Artifacts, cache, Summary, registry și Release

| Mecanism | Rol |
|---|---|
| **Artifact** | Păstrează fișiere produse de o rulare; poate fi descărcat sau transmis altui job |
| **Cache** | Accelerează rulările prin reutilizarea unor dependențe sau fișiere |
| **Job Summary** | Afișează Markdown scris în fișierul indicat de `$GITHUB_STEP_SUMMARY` |
| **Container registry** | Păstrează imagini Docker, de exemplu GHCR sau ACR |
| **GitHub Release** | Publică o versiune asociată unui tag, cu descriere și fișiere opționale |

Cache-ul nu înlocuiește un artifact. Un cache salvat nu se suprascrie pentru aceeași cheie și același scope/version; schimbarea cheii permite crearea unei intrări noi. `cache-hit: true` indică o potrivire exactă, nu doar restaurarea printr-o cheie de rezervă.

Summary-ul nu este un fișier comun tuturor workflow-urilor. Pentru reutilizarea raportului într-o altă rulare, salvează-l separat și încarcă-l ca artifact.

### Containere în GitHub Actions

| Configurare | Unde rulează clientul | Conectare la serviciu |
|---|---|---|
| Doar `services` | Direct pe runner | `localhost` și portul publicat |
| `container` + `services` | În containerul jobului | Numele serviciului, de exemplu `postgres:5432` |

Maparea `5433:5432` înseamnă **portul 5433 pe runner → portul 5432 în container**. `localhost` se referă la mediul în care rulează procesul: runnerul sau containerul jobului.

Runnerul găzduiește containerele. Service containers aparțin unui singur job și sunt eliminate la final. La fiecare rulare se creează containere noi; fișierele și datele lor nu sunt păstrate automat.

`postgres:17` folosește implicit Docker Hub. `ghcr.io/donaldcarol/ci-tools:1.0` indică GHCR. Tagurile imaginilor pot fi mutate; un digest identifică exact conținutul imaginii.

## Configurarea exercițiilor

### Secrets și environments

- **Repository secret `DEMO_TOKEN`**: necesar pentru `call-greeting.yml` și `composite-demo.yml`. Folosește o valoare fictivă pentru laborator.
- **Environments `staging` și `production`**: fiecare trebuie să aibă variabila `APP_URL` și secretul `DEPLOY_TOKEN`.
- Aprobările și restricțiile de branch pentru environments se configurează în **Settings → Environments**.
- `GITHUB_TOKEN` este furnizat automat. Publicarea imaginilor și crearea Releases folosesc acest token, cu permisiunile declarate în workflow.

Nu salva valori reale de secrets în repository, artifacts, cache sau rapoarte.

### Permisiunile tokenului

| Permisiune | Exemplu în laborator |
|---|---|
| `contents: read` | Checkout-ul codului |
| `contents: write` | Crearea unui Release și atașarea unui fișier |
| `issues: write` | Crearea unui issue |
| `actions: read` | Listarea și descărcarea artifactelor din alte rulări |
| `packages: write` | Publicarea imaginii în GHCR |

`permissions: {}` nu acordă permisiuni configurabile suplimentare tokenului. Acordă drepturi de scriere doar joburilor care au nevoie de ele.

### Imaginea CI

Workflow-ul **Publică imaginea CI** construiește Dockerfile-ul și publică:

```text
ghcr.io/donaldcarol/ci-tools:1.0
```

Imaginea trebuie să fie disponibilă înaintea rulării exemplelor care o folosesc. În laborator este publică. Dacă lucrezi într-un fork, adaptează numele imaginii la propriul cont și configurează accesul dacă imaginea este privată.

Rularea repetată a workflow-ului de publicare poate actualiza tagul `1.0`. Pentru versiuni reproductibile, folosește taguri distincte și/sau digesturi.

## Teste și rapoarte

Din rădăcina repository-ului, cu Python instalat:

```powershell
python -m unittest -v test_calculator
```

În GitHub, workflow-ul **Demo teste Python** produce:

- logul complet al testelor;
- un Summary cu rezultatul pasului;
- artifactul `raport-teste`, cu fișierul `tests.txt`, păstrat 7 zile.

Pașii de raportare au `if: always()`, astfel încât rulează și după eșecul testelor. Succesul raportării nu anulează eșecul jobului.

Exercițiul de eșec schimbă temporar `return a + b` în `return a - b`, fără modificarea testelor. După verificare, restabilește adunarea.

## Taguri și Releases

Fluxul din `release-demo.yml` este:

```text
Push tag v* → tests → publish-release
               ↓ eșec
        publicarea este omisă
```

1. Salvează modificările, fă commit și push pe branchul pe care lucrezi.
2. Creează un tag nou pe commitul curent.
3. Publică tagul; acest push declanșează workflow-ul.

```powershell
# Exemplu: alege o versiune nouă, nefolosită.
git tag -a v1.0.4 -m "Versiune de exercițiu"
git push origin v1.0.4
```

Dacă testele trec, workflow-ul creează Release-ul și atașează `version.txt`. GitHub oferă automat și arhivele codului sursă din tag, în formatele ZIP și TAR.GZ.

Dacă testele eșuează, tagul rămâne în GitHub, dar `publish-release` este omis și Release-ul nu este creat. Un commit ulterior pe `main` nu mută tagul. Reexecutarea unei rulări folosește aceeași versiune de cod; pentru cod corectat creează o versiune nouă.

Un Release nu face merge și nu face deploy. Crearea repetată a unui Release pentru un tag care are deja un Release nu este tratată de exemplul nostru.

## Git: recapitularea lucrului local

```powershell
git status
git switch main
git pull --ff-only origin main
git switch -c update-documentation

# După editare:
git diff
git add README.md
git commit -m "Actualizează documentația"
git push -u origin update-documentation
```

Apoi creezi un PR către `main`, verifici schimbările și rezultatele workflow-urilor și faci merge. Push-urile ulterioare pe același branch actualizează PR-ul deschis; nu trebuie creat un PR pentru fiecare commit.

După merge:

```powershell
git switch main
git pull --ff-only origin main
```

În laborator am lucrat și direct pe `main` pentru a simplifica exercițiile, după ajustarea regulilor repository-ului. Într-un proiect de echipă, branchurile, PR-urile și verificările obligatorii controlează integrarea schimbărilor.

## Securitate: lecțiile discutate

- Folosește permisiuni minime pentru `GITHUB_TOKEN`.
- Transmite inputurile către script prin `env` și citează variabilele; evită interpolarea directă a datelor necontrolate în codul shell.
- Fixează acțiunile externe la SHA complet când vrei să controlezi exact codul executat. Exemplele mai vechi includ și referințe prin tag.
- Nu executa cod necontrolat dintr-un PR în contextul privilegiat al `pull_request_target`.
- Un digest verifică identitatea/integritatea conținutului; nu garantează că acel conținut este sigur.
- Nu trata cache-ul sau artifacts din surse necontrolate ca pe cod de încredere pentru un job privilegiat.
- Runner-ele self-hosted pot păstra modificări, procese și acces la rețea între rulări; izolarea contează.
- CODEOWNERS desemnează responsabilii. Obligativitatea aprobării lor trebuie configurată separat prin regulile branchului.

Am discutat și matrix, `include`/`exclude`, `fail-fast`, `max-parallel`, matrix dinamică și riscurile de cache poisoning. Nu toate lecțiile au un workflow dedicat în versiunea actuală a repository-ului.

## Proiectul practic următor

Integrare GitHub Actions cu Azure, incluzând elemente de Azure Landing Zone:

- infrastructură ca cod în Bicep sau Terraform;
- autentificare OIDC, fără un secret permanent pentru login;
- organizare prin resource groups, naming și tags;
- guvernanță prin Azure Policy și acces prin RBAC;
- VNet și subnets;
- monitorizare prin Log Analytics;
- validare, previzualizarea schimbărilor și aprobare înainte de deploy.

Acestea sunt obiectivele proiectului următor, nu resurse deja implementate în acest repository.
