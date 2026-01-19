import jobDescriptionsData from '@/data/job-descriptions.json'
import salariesData from '@/data/salaries.json'
import { JobDescription, Salary } from '@/lib/types'

type JurisdictionName = {
    [key: string]: string
}

export const JURISDICTION_ALIASES: JurisdictionName = {
    'san bernardino': 'sanbernardino',
    'san bernardino county': 'sanbernardino',
    'sanbernardino': 'sanbernardino',
    'ventura': 'ventura',
    'ventura county': 'ventura',
    'san diego': 'sdcounty',
    'san diego county': 'sdcounty',
    'sdcounty': 'sdcounty',
    'sd county': 'sdcounty',
    'kern': 'kerncounty',
    'kern county': 'kerncounty',
    'kerncounty': 'kerncounty',
}

export const getJobDescriptions = (): JobDescription[] => {
    return jobDescriptionsData as JobDescription[]
}

export const getSalaries = (): Salary[] => {
    return salariesData as Salary[]
}

export const findSalaryForJob = (jurisdiction: string, jobCode: string): Salary | null => {
    const salaries = getSalaries()
    return salaries.find(
        s => s.Jurisdiction.toLowerCase() === jurisdiction.toLowerCase() &&
            s['Job Code'] === jobCode
    ) || null
}

export const findSalaryByJobCode = (jobCode: string): Salary | null => {
    const salaries = getSalaries()
    return salaries.find(s => s['Job Code'] === jobCode) || null
}

export const normalizeJurisdiction = (input: string): string | null => {
    const normalized = input.toLowerCase().trim()
    return JURISDICTION_ALIASES[normalized] || null
}

export const getSalaryGrades = (salary: Salary): { grade: number; amount: string }[] => {
    const grades: { grade: number; amount: string }[] = []

    for (let i = 1; i <= 14; i++) {

        const key = `Salary grade ${i}` as keyof Salary
        const amount = salary[key]

        if (amount) {
            grades.push({ grade: i, amount: amount.trim() })
        }
    }
    return grades
}
