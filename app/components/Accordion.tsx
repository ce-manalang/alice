interface AccordionProps {
  question: string
  answer: string
}

export default function Accordion({ question, answer }: AccordionProps) {
  return (
    <details
      style={{
        borderBottom: '1px solid #e5e7eb',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <summary
        style={{
          padding: '1rem 0',
          cursor: 'pointer',
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: '#111111',
          listStyle: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        {question}
        <span
          style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            flexShrink: 0,
            marginLeft: '1rem',
            transition: 'transform 0.2s',
          }}
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div
        style={{
          paddingBottom: '1rem',
          fontSize: '0.9375rem',
          color: '#374151',
          lineHeight: 1.65,
        }}
      >
        {answer}
      </div>
    </details>
  )
}
