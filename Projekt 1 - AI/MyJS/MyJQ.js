const { useState, useEffect, useMemo } = React;

// Lista över kvalificerade / populära VM-nationer
const VM_LAG = [
  'Argentina', 'Brasilien', 'England', 'Frankrike', 'Italien', 
  'Kroatien', 'Marocko', 'Nederländerna', 'Portugal', 'Spanien', 
  'Sverige', 'Tyskland', 'Uruguay', 'USA'
].sort();

function App() {
  const [namn, setNamn] = useState('');
  const [lag, setLag] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'ok' | 'error'
  const [sok, setSok] = useState('');
  const [sortering, setSortering] = useState('nyast');

  // 1. Läs in sparade tips från localStorage när appen startar
  const [tips, setTips] = useState(() => {
    try {
      const sparade = localStorage.getItem('vm_tips_data');
      return sparade ? JSON.parse(sparade) : [];
    } catch (e) {
      return [];
    }
  });

  // 2. Spara till localStorage varje gång `tips` ändras
  useEffect(() => {
    localStorage.setItem('vm_tips_data', JSON.stringify(tips));
  }, [tips]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!namn.trim() || !lag) return;

    setStatus('loading');

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ namn: namn.trim(), lag })
      });

      if (!response.ok) throw new Error('Nätverksfel');

      setStatus('ok');
      
      const nyttTips = { 
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now(), 
        namn: namn.trim(), 
        lag: lag,
        skapad: new Date().toLocaleString('sv-SE', {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short'
        })
      };

      setTips(prev => [nyttTips, ...prev]);
      setNamn('');
      setLag('');
      
      setTimeout(() => setStatus(null), 3000); // Dölj status efter 3 sek
    } catch (err) {
      setStatus('error');
    }
  }

  function taBort(id) {
    setTips(prev => prev.filter(t => t.id !== id));
  }

  // Räkna ut statistik för topplistan (Progress Bars)
  const topplista = useMemo(() => {
    if (tips.length === 0) return [];
    
    const antal = {};
    tips.forEach(t => {
      antal[t.lag] = (antal[t.lag] || 0) + 1;
    });

    return Object.entries(antal)
      .map(([lagNamn, antalRoster]) => ({
        lag: lagNamn,
        roster: antalRoster,
        procent: Math.round((antalRoster / tips.length) * 100)
      }))
      .sort((a, b) => b.roster - a.roster)
      .slice(0, 3); // Visa topp 3
  }, [tips]);

  // Filtrera och sortera listan
  const bearbetadeTips = useMemo(() => {
    let resultat = [...tips];

    // Sök
    const sökMönster = sok.toLowerCase().trim();
    if (sökMönster) {
      resultat = resultat.filter(t =>
        t.namn.toLowerCase().includes(sökMönster) ||
        t.lag.toLowerCase().includes(sökMönster)
      );
    }

    // Sortering
    if (sortering === 'alfabetisk') {
      resultat.sort((a, b) => a.namn.localeCompare(b.namn));
    } else if (sortering === 'aldst') {
      resultat.reverse();
    } // 'nyast' är standard-ordningen i vårt state

    return resultat;
  }, [tips, sok, sortering]);

  return (
    <div className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold text-primary">⚽ VM-Tips 2026</h1>
        <p className="text-muted">Lägg ditt tips på vilket land som tar hem guldet!</p>
      </div>

      {/* Formulär */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} className="row g-3">
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
            <div className="col-md-2 d-grid align-items-end">
              <button className="btn btn-primary fw-bold" disabled={status === 'loading'}>
                {status === 'loading' ? 'Skickar...' : 'Tippa!'}
              </button>
            </div>
          </form>

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

      {/* Topplista / Statistik */}
      {topplista.length > 0 && (
        <div className="card shadow-sm mb-4 border-0 bg-white p-3">
          <h6 className="fw-bold mb-3 text-uppercase small text-muted">📊 Mest tippade lagen</h6>
          {topplista.map(item => (
            <div key={item.lag} className="mb-2">
              <div className="d-flex justify-content-between small mb-1">
                <span className="fw-bold">{item.lag}</span>
                <span className="text-muted">{item.roster} {item.roster === 1 ? 'röst' : 'röster'} ({item.procent}%)</span>
              </div>
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

      {/* Sökning & Sortering */}
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

      {/* Tipslista (Cards) */}
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

      {/* Tomma tillstånd */}
      {tips.length === 0 && (
        <div className="text-center py-5 text-muted">
          <p className="mb-0">Inga tips inskickade ännu. Bli den första att tippa!</p>
        </div>
      )}

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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);