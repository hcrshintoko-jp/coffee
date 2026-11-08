const ENDPOINT = 'https://workshop.hasabacoffee.com/api/offsite-inquiries';
const MAX_BYTES = 32 * 1024;

// Allow both server-side checks (10 seconds each) to finish before giving up.
export function createInquirySender({ endpoint, fetchImpl = fetch, timeoutMs = 25_000 }) {
  if (endpoint !== ENDPOINT) throw new TypeError('Invalid inquiry endpoint');
  const attempts = new Map();
  let locked;
  const invalid = (requestId, fieldErrors) => ({ kind: 'invalid', requestId, fieldErrors, errorMessage: '入力内容をご確認ください。' });
  return async function submit(payload) {
    if (locked) return locked;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return invalid(undefined, { form: '入力形式を確認してください。' });
    const { requestId, turnstileToken } = payload;
    if (typeof requestId !== 'string' || !requestId || typeof turnstileToken !== 'string' || !turnstileToken) return invalid(requestId, { form: '受付番号と送信前の認証を確認してください。' });
    let body, fingerprint;
    try {
      body = JSON.stringify(payload);
      fingerprint = JSON.stringify(Object.fromEntries(Object.entries(payload).filter(([key]) => key !== 'turnstileToken').sort(([a], [b]) => a.localeCompare(b))));
    } catch { return invalid(requestId, { form: '入力形式を確認してください。' }); }
    if (new TextEncoder().encode(body).byteLength > MAX_BYTES) return invalid(requestId, { form: '入力内容が長すぎます。短くしてからご確認ください。' });
    const previous = attempts.get(requestId);
    if (previous) {
      if (previous.fingerprint !== fingerprint) return invalid(requestId, { requestId: '修正内容の新しい受付番号を発行してください。' });
      if (!previous.result || previous.result.kind !== 'not_sent' || previous.token === turnstileToken) return previous.promise;
    }
    const attempt = { fingerprint, token: turnstileToken, result: null, promise: null };
    attempt.promise = (async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const unknown = () => locked ||= { kind: 'unknown', requestId, errorCode: 'DELIVERY_UNCONFIRMED', errorMessage: '送信結果を確認できません。重複を避けるため再送せず、受付番号を控えて店舗へお問い合わせください。' };
      try {
        const response = await fetchImpl(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, credentials: 'omit', cache: 'no-store', redirect: 'error', signal: controller.signal });
        const result = await response.json();
        if (controller.signal.aborted || result?.errorCode === 'DELIVERY_UNCONFIRMED') return unknown();
        if (response.status === 202 && result?.ok === true && result.status === 'submitted' && result.requestId === requestId) {
          return { kind: 'success', requestId, receivedAt: result.receivedAt, errorMessage: '申請を受け付けました。開催確定ではありません。担当者からの連絡をお待ちください。' };
        }
        if (response.status === 400 && result?.ok === false && result.errorCode === 'VALIDATION_ERROR' && result.fieldErrors && typeof result.fieldErrors === 'object' && !Array.isArray(result.fieldErrors) && Object.keys(result.fieldErrors).length > 0 && Object.values(result.fieldErrors).every(value => typeof value === 'string' && value.length > 0)) return invalid(requestId, result.fieldErrors);
        if (result?.ok === false && ((response.status === 503 && ['UNAVAILABLE', 'TURNSTILE_UNAVAILABLE'].includes(result.errorCode)) || (response.status === 403 && result.errorCode === 'TURNSTILE_REJECTED'))) {
          return { kind: 'not_sent', requestId, errorCode: result.errorCode, errorMessage: 'メールは送信されていません。受付状況と送信前の認証をご確認ください。' };
        }
        return unknown();
      } catch { return unknown(); }
      finally { clearTimeout(timer); }
    })().then((result) => (attempt.result = result));
    attempts.set(requestId, attempt);
    return attempt.promise;
  };
}
