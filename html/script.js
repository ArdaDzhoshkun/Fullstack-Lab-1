document.addEventListener("DOMContentLoaded", function(){
    console.log("---DOM LOADED---");
    fetchAll(); // fetch all recipes on load

    document.querySelector(".recipeForm").addEventListener("submit", async (event) => {
        event.preventDefault(); // prevent refresh

        const formInput = new FormData(event.target);
        const recipe = Object.fromEntries(formInput.entries());

        // Convert strings to proper types
        recipe.ingredients = recipe.ingredients.split(",").map(i => i.trim());
        recipe.preparation = recipe.preparation.split(",").map(s => s.trim());
        recipe.time = Number(recipe.time);
        recipe.spiceLevel = Number(recipe.spiceLevel);
        recipe.glutenFree = recipe.glutenFree === "on";
        recipe.vegan = recipe.vegan === "on";

        try {
            const response = await fetch('/api/dishes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipe)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            event.target.reset();
            fetchAll(); // refresh table
        } catch (err) {
            console.error("Error adding recipe:", err);
        }
    });
});

async function fetchAll(){
    try {
        const fetchResponse = await fetch('/api/dishes');
        const recipes = await fetchResponse.json();
        const tbody = document.querySelector(".tbody");
        tbody.innerHTML = "";

        recipes.forEach(recipe => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><input value="${recipe.name}" id="name-${recipe._id}"></td>
                <td><input value="${recipe.ingredients.join(', ')}" id="ingredients-${recipe._id}"></td>
                <td><input value="${recipe.preparation.join(', ')}" id="preparation-${recipe._id}"></td>
                <td><input value="${recipe.landOfOrigin}" id="origin-${recipe._id}"></td>
                <td><input type="number" value="${recipe.time}" id="time-${recipe._id}"></td>
                <td><input type="number" value="${recipe.spiceLevel}" id="spice-${recipe._id}"></td>
                <td><input type="checkbox" id="gluten-${recipe._id}" ${recipe.glutenFree ? "checked" : ""}></td>
                <td><input type="checkbox" id="vegan-${recipe._id}" ${recipe.vegan ? "checked" : ""}></td>
                <td>
                    <button onclick="updateRecipe('${recipe._id}')">Save</button>
                    <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error fetching recipes:", err);
    }
}

async function updateRecipe(id){
    const updated = {
        name: document.getElementById(`name-${id}`).value,
        ingredients: document.getElementById(`ingredients-${id}`).value.split(",").map(i => i.trim()),
        preparation: document.getElementById(`preparation-${id}`).value.split(",").map(s => s.trim()),
        landOfOrigin: document.getElementById(`origin-${id}`).value,
        time: Number(document.getElementById(`time-${id}`).value),
        spiceLevel: Number(document.getElementById(`spice-${id}`).value),
        glutenFree: document.getElementById(`gluten-${id}`).checked,
        vegan: document.getElementById(`vegan-${id}`).checked
    };

    try {
        const response = await fetch(`/api/dishes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        fetchAll();
    } catch (err) {
        console.error("Error updating recipe:", err);
    }
}

async function deleteRecipe(id){
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    try {
        const response = await fetch(`/api/dishes/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        fetchAll();
    } catch (err) {
        console.error("Error deleting recipe:", err);
    }
}
