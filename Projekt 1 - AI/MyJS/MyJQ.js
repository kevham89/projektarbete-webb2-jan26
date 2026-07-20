const { useState, useMemo } = React;
function App() {
  const [namn, setNamn] = useState('');
  const [lag, setLag] = useState('');
  const [tips, setTips] = useState([]);
  const [status, setStatus] = useState(null);   // null | 'loading' | 'ok' | 'error'
  const [sok, setSok] = useState('');           // sökfält för filtrering

  function handleSubmit(e) {
    e.preventDefault();
    if (!namn.trim() || !lag.trim()) return;

    setStatus('loading');

    $.ajax({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'POST',
      data: { namn, lag }
    })
    .done(function (response) {
      setStatus('ok');
      const nyttTips = { id: response.id, namn: namn.trim(), lag: lag.trim() };
      setTips(prev => [nyttTips, ...prev]);
      setNamn('');
      setLag('');
    })
    .fail(function () {
      setStatus('error');
    });
  }

  function taBort(id) {
    setTips(prev => prev.filter(t => t.id !== id));
  }

  // Filtrera listan baserat på sökfältet (körs om vid varje render, cachas med useMemo)
  const filtreradeTips = useMemo(() => {
    return tips.filter(t =>
      t.namn.toLowerCase().includes(sok.toLowerCase()) ||
      t.lag.toLowerCase().includes(sok.toLowerCase())
    );
  }, [tips, sok]);

  // Räkna ut vilket lag som fått flest tips
  const popularaste = useMemo(() => {
    if (tips.length === 0) return null;
    const antal = {};
    tips.forEach(t => { antal[t.lag] = (antal[t.lag] || 0) + 1; });
    return Object.entries(antal).sort((a, b) => b[1] - a[1])[0];
  }, [tips]);

  return (
    <div>
      <h1 className="mb-1">⚽ VM-tips</h1>
      <p className="text-muted mb-4">Skriv in namn och vilket lag du tror vinner VM.</p>

      <form onSubmit={handleSubmit} className="row g-2 mb-3">
        <div className="col-md-5">
          <input className="form-control" placeholder="Namn" value={namn}
                 onChange={e => setNamn(e.target.value)} required />
        </div>
        <div className="col-md-5">
          <input className="form-control" placeholder="Lag" value={lag}
                 onChange={e => setLag(e.target.value)} required />
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? '...' : 'Skicka'}
          </button>
        </div>
      </form>

      {status === 'ok' && <p className="text-success small">Tips skickat!</p>}
      {status === 'error' && <p className="text-danger small">Något gick fel, försök igen.</p>}

      {tips.length > 0 && (
        <input className="form-control form-control-sm mb-3" placeholder="Sök på namn eller lag..."
               value={sok} onChange={e => setSok(e.target.value)} />
      )}

      {popularaste && (
        <p className="small text-muted">
          Mest tippade lag just nu: <strong>{popularaste[0]}</strong> ({popularaste[1]} röster)
        </p>
      )}

      <ul className="list-group">
        {filtreradeTips.map(t => (
          <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>{t.namn}</strong> tror på <em>{t.lag}</em></span>
            <button className="btn btn-sm btn-outline-danger" onClick={() => taBort(t.id)}>
              Ta bort
            </button>
          </li>
        ))}
      </ul>

      {tips.length === 0 && <p className="text-muted small">Inga tips inskickade ännu.</p>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);