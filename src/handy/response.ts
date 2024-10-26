export function ok(data: any, extra: any = {}) {
    return { ok: true, data, ...extra };
}