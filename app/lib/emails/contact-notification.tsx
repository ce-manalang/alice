interface ContactNotificationEmailProps {
  name: string
  email: string
  message: string
}

export function ContactNotificationEmail({ name, email, message }: ContactNotificationEmailProps) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        New Contact Request
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        A visitor submitted the portfolio contact form.
      </p>

      <table style={{ borderCollapse: 'collapse', marginBottom: '1.5rem', width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ padding: '0.25rem 0.75rem 0.25rem 0', fontWeight: 500, width: '120px' }}>Name</td>
            <td style={{ padding: '0.25rem 0' }}>{name}</td>
          </tr>
          <tr>
            <td style={{ padding: '0.25rem 0.75rem 0.25rem 0', fontWeight: 500 }}>Email</td>
            <td style={{ padding: '0.25rem 0' }}>
              <a href={`mailto:${email}`}>{email}</a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Message</h2>
      <div
        style={{
          whiteSpace: 'pre-wrap',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1rem',
          lineHeight: 1.5,
        }}
      >
        {message}
      </div>
    </div>
  )
}
