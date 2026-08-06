export function TrustBar() {
  return (
    <>
      <section className="trust" aria-label="Güven göstergeleri">
        <div className="wrap trust-in">
          <div className="trust-item">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path d="M12 3l8 4v5c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V7l8-4z" /></svg>
            Yalnızca SPK lisanslı kurum yayınları
          </div>
          <div className="trust-item">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5" /></svg>
            Her önerinin kaynak belgesi açık
          </div>
          <div className="trust-item">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path d="M12 3l8 4v5c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V7l8-4z" opacity=".25" /><path d="M4 8V6a2 2 0 012-2h2" /><path d="M20 16v2a2 2 0 01-2 2h-2" /><path d="M9 12l2 2 4-4" /></svg>
            Karne geriye dönük değiştirilemez
          </div>
          <div className="trust-item">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            Her gün 18:30'da doğrulanmış karne
          </div>
        </div>
      </section>
    </>
  );
}
