require('dotenv').config()

const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({auth: process.env.GITHUB_TOKEN});

const org = "abacum-io";
const gifRegexp = /\!\[\]\((.*gif)\)/gm;

const getRepos = async () => octokit.repos.listForOrg({ org })
const getPRs = async (repo) => octokit.pulls.list({ owner:org, repo, state: 'all' });

const gifsFromPr = (pr) => {
    const match = gifRegexp.exec(pr.body);
    return match ? match[1] : null
}
const gifsFromRepo = async (repo) => {
    const { data } = await getPRs(repo.name);
    const gifs = data.map((pr) => gifsFromPr(pr))
    return gifs.filter((obj) => obj) // cleanup nulls
}

const gifsFromRepos = async (repos) => Promise.all(repos.map(async (repo) => await gifsFromRepo(repo)));

const getGifs = async () => {
    const { data } = await getRepos();
    const gifsList = await gifsFromRepos(data);
    return gifsList.flat();
}

getGifs().then((gifs) => console.log('finished', gifs))