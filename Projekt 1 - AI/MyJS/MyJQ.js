const { useState, useEffect, useMemo } = React;

// Lista över kvalificerade / populära VM-nationer
// (sorteras alfabetiskt så att dropdown-listan blir lättare att läsa)
const VM_LAG = [
  'Argentina', 'Brasilien', 'England', 'Frankrike', 'Italien', 
  'Kroatien', 'Marocko', 'Nederländerna', 'Portugal', 'Spanien', 
  'Sverige', 'Tyskland', 'Uruguay', 'USA'
].sort();

function App() {
  // Formulär-state: namnet som skrivs in och laget som väljs i select-listan
  const [namn, setNamn] = useState('');
  const [lag, setLag] = useState('');

  // Status för formulärets nätverksanrop: null (inget skickat än), 
  // 'loading' (skickar), 'ok' (lyckades) eller 'error' (misslyckades)
  const [status, setStatus] = useState(null);

  // Sökfält (filtrerar tipslistan) och val för sortering av listan
  const [sok, setSok] = useState('');
  const [sortering, setSortering] = useState('nyast');

  // 1. Läs in sparade tips från localStorage när appen startar.
  //    Funktionen i useState körs bara en gång (vid första render).
  const [tips, setTips] = useState(() => {
    try {
      const sparade = localStorage.getItem('vm_tips_data');
      // Om det finns sparad data, parsa JSON-strängen till en array/objekt.
      // Annars börja med en tom lista.
      return sparade ? JSON.parse(sparade) : [];
    } catch (e) {
      // Om något går fel vid parsning (t.ex. korrupt data) - starta tomt
      return [];
    }
  });

  // 2. Spara till localStorage varje gång `tips` ändras.
  //    Detta gör att listan finns kvar även om sidan laddas om.
  useEffect(() => {
    localStorage.setItem('vm_tips_data', JSON.stringify(tips));
  }, [tips]);

  // Hanterar när formuläret skickas in (klick på "Tippa!")
  async function handleSubmit(e) {
    e.preventDefault(); // Förhindra att sidan laddas om (standardbeteende för formulär)

    // Avbryt om namn eller lag saknas
    if (!namn.trim() || !lag) return;

    setStatus('loading'); // Visa att anropet pågår (t.ex. inaktivera knappen)

    try {
      // Skickar en simulerad "POST"-förfrågan till ett test-API
      // (jsonplaceholder.typicode.com används bara för att simulera ett nätverksanrop)
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ namn: namn.trim(), lag })
      });

      // Om svaret inte är OK (t.ex. status 4xx/5xx) - kasta ett fel
      if (!response.ok) throw new Error('Nätverksfel');

      setStatus('ok'); // Visa lyckad-meddelande

      // Skapa ett nytt tips-objekt att lägga till i listan
      const nyttTips = { 
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now(), // Unikt ID
        namn: namn.trim(), 
        lag: lag,
        // Formaterat datum/tid på svenska, t.ex. "14:32, 20 jul"
        skapad: new Date().toLocaleString('sv-SE', {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short'
        })
      };

      // Lägg till det nya tipset FÖRST i listan (senaste överst)
      setTips(prev => [nyttTips, ...prev]);

      // Töm formulärfälten inför nästa inmatning
      setNamn('');
      setLag('');
      
      // Dölj status-meddelandet automatiskt efter 3 sekunder
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      // Om något gick fel (t.ex. nätverksfel) - visa felmeddelande
      setStatus('error');
    }
  }

  // Tar bort ett tips från listan baserat på dess id
  function taBort(id) {
    setTips(prev => prev.filter(t => t.id !== id));
  }

  // Räkna ut statistik för topplistan (Progress Bars).
  // useMemo gör att beräkningen bara körs om när `tips` ändras,
  // istället för vid varje render.
  const topplista = useMemo(() => {
    if (tips.length === 0) return [];
    
    // Räkna hur många röster varje lag har fått
    const antal = {};
    tips.forEach(t => {
      antal[t.lag] = (antal[t.lag] || 0) + 1;
    });

    // Bygg om objektet till en array, räkna ut procent-andel per lag,
    // sortera fallande efter antal röster och behåll bara topp 3
    return Object.entries(antal)
      .map(([lagNamn, antalRoster]) => ({
        lag: lagNamn,
        roster: antalRoster,
        procent: Math.round((antalRoster / tips.length) * 100)
      }))
      .sort((a, b) => b.roster - a.roster)
      .slice(0, 3);
  }, [tips]);

  // Filtrera (sök) och sortera listan med tips innan den visas.
  const bearbetadeTips = useMemo(() => {
    let resultat = [...tips]; // Kopiera arrayen så originalet inte muteras

    // Sök: filtrera bort tips som inte matchar sökordet
    // (matchar både namn och lag, oberoende av versaler/gemener)
    const sökMönster = sok.toLowerCase().trim();
    if (sökMönster) {
      resultat = resultat.filter(t =>
        t.namn.toLowerCase().includes(sökMönster) ||
        t.lag.toLowerCase().includes(sökMönster)
      );
    }

    // Sortering enligt valt alternativ
    if (sortering === 'alfabetisk') {
      resultat.sort((a, b) => a.namn.localeCompare(b.namn)); // A-Ö efter namn
    } else if (sortering === 'aldst') {
      resultat.reverse(); // Vänder på ordningen (äldst först)
    } 
    // 'nyast' kräver ingen åtgärd - det är redan grundordningen i state
    // (eftersom nya tips läggs till först i listan)

    return resultat;
  }, [tips, sok, sortering]);

  return (
    <div className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Rubrik / Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold text-primary">⚽ VM-Tips 2026</h1>
        <p className="text-white">Lägg ditt tips på vilket land som tar hem guldet!</p>
      </div>

      {/* Formulär för att lägga in ett nytt tips */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Namn-fält */}
            <div className="col-md-5">
              <label className="form-label small fw-bold text-secondary">Ditt namn</label>
              <input
                className="form-control"
                placeholder="t.ex. Anna Svensson"
                value={namn}
                onChange={e => setNamn(e.target.value)}
                required
              />
            </div>

            {/* Val av lag (dropdown byggd från VM_LAG-listan) */}
            <div className="col-md-5">
              <label className="form-label small fw-bold text-secondary">Välj lag</label>
              <select
                className="form-select"
                value={lag}
                onChange={e => setLag(e.target.value)}
                required
              >
                <option value="">-- Välj vinnarlag --</option>
                {VM_LAG.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Skicka-knapp, inaktiveras medan anropet pågår */}
            <div className="col-md-2 d-grid align-items-end">
              <button className="btn btn-primary fw-bold" disabled={status === 'loading'}>
                {status === 'loading' ? 'Skickar...' : 'Tippa!'}
              </button>
            </div>
          </form>

          {/* Statusmeddelanden efter inskick */}
          {status === 'ok' && (
            <div className="alert alert-success mt-3 mb-0 py-2 small" role="alert">
              ✨ Ditt tips har registrerats och sparats!
            </div>
          )}
          {status === 'error' && (
            <div className="alert alert-danger mt-3 mb-0 py-2 small" role="alert">
              Något gick fel med nätverket. Försök igen.
            </div>
          )}
        </div>
      </div>

      {/* Topplista / Statistik - visas bara om det finns minst ett tips */}
      {topplista.length > 0 && (
        <div className="card shadow-sm mb-4 border-0 bg-white p-3">
          <h6 className="fw-bold mb-3 text-uppercase small text-muted">📊 Mest tippade lagen</h6>
          {topplista.map(item => (
            <div key={item.lag} className="mb-2">
              <div className="d-flex justify-content-between small mb-1">
                <span className="fw-bold">{item.lag}</span>
                {/* Singular/plural-hantering: "1 röst" vs "2 röster" */}
                <span className="text-muted">{item.roster} {item.roster === 1 ? 'röst' : 'röster'} ({item.procent}%)</span>
              </div>
              {/* Visuell progress bar baserad på procentandel */}
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-warning" 
                  role="progressbar" 
                  style={{ width: `${item.procent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sökfält och sorteringsval - visas bara om det finns tips att söka/sortera bland */}
      {tips.length > 0 && (
        <div className="row g-2 mb-3 align-items-center">
          <div className="col-md-7">
            <input
              className="form-control"
              placeholder="🔍 Sök på namn eller lag..."
              value={sok}
              onChange={e => setSok(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <select 
              className="form-select" 
              value={sortering} 
              onChange={e => setSortering(e.target.value)}
            >
              <option value="nyast">Sortera: Nyast först</option>
              <option value="aldst">Sortera: Äldst först</option>
              <option value="alfabetisk">Sortera: Namn (A-Ö)</option>
            </select>
          </div>
        </div>
      )}

      {/* Tipslista som kort (cards), byggd från bearbetadeTips (filtrerad + sorterad) */}
      <div className="row g-3">
        {bearbetadeTips.map(t => (
          <div key={t.id} className="col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1 fw-bold">{t.namn}</h6>
                  <p className="card-text text-primary mb-1">
                    Tror på: <strong>{t.lag}</strong>
                  </p>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {t.skapad ? `Inskickat ${t.skapad}` : 'Inskickat nyligen'}
                  </small>
                </div>
                {/* Knapp för att ta bort ett specifikt tips ur listan */}
                <button 
                  className="btn btn-outline-danger btn-sm border-0" 
                  onClick={() => taBort(t.id)}
                  title="Ta bort tips"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tomt tillstånd: visas när inga tips alls finns än */}
      {tips.length === 0 && (
        <div className="text-center py-5 text-muted">
          <p className="mb-0">Inga tips inskickade ännu. Bli den första att tippa!</p>
        </div>
      )}

      {/* Tomt sökresultat: visas när det finns tips, men sökningen inte gav några träffar */}
      {tips.length > 0 && bearbetadeTips.length === 0 && (
        <div className="text-center py-4 bg-white rounded shadow-sm">
          <p className="text-muted mb-2">Inga tips matchade din sökning "{sok}".</p>
          <button className="btn btn-sm btn-link" onClick={() => setSok('')}>
            Rensa sökning
          </button>
        </div>
      )}
    </div>
  );
}

// Renderar App-komponenten i elementet med id "root"
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
