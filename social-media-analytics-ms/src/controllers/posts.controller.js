const socialMediaService = require("../services/social-media.service");

async function getPosts(req, res) {
    try {
        const { type = "latest" } = req.query;
        if (type === "latest") {
            const posts = await socialMediaService.getLatestPosts(5);
            return res.status(200).json({ posts });
        } else if (type === "popular") {
            const posts = await socialMediaService.getTopPosts(5);
            return res.status(200).json({ posts });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getPosts };