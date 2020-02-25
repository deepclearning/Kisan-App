const faker = require('faker')
const fs = require('fs');

const contacts = Array(1000).fill(0).map((zero, idx) => ({ firstName: faker.name.firstName(), lastName: faker.name.lastName(), contact: faker.phone.phoneNumber(), id: idx }))
fs.writeFile("./db.json", JSON.stringify({contacts, history:[]}, null, 4), function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

// Or
fs.writeFileSync('./db.json');
