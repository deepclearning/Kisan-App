const faker = require('faker')
const fs = require('fs');

const contacts = Array(1000).fill(0).map((zero, idx) => ({ firstName: faker.name.firstName(), lastName: faker.name.lastName(), contact: faker.phone.phoneNumber(), id: idx }))
const history = [{time:new Date(), otp: '123456', firtsName: contacts[0].firstName, lastName: contacts[0].lastName, id: 1, contactId: 0}]
fs.writeFile("./db.json", JSON.stringify({contacts, history}, null, 4), function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

// Or
fs.writeFileSync('./db.json');
