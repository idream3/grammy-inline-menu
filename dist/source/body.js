import { hasTruthyKey, isObject } from './generic-types.js';
export const MEDIA_TYPES = [
    'animation',
    'audio',
    'document',
    'photo',
    'video',
];
function isKnownMediaType(type) {
    if (typeof type !== 'string') {
        return false;
    }
    return MEDIA_TYPES.includes(type);
}
export function isTextBody(body) {
    if (!body) {
        return false;
    }
    if (typeof body === 'string') {
        return true;
    }
    if (!isObject(body)) {
        return false;
    }
    if (body['type'] !== undefined) {
        return false;
    }
    if (body['location'] !== undefined) {
        return false;
    }
    if (body['venue'] !== undefined) {
        return false;
    }
    if (body['invoice'] !== undefined) {
        return false;
    }
    return hasTruthyKey(body, 'text');
}
export function isMediaBody(body) {
    if (!isObject(body)) {
        return false;
    }
    if (!isKnownMediaType(body['type'])) {
        return false;
    }
    return hasTruthyKey(body, 'media');
}
function isValidLocation(location) {
    return typeof location.latitude === 'number'
        && typeof location.longitude === 'number';
}
export function isLocationBody(body) {
    if (!hasTruthyKey(body, 'location')) {
        return false;
    }
    // Locations can't have text
    if (hasTruthyKey(body, 'text')) {
        return false;
    }
    const { location } = body;
    return isValidLocation(location);
}
export function isVenueBody(body) {
    if (!hasTruthyKey(body, 'venue')) {
        return false;
    }
    // Locations can't have text
    if (hasTruthyKey(body, 'text')) {
        return false;
    }
    const { venue } = body;
    if (!isValidLocation(venue.location)) {
        return false;
    }
    return typeof venue.title === 'string' && typeof venue.address === 'string';
}
export function isInvoiceBody(body) {
    if (!hasTruthyKey(body, 'invoice')) {
        return false;
    }
    // Invoices can't have text
    if (hasTruthyKey(body, 'text')) {
        return false;
    }
    const { invoice } = body;
    return typeof invoice.title === 'string'
        && typeof invoice.description === 'string';
}
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export function getBodyText(body) {
    return typeof body === 'string' ? body : body.text;
}
//# sourceMappingURL=body.js.map