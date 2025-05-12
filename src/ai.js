export async function getRecipeFromChefClaude(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");

    // Call the Netlify function to fetch the recipe
    const response = await fetch('/.netlify/functions/getRecipe', {
        method: 'POST',
        body: JSON.stringify({ ingredients: ingredientsArr }), // Send ingredients as the body
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data.recipe;  // Return the recipe
}
