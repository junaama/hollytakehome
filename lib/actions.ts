'use server'

import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'
import { JobContext, MatchResult } from '@/lib/types'
import { getSalaryGrades } from '@/lib/data'
import { parseQuery } from '@/lib/parser'
import { getBestMatch } from '@/lib/matching'

// Use Groq (free) if GROQ_API_KEY is set, otherwise use Google
const getModel = () => {
    if (process.env.GROQ_API_KEY) {
        return groq('llama-3.3-70b-versatile')
    }
    return google('gemini-2.0-flash')
}

const buildContext = (match: MatchResult | null): JobContext | null => {
    if (!match) return null

    const { job, salary } = match

    return {
        title: job.title,
        jurisdiction: job.jurisdiction,
        code: job.code,
        description: job.description,
        salaryGrades: salary ? getSalaryGrades(salary) : []
    }
}

export const generateChatResponse = async (query: string): Promise<string> => {
    const parsed = parseQuery(query)

    const match = getBestMatch(parsed)

    if (!match) {
        return "I couldn't find a job matching your query. Please try specifying the job title and jurisdiction (e.g., 'Assistant Sheriff in San Diego County')."
    }

    const context = buildContext(match)

    if (!context) {
        return "I found a matching job but couldn't retrieve its details. Please try again."
    }

    const salaryInfo = context.salaryGrades.length > 0
        ? context.salaryGrades.map(g => `Grade ${g.grade}: ${g.amount}`).join(', ')
        : 'No salary information available'

    const systemPrompt = `You are an HR assistant helping users find information about job positions. Answer questions only on the provided job information. Be concise and helpful. If asked about something not in the provided data, say you don't have that information.`

    const contextPrompt = ` JOB INFORMATION: Title: ${context.title} Jurisdiction: ${context.jurisdiction} Job Code: ${context.code} Salary: ${salaryInfo} Full Description: ${context.description} `

    const userPrompt = `Based on the job information above, please answer this question: ${query}`

    try {
        const { text } = await generateText({
            model: getModel(),
            system: systemPrompt,
            prompt: contextPrompt + '\n\n' + userPrompt,
        })

        return text
    } catch (error) {
        console.error('Error generating response:', error)
        return 'Sorry, there was an error generating a response. Please try again.'
    }
}
