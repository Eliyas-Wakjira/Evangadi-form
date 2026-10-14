# Projectii Forum deploy gochuu: Render API + Netlify frontend

```text
Browser -> Netlify (React/Vite frontend)
              |
              | HTTPS; VITE_API_BASE_URL
              v
         Render (Express backend/API)
              |
              v
         MySQL database hostaa
```

## 1. MySQL database qopheessuu

Render Blueprint kun MySQL hin uumu. Kanaaf MySQL 8 database provider
hostaa irraa uumi. Render irraa database sana bira ga'uun akka danda'amu
mirkaneessi; provider kee TLS yoo gaafate TLS fayyadami.

Provider irraa odeeffannoo kana galmeeffadhu:

| Odeeffannoo provider | Environment variable |
| --- | --- |
| Hostname | `DB_HOST` |
| Port (yeroo baay'ee `3306`) | `DB_PORT` |
| Maqaa database | `DB_NAME` |
| Username | `DB_USER` |
| Password | `DB_PASSWORD` |

Database fi user uumi; user kun tables uumuu fi jijjiiruuf hayyama qabaachuu
qaba. Backend yeroo jalqabu tables isaa ofumaan uuma. Database keessa tables
wal-fakkaatan yoo jiran `backend/db/schema.sql` irra deebi'anii hin hojjetin.

Provider kee TLS yoo gaafate Render keessatti `DB_SSL=true` godhi.
`DB_SSL_REJECT_UNAUTHORIZED=true` tursiisi; provider kee certificate
verification dhaamsi jedhee yoo qajeelche qofa jijjiiri.

## 2. Backend/API gara Renderitti deploy gochuu

`render.yaml` keessatti backend plan `starter` filatameera; kun paid plan dha.
Kaffaltii irraa of qusachuuf `render.yaml` keessatti `plan: free` godhi yoo
account kee free plan deeggaru, garuu yeroo hojii malee ture booda hirribatti
seenuu isaa eeyyami.

1. Projectii kana GitHub irratti push godhi.
2. Render keessatti **New > Blueprint** filadhu; repository GitHub kana
   walqabsiisi. `render.yaml` jiru filatama.
3. Render `evangadi-forum-api` web service ni uuma. Yeroo gaafatamu gatii
   database **Tarkaanfii 1** irraa galchi.
4. Gatiiwwan hafan galchi:

   | Variable | Gatii |
   | --- | --- |
   | `FRONTEND_URL` | Jalqabaaf `http://localhost:5173`; Netlify erga uumtee booda URL isaa itti jijjiiri |
   | `GEMINI_API_KEY` | Gemini API key |
   | `GEMINI_MODEL` | Model Gemini API key kee irratti hojjatu |
   | `GEMINI_EMBEDDING_MODEL` | Model embedding Gemini API key kee irratti hojjatu |
   | `GEMINI_FALLBACK_MODEL` | Filannoo; fallback model yoo qabaatte |
   | `EMAIL_USER`, `EMAIL_PASS` | Password reset email yoo barbaadde qofa |

   `JWT_SECRET` Render ofumaan ni maddisiisa. Secret gatiiwwan kana hin
   qoodin, Git keessaas hin galchin.
5. Blueprint deploy godhi. URL API Render siif kenne kuusi; fakkeenyaaf
   `https://evangadi-forum-api.onrender.com`.
6. Deploy erga xumuramee booda URL API sana bani. Yoo sirriitti hojjete
   `"database":"up"` ni mul'ata. Database yeroo backend jalqabu hin argamne
   taanaan service jalqabuu hin danda'u; Render logs keessatti `DB_*`,
   network access, fi TLS ilaali. Database erga jalqabee booda addaan cite
   taanaan health endpoint HTTP 503 fi `"database":"down"` deebisa.

## 3. Frontend gara Netlifytti deploy gochuu

1. Netlify keessatti **Add new site > Import an existing project** filadhu;
   repository GitHub kana walqabsiisi.
2. **Base directory** `frontend` godhi.
3. **Build command** `npm run build`; **Publish directory** `dist` godhi.
   `netlify.toml` settings kana ofumaan qindeessa.
4. Netlify site settings keessatti environment variable kana galchi:

   | Variable | Gatii |
   | --- | --- |
   | `VITE_API_BASE_URL` | URL API Render Tarkaanfii 2 irraa, fakkeenyaaf `https://evangadi-forum-api.onrender.com` |

   Dhuma irratti `/api` hin dabaliin; frontend ofumaan itti dabala.
   Gatiin kun yoo hin jirre production build ni kufa, kanaaf API URL localhost
   irratti akka hin deemin.
5. Deploy jalqabi. Vite variable kana build yeroo godhu bundle keessa kaa'a;
   kanaaf `VITE_API_BASE_URL` jijjiirte frontend irra deebi'ii build/deploy
   gochuu qabda.
6. URL Netlify kuusi; fakkeenyaaf `https://your-forum.netlify.app`.

`frontend/public/_redirects` Netlify irratti React Router page refresh fi
link kallattiin banamu akka danda'an taasisa.

## 4. Netlify fi Render walitti hidhuu

Render dashboard keessatti API service bani; environment settings keessaa
`FRONTEND_URL` gatii URL Netlify keetiin jijjiiri. Dhuma irratti `/` hin
dabaliin. Domain frontend hedduu yoo qabda ta'e comma'n adda baasi:

```text
https://your-forum.netlify.app,https://forum.example.com
```

URL jalqabaa password-reset link keessatti fayyada. Jijjiirama save godhiitii
API irra deebi'ii deploy godhi. CORS origins kana qofaaf hayyama; health check
akka `Origin` hin qabne ni fudhata.

## 5. Hojii isaa mirkaneessuu

1. `https://<your-render-api>/` bani. HTTP 200 fi `"database":"up"` arguu qabda.
2. Netlify site bani; galmaa'i/seeni, gaaffii uumi, avatar ykn document
   upload godhi.
3. Browser CORS error yoo agarsiise, `FRONTEND_URL` Netlify origin sirrii
   ta'uu (dabalatee `https://` fi custom domain) mirkaneessi; API irra deebi'ii
   deploy godhi.
4. Request API gara localhost ykn URL durii yoo deeme, Netlify
   `VITE_API_BASE_URL` mirkaneessi; frontend irra deebi'ii deploy godhi.

## Yaadannoo hojii

- Uploads `backend/uploads` irratti, local filesystem Render keessa kuufamu.
  Restart/redeploy booda faayiloonni baduu danda'u; instances hedduun uploads
  wal hin qoodan. Avatar fi PDF yeroo dheeraaf tursiisuuf object storage ykn
  persistent disk barbaachisa.
- Free hosting plan yeroo muraasa hojii malee ture booda hirribatti seenuu
  danda'a; request jalqabaa suuta deebisuu mala.
- Backend yeroo jalqabu schema database idempotent ta'een qopheessa. Schema
  data haqu ykn jijjiiruu yoo barbaadde backup godhi; migration sana ofumaan
  akka raawwatamu hin amanin.
- `.env` fi production secrets Git keessa hin galchin. Credential duraan
  qoodame ykn mul'ate yoo jiraate jijjiiri.
