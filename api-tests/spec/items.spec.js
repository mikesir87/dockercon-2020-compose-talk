const fetch = require('node-fetch');

it('returns an array of items', async () => {
    const response = await makeRequest("/items");
    expect(response.status).toBe(200);
    expect(response.body instanceof Array).toBe(true);
});

it('can create an item and see it', async () => {
    const response = await makeRequest("/items", {
        name: "Test Item",
    });

    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(false);
    expect(response.body.name).toBe("Test Item");
    expect(response.body.id).not.toBeUndefined();

    const allItems = await makeRequest("/items");
    const item = allItems.body.find(i => i.id === response.body.id);
    expect(item).not.toBeUndefined();
});

it('can delete an item after creating it', async () => {
    const response = await makeRequest("/items", {
        name: "Test Item",
    });

    expect(response.status).toBe(200);

    const deleteResponse = await makeRequest(`/items/${response.body.id}`, null, { method : "DELETE" });
    expect(deleteResponse.status).toBe(200);

    const allItems = await makeRequest("/items");
    const item = allItems.body.find(i => i.id === response.body.id);
    expect(item).toBeUndefined();
});

function makeRequest(url, body, optionOverrides = {}) {
    const defaultOptions = {};
    if (body) {
        defaultOptions.method = "POST";
        defaultOptions.body = JSON.stringify(body);
        defaultOptions.headers = {
            "Content-Type": "application/json"
        };
    }

    const options = Object.assign({}, defaultOptions, optionOverrides);

    const fullUrl = `http://${process.env.API_HOST}:3000${url}`;

    return fetch(fullUrl, options)
        .then(r => Promise.all([ r, r.json() ]))
        .then(([r, body]) => ({
            status : r.status,
            body,
        }));
}
