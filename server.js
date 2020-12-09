const express = require(  'express' );
require('dotenv').config()
const fs = require('fs');
const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;
const privateKey = fs.readFileSync("./private-key.pem");
const { createAppAuth } = require( "@octokit/auth-app");
const auth = createAppAuth({
	appId: 92086,
	privateKey,
	installationId: 123,
	clientId,
	clientSecret,
});
const app = express();
app.use(express.json());
app.get('/', async (req, res) => {
  res.json({
      hi: 'Roy',
  });
});
let redirect = 'http://localhost:3000/login/after'
app.get('/login/start', async (req, res) => {
    res.redirect(301, `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}`)
});
app.get('/login/after', async (req, res) => {
    const { code } = req.query;
    try {
        const oauthAuthentication = await auth({ type: "oauth", code });
        const { token } = oauthAuthentication;
        res.json({token});
    } catch (error) {
        res.status(400).json({error})
    }
    
})

app.listen(3000);