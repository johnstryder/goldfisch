import axios from 'axios'

export type SendEmailParams = {
    to: string | string[]
    subject: string
    html: string
    text?: string
    fromEmail?: string
    fromName?: string
}

export type SendEmailResult = {
    success: boolean
    status?: number
    error?: string
}

const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send'

function getSendgridApiKey(): string {
    const apiKey = process.env.SENDGRID_API_KEY
    if (!apiKey) {
        throw new Error('SENDGRID_API_KEY is not set. Add it to your backend environment.')
    }
    return apiKey
}

function normalizeRecipients(to: string | string[]): Array<{ email: string }> {
    const list = Array.isArray(to) ? to : [to]
    return list.filter(Boolean).map(email => ({ email }))
}

export async function sendEmailViaSendgrid(params: SendEmailParams): Promise<SendEmailResult> {
    const { to, subject, html, text, fromEmail, fromName } = params

    try {
        const apiKey = getSendgridApiKey()
        const fromAddress = fromEmail || process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com'
        const fromDisplayName = fromName || process.env.SENDGRID_FROM_NAME || 'Tezzemplate'

        const payload: any = {
            personalizations: [
                {
                    to: normalizeRecipients(to),
                    subject,
                },
            ],
            from: { email: fromAddress, name: fromDisplayName },
            content: [
                ...(text ? [{ type: 'text/plain', value: text }] : []),
                { type: 'text/html', value: html },
            ],
        }

        const response = await axios.post(SENDGRID_API_URL, payload, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            // sendgrid returns 202 for accepted
            validateStatus: () => true,
        })

        if (response.status >= 200 && response.status < 300) {
            return { success: true, status: response.status }
        }
        return {
            success: false,
            status: response.status,
            error: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
        }
    } catch (error: any) {
        return {
            success: false,
            error: error?.response?.data ? JSON.stringify(error.response.data) : error.message || 'unknown error',
        }
    }
}

export type TemplateKey = 'welcome'

function buildWelcomeHtml(userName: string): string {
    const safeName = String(userName || 'User')
    return `<!doctype html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><title>welcome</title></head><body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px"><table width="100%" align="center" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; margin:0 auto; background:#ffffff; padding:24px; border-radius:8px"><tr><td><h1 style="margin:0 0 12px; color:#111">welcome, ${safeName}!</h1><p style="margin:0 0 12px; color:#444; font-size:16px">we're stoked to have you on board.</p><p style="margin:0 0 20px; color:#444; font-size:16px">hit the button to get started.</p><p><a href="#" style="background:#111; color:#fff; padding:10px 16px; text-decoration:none; border-radius:6px; display:inline-block">get started</a></p><p style="margin:24px 0 0; color:#777; font-size:12px">© ${new Date().getFullYear()} tezzemplate</p></td></tr></table></body></html>`
}

export function renderEmailTemplate(template: TemplateKey, data: Record<string, any> = {}): { subject: string; html: string } {
    if (template === 'welcome') {
        const { userName = 'User' } = data
        return { subject: 'welcome to tezzemplate', html: buildWelcomeHtml(userName) }
    }
    throw new Error(`unknown email template: ${template}`)
}

export async function sendTemplateEmail(params: {
    to: string | string[]
    template: TemplateKey
    data?: Record<string, any>
    subjectOverride?: string
    fromEmail?: string
    fromName?: string
}): Promise<SendEmailResult> {
    const { to, template, data, subjectOverride, fromEmail, fromName } = params
    const { subject, html } = renderEmailTemplate(template, data)
    return sendEmailViaSendgrid({
        to,
        subject: subjectOverride || subject,
        html,
        fromEmail,
        fromName,
    })
}