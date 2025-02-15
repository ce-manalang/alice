export function LoadingSkeleton() {
  return (
    <div className="loading-skeleton">
      <div className="loading-content">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="loading-item">
            {i % 3 === 0 && <div></div>}
            <div className="loading-line" style={{ width: `${Math.random() * 30 + 70}%` }}></div>
            <div className="loading-line" style={{ width: `${Math.random() * 40 + 50}%` }}></div>
            <div className="loading-line" style={{ width: `${Math.random() * 60 + 30}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

