export function okResponse(data: any, extra: any = {}) {
    return { ok: true, data, ...extra };
}
