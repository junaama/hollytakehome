import { MatchResult, ParsedQuery } from './types'
import { getJobDescriptions, findSalaryForJob, findSalaryByJobCode } from './data'
import { tokenize } from './parser'

const calculateTokenScore = (queryTokens: string[], titleTokens: string[]): number => {
    if (titleTokens.length === 0) return 0

    let matches = 0
    for (const queryToken of queryTokens) {
        for (const titleToken of titleTokens) {
            if (titleToken.includes(queryToken) || queryToken.includes(titleToken)) {
                matches++
                break
            }
        }
    }

    return matches / titleTokens.length
}

export const findMatchingJobs = (parsed: ParsedQuery): MatchResult[] => {
    const jobs = getJobDescriptions()
    const results: MatchResult[] = []

    for (const job of jobs) {
        let score = 0

        if (parsed.jurisdiction) {
            if (job.jurisdiction.toLowerCase() !== parsed.jurisdiction.toLowerCase()) {
                continue
            }
            score += 0.3
        }

        if (parsed.jobCode && job.code === parsed.jobCode) {
            score = 1.0
        } else {
            const titleTokens = tokenize(job.title)
            const tokenScore = calculateTokenScore(parsed.tokens, titleTokens)
            score += tokenScore * 0.7
        }

        if (score > 0.2) {
            let salary = findSalaryForJob(job.jurisdiction, job.code)
            if (!salary && parsed.jobCode) {
                salary = findSalaryByJobCode(parsed.jobCode)
            }
            results.push({ job, salary, score })
        }
    }

    results.sort((a, b) => b.score - a.score)

    return results
}

export const getBestMatch = (parsed: ParsedQuery): MatchResult | null => {
    const matches = findMatchingJobs(parsed)
    if (matches.length === 0) return null

    const best = matches[0]
    if (best.score >= 0.3) {
        return best
    }

    return null
}
