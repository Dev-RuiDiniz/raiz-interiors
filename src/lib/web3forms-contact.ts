type ContactSubmission = {
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  locale?: string
  source?: string
}

export interface SendWeb3FormsResult {
  success: boolean
  message: string
}

const WEB3FORMS_URL = 'https://api.web3forms.com/submit'
const DEFAULT_SUCCESS_MESSAGE = 'Email enviado com sucesso.'

const safeJsonParse = async (response: Response) => {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function submitContactToWeb3Forms(submission: ContactSubmission): Promise<SendWeb3FormsResult> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim()

  if (!accessKey) {
    return {
      success: false,
      message: 'NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY não configurada.',
    }
  }

  const response = await fetch(WEB3FORMS_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      from_name: 'RAIZ Interiors',
      replyto: submission.email,
      email: submission.email,
      subject: `RAIZ Interiors — ${submission.subject}`,
      name: submission.name,
      phone: submission.phone || '',
      message: submission.message,
      locale: submission.locale,
      source: submission.source,
      botcheck: false,
    }),
  })

  const payload = await safeJsonParse(response)
  const message =
    payload?.body?.message ||
    payload?.message ||
    payload?.error ||
    response.statusText ||
    'unknown error'

  if (!response.ok || payload?.success === false) {
    return {
      success: false,
      message: `Falha ao enviar via Web3Forms (${response.status}): ${message}`,
    }
  }

  return {
    success: true,
    message: payload?.body?.message || DEFAULT_SUCCESS_MESSAGE,
  }
}
