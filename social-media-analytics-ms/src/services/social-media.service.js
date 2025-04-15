const fs = require("node:fs");
const path = require("node:path");


async function getToken() {
    try {
        // Check for the last available token
        const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../configs/", "test-server-request-credentials.json"), "utf-8"));
        if (config.access_token && config.expires_in >= Date.now()) return config.access_token;

        // Fetch the latest token
        const body = {
            name: "Akshay Raj",
            email: process.env.NAME,
            rollNo: process.env.ROLL_NO?.toString(),
            accessCode: process.env.ACCESS_CODE,
            clientID: proccess.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        }
        const response = await fetch(`${process.env.TEST_SERVER_BASE_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorBody = await response.json();
            console.log(response.error);
            return null;
        }

        const data = await response.json();
        config.access_token = data.access_token;
        config.expires_in = data.expires_in;
        fs.writeFileSync(path.join(__dirname, "../configs/", "test-server-request-credentials.json"), JSON.stringify(config));
        return config.access_token;
    } catch (e) {
        console.log(error);
        return null;
    }
}

async function getUsers() {
    try {

        const response = await fetch(`${process.env.TEST_SERVER_BASE_URL}/users`, {
            headers: {
                "Authorization": `Bearer ${await getToken()}`
            }
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.log(errorBody.error);
            return null;
        }
        const data = await response.json();
        return data.users;

    } catch (e) {
        console.log(error);
        return null;
    }
}

async function getPosts(userId) {
    try {
        const response = await fetch(`${process.env.TEST_SERVER_BASE_URL}/users/${userId}/posts`, {
            headers: {
                "Authorization": `Bearer ${await getToken()}`
            }
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.log(errorBody.error);
            return null;
        }
        const data = await response.json();
        return data.posts;

    } catch (e) {
        console.log(error);
        return null;
    }
}


async function getComments(postId) {
    try {
        const response = await fetch(`${process.env.TEST_SERVER_BASE_URL}/posts/${postId}/comments`, {
            headers: {
                "Authorization": `Bearer ${await getToken()}`
            }
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.log(errorBody.error);
            return null;
        }
        const data = await response.json();
        return data.comments;

    } catch (e) {
        console.log(error);
        return null;
    }
}


module.exports = { getUsers, getPosts, getComments };