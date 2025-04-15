const fs = require("node:fs");
const path = require("node:path");


let allUsers = [];
let allPosts = [];


// Main Functions
async function getToken() {
    try {
        // Check for the last cached token
        const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../configs/", "test-server-request-credentials.json"), "utf-8"));
        if (config.access_token && config.expires_in >= Date.now()) return config.access_token;

        // Fetch the latest token
        const body = {
            name: "Akshay Raj",
            email: process.env.NAME,
            rollNo: process.env.ROLL_NO?.toString(),
            accessCode: process.env.ACCESS_CODE,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        }

        console.log(body);
        const response = await fetch(`${process.env.TEST_SERVER_BASE_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorBody = await response.json();
            console.log(errorBody.errors);
            return null;
        }

        const data = await response.json();
        config.access_token = data.access_token;
        config.expires_in = data.expires_in;
        fs.writeFileSync(path.join(__dirname, "../configs/", "test-server-request-credentials.json"), JSON.stringify(config));
        return config.access_token;

    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getAllUsers() {
    try {
        const response = await fetch(`${process.env.TEST_SERVER_BASE_URL}/users`, {
            headers: {
                "Authorization": `Bearer ${await getToken()}`
            }
        });
        if (!response.ok) {
            const errorBody = await response.json();
            console.log(errorBody.errors);
            return null;
        }
        const data = await response.json();
        return data.users || [];

    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getAllPosts(userId) {
    try {
        const response = await fetch(`${process.env.TEST_SERVER_BASE_URL}/users/${userId}/posts`, {
            headers: {
                "Authorization": `Bearer ${await getToken()}`
            }
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.log(errorBody.errors);
            return null;
        }
        const data = await response.json();
        return data.posts || [];

    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getAllComments(postId) {
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
        return data.comments || [];

    } catch (error) {
        console.log(error);
        return null;
    }
}


// Exposed Functions
async function getTopUsers(limit = 5) {

    allUsers = await getAllUsers();
    const topPosts = await getTopPosts(limit);

    return allUsers.filter(user => {
        return topPosts.find(post => post.userId === user.id);
    });
}

async function getTopPosts(limit = 5) {
    if (!allUsers || allUsers.length === 0) allUsers = await getAllUsers();
    allPosts = await Promise.all(allUsers.map(async (user) => await getAllPosts(user.id)));

    const topPosts = await Promise.all(
        allPosts.map(async post => {
            const comments = await getAllComments(post.id);
            return { ...post, commentsCount: comments.length };
        })
    );

    return topPosts.sort((a, b) => {
        return b.commentsCount - a.commentsCount;
    }).slice(0, limit);
}

async function getLatestPosts(limit = 5) {
    if (!allUsers || allUsers.length === 0) allUsers = await getAllUsers();
    allPosts = await Promise.all(allUsers.map(async (user) => await getAllPosts(user.id)));

    return allPosts.sort((a, b) => {
        return b.id - a.id;
    }).slice(0, limit);
}





module.exports = { getTopUsers, getTopPosts, getLatestPosts };