const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

exports.handler = async (event, context) => {
    // Extract the ingredients array directly from the body
    const { ingredients } = JSON.parse(event.body); // No need to manually parse the array before sending

    const ingredientsString = ingredients.join(", ");
    
    // Make the API request to Anthropic with the API key stored in Netlify env vars
    const anthropic = new Anthropic({
        apiKey: process.env.VITE_ANTHROPIC_API_KEY,  // Use the API key securely from environment variables
        dangerouslyAllowBrowser: true,
    });

    try {
        const msg = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [
                { role: 'user', content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ recipe: msg.content[0].text }), // Send the recipe back as JSON
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch recipe' }),  // Handle errors gracefully
        };
    }
};
