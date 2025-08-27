export const DATOCMS_API_URL = "https://graphql.datocms.com/"

interface DatocmsGraphQLError {
  message: string
}

interface DatocmsGraphQLResponse<T> {
  data?: T
  errors?: DatocmsGraphQLError[]
}

export async function datocmsRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const token = process.env.DATOCMS_API_TOKEN
  if (!token) {
    throw new Error(
      "Missing DATOCMS_API_TOKEN. Add it to your .env.local file as DATOCMS_API_TOKEN=...",
    )
  }

  const response = await fetch(DATOCMS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // Revalidate periodically to keep content fresh
    next: { revalidate: 60 },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`DatoCMS request failed: ${response.status} ${text}`)
  }

  const json = (await response.json()) as DatocmsGraphQLResponse<T>

  if (json.errors && json.errors.length > 0) {
    throw new Error(`DatoCMS GraphQL errors: ${json.errors.map((e) => e.message).join(" | ")}`)
  }

  if (!json.data) {
    throw new Error("DatoCMS response missing data")
  }

  return json.data
}


