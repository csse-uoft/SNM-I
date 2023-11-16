const fs = require('fs');
const {test} = require("@jest/globals");
const {EOL} = require("os");

test('the data is peanut butter', () => {
    expect(1+1===2)
});

test('create an connector', async () => {
    await setupConnector()
})

async function setupConnector(){
    const fileContent = fs.readFileSync('tests/connector_setup_queries', 'utf8')
    const queries = fileContent.split(EOL)
    for (let i = 1; i < queries.length; i+=2) {
        await fetch(queries[i], {
                method: 'POST',
                headers: {
                    ContentType: 'application/json'
                }
            });
    }
}

