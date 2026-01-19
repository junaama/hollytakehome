import { ParsedQuery } from './types'
import { JURISDICTION_ALIASES, normalizeJurisdiction } from './data'

const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
    'am', 'it', 'its', 'as', 'if', 'their', 'there', 'then', 'than',
    'position', 'job', 'role', 'tell', 'me', 'about', 'know', 'please',
    'salary', 'pay', 'compensation', 'skills', 'abilities', 'knowledge',
    'requirements', 'duties', 'responsibilities', 'description'
])

export const tokenize = (text: string): string[] => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 1 && !STOP_WORDS.has(word))
}

const extractJobCode = (query: string): string | null => {
    const match = query.match(/\b(\d{4,5})\b/)
    return match ? match[1] : null
}

const extractJurisdiction = (query: string): string | null => {
    const lowerQuery = query.toLowerCase()

    for (const alias of Object.keys(JURISDICTION_ALIASES)) {
        if (lowerQuery.includes(alias)) {
            return normalizeJurisdiction(alias)
        }
    }
    return null
}

export const parseQuery = (query: string): ParsedQuery => {
    const jobCode = extractJobCode(query)
    const jurisdiction = extractJurisdiction(query)
    const tokens = tokenize(query)

    return {
        jurisdiction,
        jobTitle: null,
        jobCode,
        tokens
    }
}
