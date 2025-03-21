# BetterPrompt Extension

This project is an extension using Azure Functions and JavaScript. It consists of a backend service that processes speech and text using various Azure AI services and a frontend web application.

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

