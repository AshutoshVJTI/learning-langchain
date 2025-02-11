import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { ChatOpenAI } from '@langchain/openai';
import { MessagesAnnotation, StateGraph } from '@langchain/langgraph';
import { config } from 'dotenv';
import { ToolMessage } from '@langchain/core/messages';

config();

const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o',
})

const multiply = tool(async ({ a, b }) => a * b, {
    name: 'multiply',
    description: 'Multiplies two numbers together.',
    schema: z.object({
        a: z.number().describe('The first number to multiply.'),
        b: z.number().describe('The second number to multiply.'),
    })
});

const add = tool(async ({ a, b }) => a + b, {
    name: 'add',
    description: 'Adds two numbers together.',
    schema: z.object({
        a: z.number().describe('The first number to add.'),
        b: z.number().describe('The second number to add.'),
    })
});

const divide = tool(async ({ a, b }) => a / b, {
    name: 'divide',
    description: 'Divides two numbers.',
    schema: z.object({
        a: z.number().describe('The first number to divide.'),
        b: z.number().describe('The second number to divide.'),
    })
});

const tools = [multiply, add, divide];
const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
const llmWithTools = llm.bindTools(tools);

async function llmCall(state) {
    const result = await llmWithTools.invoke([
        { role: 'system', content: 'You are a helpful assistant that can perform calculations.' },
        ...state.messages,
    ]);

    return {
        messages: [result],
    }
}

async function toolNode(state) {
    const results = [];
    const lastMessage = state.messages.at(-1);

    if (lastMessage?.tool_calls?.length) {
        for (const toolCall of lastMessage.tool_calls) {
            const tool = toolsByName[toolCall.name];
            const observation = await tool.invoke(toolCall.args);
            results.push(
                new ToolMessage({
                    content: JSON.stringify(observation),
                    tool_call_id: toolCall.id,
                })
            );
        }
    }
    return { messages: results };
}

function shouldContinue(state) {
    const lastMessage = state.messages.at(-1);
    if (lastMessage?.tool_calls?.length) {
        return 'Action';
    }
    return '__end__';
}

const agentBuilder = new StateGraph(MessagesAnnotation)
    .addNode('llmCall', llmCall)
    .addNode('tools', toolNode)
    .addEdge('__start__', 'llmCall')
    .addConditionalEdges(
        'llmCall',
        shouldContinue,
        {
            "Action": "tools",
            "__end__": "__end__",
        }
    )
    .addEdge("tools", "llmCall")
    .compile();

const messages = [
    {
        role: 'user',
        content: 'Add 3 and 4, multiply that by 10 and divide it by 2',
    }
]

const result = await agentBuilder.invoke({ messages });
const finalMessage = result.messages.at(-1);
console.log(finalMessage.content);