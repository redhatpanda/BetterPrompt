# BetterPrompt Extension

This project is an extension using Azure Functions and JavaScript. It consists of a backend service that processes speech and text using various Azure AI services and a frontend web application.

# Project Overview
 
## 📌 Overview
 
**BetterPrompt** is a smart Chrome extension built to enhance digital communication by making user input clearer, more concise, and contextually accurate—whether you're typing, speaking, or on the move. Designed for ease of use and accessibility, BetterPrompt empowers users from all backgrounds, including non-native speakers and individuals with writing disabilities, to communicate more effectively across any website.
 
Built with **React** and **Material-UI (MUI)** for a sleek, responsive interface, and powered by **Azure Cognitive Services**, the extension provides real-time grammar correction, translation, speech-to-text input, and prompt optimization. BetterPrompt integrates directly into text input fields on any webpage and improves both the quality of search queries and AI interactions—helping users get better results, faster.
 
---
 
## 🧠 Key Capabilities

- **Grammar & Clarity Enhancements:** Real-time grammar correction and sentence restructuring.

- **Prompt Optimization:** Refines prompts for search engines and AI tools like ChatGPT.

- **Speech-to-Text Input:** Enables hands-free communication through Azure Speech.

- **Language Translation:** Accurately translates input to and from multiple languages.

- **Content Moderation:** Flags harmful, biased, or sensitive content and suggests ethical alternatives.

- **Accessible UI:** Clean, responsive React + MUI interface that overlays any text field on a webpage.
---

## 🎯 Goals
- Help users communicate clearly, quickly, and effectively—regardless of language fluency or ability.

- Make digital spaces more accessible to users with writing or speech-related disabilities.

- Support global, multilingual communication with accurate translation and optimization.

- Improve the quality of user inputs for AI interactions and search results.

- Promote safe, ethical, and inclusive online communication through intelligent moderation.
 
---

## 🔭 Vision
 
BetterPrompt aims to evolve into a universal communication assistant that:

- Integrates with virtual assistants, messaging tools, and productivity platforms.

- Offers tone adjustment, prompt intent detection, and smart writing suggestions.

- Becomes a default accessibility and clarity enhancer for the web and mobile environments.
 
---

## Presentation and Demo Link

[BetterPrompt Presentation Link](https://drive.google.com/file/d/1r2GbSoYUa7ijZnW_gVmjAc_aBp5JK__a/view?usp=sharing)

[BetterPrompt Demo Link](https://drive.google.com/file/d/10wOT12Q-nWJXct3e5PRjccv3W9aeX7zV/view?usp=sharing)

---
 
## 🛠 Tech Stack
 
- **Frontend:** React, Material-UI (MUI)

- **Browser Platform:** Chrome Extension API

- **Speech & Text Processing:** Azure Cognitive Services (Text Analytics, Translator, Speech-to-Text)

- **Backend (Planned):** Azure Functions or Node.js for processing user input
 

## Project Structure

```
📦 project-root
├── 📂 backend_service
│   ├── 📂 AnalyzePrompt
│   ├── 📂 SpeechToText
│   ├── 📄 host.json
│   ├── 📄 local.settings.json
│   └── 📄 package.json
├── 📂 web
│   ├── 📂 src
│   ├── 📂 public
│   ├── 📄 index.html
│   ├── 📄 package.json
│   └── 📄 README.md
└── 📄 README.md
```

## Project Architecture
<details>
<summary>Click To Expand</summary>


```
+---------------------------------+
|       User Input (Text/Voice)   |
|---------------------------------|
| - Chrome Extension detects input|
| - Voice Input processed via     |
|   Azure Speech-to-Text          |
+---------------------------------+
                |
                v
+---------------------------------+
|       Azure Functions           | 
| - Serverless backend processing |
| - Triggers various Azure APIs   |
+---------------------------------+
                |
                v
+---------------------------------+
|       Azure OpenAI (GPT)        |
| - Refines input for clarity,   |
|   conciseness, and grammar     |
| - Optimizes AI queries         |
+---------------------------------+
                |
                v
+---------------------------------+     +---------------------------------+
|      Azure Content Safety      |<--->|     Azure Translator           |
| - Detects harmful content,     |     | - Translates text input into   |
|   bias, or offensive language  |     |   desired language            |
| - Suggests ethical alternatives|     +---------------------------------+
+---------------------------------+
                |
                v
+---------------------------------+
|       Azure Speech (optional)  |
| - Converts optimized text to   |
|   speech (Text-to-Speech)      |
+---------------------------------+
                |
                v
+---------------------------------+
|     Chrome Extension UI        |
| - Displays optimized input     |
| - Provides feedback to the user|
| - Suggests improvements or     |
|   alternative phrasing         |
+---------------------------------+
```

</details>


## Technologies Used

- **Azure Functions**
  - `AnalyzePrompt`  
  - `SpeechToText`
- **Azure AI Services**
  - Azure OpenAI
  - Azure Content Safety
  - Azure Translator
  - Azure Speech
- **Frontend**
  - JavaScript (React/Vanilla JS)
  - Azure integration

## Backend Service

### 1. `AnalyzePrompt`
- Processes input text using Azure OpenAI.
- Ensures safe content using Azure Content Safety.
- Supports translation via Azure Translator.

### 2. `SpeechToText`
- Converts audio to text using Azure Speech Service.
- Outputs transcribed text for further analysis.

## Setup Instructions

### Prerequisites
- Node.js (Latest LTS)
- Azure Functions Core Tools
- Azure CLI
- A configured Azure Subscription with required services



<details>
<summary>Installation</summary>
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo.git
   cd project-root
   ```

2. Install dependencies for the backend:
   ```sh
   cd backend_service
   npm install
   ```

3. Install dependencies for the frontend:
   ```sh
   cd ../web
   npm install
   ```
</details>

<details>
<summary>Running Locally</summary>

#### Backend:
1. Navigate to the `backend_service` folder:
   ```sh
   cd backend_service
   ```

2. Start the Azure Functions locally:
   ```sh
   func start
   ```

#### Frontend:
1. Navigate to the `web` folder:
   ```sh
   cd web
   ```

2. Start the development server:
   ```sh
   npm run dev
   ```
</details>

<details>

<summary>Deployment</summary>

#### Backend:
1. Login to Azure:
   ```sh
   az login
   ```

2. Deploy Azure Functions:
   ```sh
   func azure functionapp publish <YourFunctionAppName>
   ```

#### Frontend:
1. Deploy frontend (if using Azure Static Web Apps):
   ```sh
   az staticwebapp create --name <YourWebAppName> --resource-group <YourResourceGroup> --source ./web --branch main --location <YourRegion>
   ```
</details>

## Environment Variables

Go to `local.settings.json` file in `backend_service` and put the values of these environment variables:
```env
    "OPENAI_ENDPOINT": "",
    "OPENAI_API_KEY":"",
    "CONTENT_SAFETY_ENDPOINT": "",
    "CONTENT_SAFETY_API_KEY"="",
    "AZURE_TEXT_ANALYTICS_ENDPOINT": "",
    "AZURE_TEXT_ANALYTICS_API_KEY":"",
    "AZURE_TRANSLATOR_ENDPOINT": "",
    "AZURE_TRANSLATOR_API_KEY":""
  
```

## Contributing
Feel free to submit issues or contribute to the project.

## License
MIT License

