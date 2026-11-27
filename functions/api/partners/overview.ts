interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
  MBUNIFX_ADMIN_USER_ID: string;
  DERIV_PARTNER_ACCESS_TOKEN: string;
  DERIV_APP_ID?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const authorization = request.headers.get("Authorization") || "";
  const accessToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!accessToken) return json({ error: "Sign in required." }, 401);
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      !env.MBUNIFX_ADMIN_USER_ID || !env.DERIV_PARTNER_ACCESS_TOKEN) {
    return json({ error: "Partner integration is not configured." }, 503);
  }

  const userResponse = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!userResponse.ok) return json({ error: "Your MBUNIFX session is invalid." }, 401);
  const user = await userResponse.json() as { id?: string };
  if (!user.id || user.id !== env.MBUNIFX_ADMIN_USER_ID) {
    return json({ error: "Admin access required." }, 403);
  }

  const url = new URL(request.url);
  const endDate = url.searchParams.get("end_date") || new Date().toISOString().slice(0, 10);
  const startDate = url.searchParams.get("start_date") ||
    new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value));
  if (!validDate(startDate) || !validDate(endDate) || startDate > endDate ||
      (Date.parse(endDate) - Date.parse(startDate)) / 86400000 > 730) {
    return json({ error: "Use valid dates; the reporting range must be 730 days or less." }, 400);
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${env.DERIV_PARTNER_ACCESS_TOKEN}`,
    Accept: "application/json",
  };
  if (env.DERIV_APP_ID) headers["Deriv-App-ID"] = env.DERIV_APP_ID;

  const response = await fetch(
    `https://api.derivws.com/partners/analytics/v1/overview?start_date=${startDate}&end_date=${endDate}`,
    { headers },
  );
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return json({ error: "Deriv Partners API request failed.", upstream_status: response.status, details: payload }, response.status);
  }
  return json({ source: "Deriv Partners API", start_date: startDate, end_date: endDate, data: payload });
};
