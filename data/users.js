const users = {
    viewer: { // password is sysConfig.userDefaultPassword
        "name": "Viewer-Automation",
        "email": "alexk+viewer-automation@reveal.security",
        "phone": "123456",
        "account_name": "Automation viewer",
        "account_description": "Automation Testing Account viewer",
        "account_company": "Automation viewer",
        "account_site": "https://reveal.security"
    },
    analyst: { // password is sysConfig.userDefaultPassword
        "name": "Analyst-Automation",
        "email": "alexk+analyst-automation@reveal.security",
        "phone": "123456",
        "account_name": "Automation Analyst",
        "account_description": "Automation Testing Account Analyst",
        "account_company": "Automation Analyst",
        "account_site": "https://reveal.security"
    },
    admin: { // password is sysConfig.userDefaultPassword
        "name": "Admin-Automation",
        "email": "alexk+admin-automation@reveal.security",
        "phone": "123456",
        "account_name": "Automation Admin",
        "account_description": "Automation Testing Account Admin",
        "account_company": "Automation Admin",
        "account_site": "https://reveal.security"
    }
};

function getSignupUser(userObjectName) {
    return users[userObjectName];
}

function getAllUsers() {
    return users;
}

const getNameOfTheObject = varObj => Object.keys(varObj);
const nameOf = (f) => (f).toString().replace(/[ |()=>]/g,'');

module.exports = {
    getSignupUser,
    getAllUsers,
    allUsers: users,
    getNameOfTheObject,
    nameOf
};