# Learning Langchain 

This repository demonstrates a simple integration of Langchain with OpenAI's LLM and custom tools for arithmetic operations. It leverages a state graph to manage the interaction flow between the LLM and external tools, allowing for multi-step calculations based on natural language instructions. 

## Features 

- **Custom Tools**: Implements arithmetic tools (`add`, `multiply`, `divide`) using Langchain's tool framework. 
- **State Graph Workflow**: Uses Langchain's `StateGraph` to manage the flow between LLM calls and tool executions. 
- **LLM Integration**: Utilizes OpenAI's Chat API (via `ChatOpenAI`) to parse and execute user instructions. 

## Installation 

1. **Clone the Repository** 

```bash 
git clone https://github.com/ashutoshvjti/learning-langchain.git 
cd Learning-Langchain 
``` 

2. **Install Dependencies** 
```bash 
npm install 
```
3. **Configure Environment Variables** 
Create a `.env` file in the root directory and add your OpenAI API key: 
```env 
OPENAI_API_KEY=your_openai_api_key_here 
```

## Usage Run the application with Node.js: 

```bash
node index.js
``` 

The application processes the sample instruction: ``` Add 3 and 4, multiply that by 10 and divide it by 2 ``` and outputs the final result after executing the chained calculations. 

## Dependencies 
- [@langchain/core](https://www.npmjs.com/package/@langchain/core) 
- [@langchain/langgraph](https://www.npmjs.com/package/@langchain/langgraph) 
- [@langchain/openai](https://www.npmjs.com/package/@langchain/openai) 
- [dotenv](https://www.npmjs.com/package/dotenv) 
- [zod](https://www.npmjs.com/package/zod) 

## Contributing 
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes. 

## License 
This project is licensed under the MIT License.
