# Architecture Diagram

This diagram explains the flow of the AI-Powered Frontend Cloning Agent.

## Flow of Execution

```mermaid
flowchart TD
    A[User] -->|Inputs Website URL| B(Agent Dashboard UI\nNext.js)
    
    subgraph Agent Backend
    B -->|API POST /analyze| C{Puppeteer headless browser}
    C -->|Captures Screenshot & DOM| D[LLM Vision API\ne.g., GPT-4o]
    end
    
    subgraph Sandbox Environment
    D -->|Generates React/Tailwind Code| E(FileSystem writes to\n`generated-site/app/page.tsx`)
    E -->|Triggers Hot Reload| F[Next.js Dev Server\nPort 3001]
    end
    
    F -->|Displays Preview| B
    
    subgraph Validation Loop
    F --Build Error (stderr)--> G[Agent Process Monitor]
    G --Feeds Error to--> D
    D --Generates Fix--> E
    end

    A -->|Natural Language Prompt\n'Change color to blue'| H(API POST /modify)
    H --Current Code + Prompt--> D
```

## System Components

1. **Agent App (`agent/`)**: The control center. Provides a UI for the user to input URLs and prompts. Contains server-side API routes to control the browser and interface with the LLM.
2. **Sandbox (`generated-site/`)**: A clean Next.js app serving as the target environment. The Agent writes files directly to this directory.
3. **Puppeteer**: Used for visually analyzing the target URL.
4. **LLM**: The core intelligence taking visual and textual context to synthesize a new React frontend.
