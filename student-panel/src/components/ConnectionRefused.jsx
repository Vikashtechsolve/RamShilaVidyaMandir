export default function ConnectionRefused({ onRetry }) {
  return (
    <div className="connection-refused">
      <div className="connection-refused-icon">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 12L12 36L36 60L60 36L36 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 30L42 42M42 30L30 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h1 className="connection-refused-title">This site can&apos;t be reached</h1>
      <p className="connection-refused-subtitle">localhost refused to connect.</p>
      <div className="connection-refused-try">
        <p>Try:</p>
        <ul>
          <li>Checking the connection</li>
          <li>Checking the proxy and the firewall</li>
          <li>Running the backend: <code>cd backend && npm start</code></li>
          <li>Running the student panel: <code>cd student-panel && npm run dev</code></li>
        </ul>
      </div>
      <p className="connection-refused-code">ERR_CONNECTION_REFUSED</p>
      <div className="connection-refused-actions">
        <button type="button" className="connection-refused-reload" onClick={onRetry}>
          Reload
        </button>
        <button type="button" className="connection-refused-details" onClick={onRetry}>
          Details
        </button>
      </div>
    </div>
  )
}
