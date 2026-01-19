# Holly Take Home

## Overview

This is a simple chat allowing users to query jobs and salary information built with Next.JS, Typescript and using Google Gemini AI model or Groq free tier llama model!

## Instructions

1. Clone this repository to your local machine
2. Install dependencies
` bun install `
3. Set your environment variables
` cp env.example .env.local `
4. Start the development server `bun dev`

## How to get your Gemini or Groq API keys
1. Google gemini -> Get yours at https://aistudio.google.com/app/api-keys 
2. Groq -> Get one at https://console.groq.com/keys

## Process

### Approach

1. From the requirement to pass in external data before having the LLM process the user's query I looked into RAG ( Retrieval Augmented Generation ), a process that enchances LLM responses from prompts by attaching relevant external data.
2. The restriction against fuzzy matching made me decide to look into more traditional rule based matching/parsers based on the keyvalues from the given data.
3. Most of the RAG tutorials / resources were overkill for this task
4. Flow chart I decided on was User query -> Parser -> Match to jobs -> Format and build context -> Generate LLM response -> Return
5. Chose Google Gemini as LLM because I have access to it and also Groq as fallback using their free tier



### Challenges

1. Key areas of inconsistent data format I needed to normalize like the extra whitespace in salary grades
2. I contemplated using an LLM call to for the matching + parsing but since it's a small dataset opted for creating jurisdiction maps, token based scoring, etc
3. Handling ambiguous queries
4. Jurisdiction mapping was an edge case as 'sdcounty' appeared as a jurisdiction with 'San Diego' mentioned in the description but the same wasn't true for 'sanbernardino'
5. Handling Job codes not matching with job titles such as 0265 job code being for 'kerncounty' jurisdiction but 0265 job code being marked for 'sdcounty' in job descriptions. Originally failed the query test case: `What are the salaries for 0265 jobs?` then I adjusted to try exact job match first, then fallback to job code 


### Where I used AI

1. Copilot / Autocomplete while coding
2. Searching/resource gathering for best solution

### Next steps

1. Currently this doesn't support context loading or memory management so user query cannot reference previous queries.
2. Currently queries about multiple roles only output information on one role so I would adjust getBestMatch to also return top 3 matches and adjust building the context beforre passing to the LLM

## File structure

- /lib
   - types.ts -> Added Typescript types for jobs, salaries, parsed queries, and match results.

   - data.ts -> Load and preprocess JSON data (normalize jurisdictions, clean salaries)

   - parser.ts -> Rule-based query parser

   - matching.ts -> Token-based scoring algorithm (no fuzzy libraries)

   - actions.ts -> Single server action function generateResponse(query, context)

- /app/chat/
   - page.tsx -> Created simple UI for users to view their messages on the right and LLM messages on the left, and input form

### Resources
- https://redis.io/blog/what-is-fuzzy-matching/
- https://medium.com/@dinabavli/rag-basics-basic-implementation-of-retrieval-augmented-generation-rag-e80e0791159d
- https://nextjs.org/docs/13/app/building-your-application/data-fetching/server-actions-and-mutations
- https://ai-sdk.dev/cookbook/guides/rag-chatbot
