const socialMediaService = require("../services/social-media.service");

async function getTopUsers(req, res) {
    try {

        const users = await socialMediaService.getTopUsers(5);
        return res.status(200).json({ users });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getTopUsers };