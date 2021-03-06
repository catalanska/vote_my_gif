require("dotenv").config();
const { Octokit } = require("@octokit/rest");

const org = "abacum-io";
const gifRegexp = /\!\[\]\((.*[gif|webp])\)/m;
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const getRepos = async () => octokit.repos.listForOrg({ org });

const getPRsPage = async (repo, page) => {
  return octokit.pulls.list({
    owner: org,
    repo,
    state: "all",
    sort: "created",
    per_page: 50,
    page,
  });
};

const uniquePrsList = (prs) => {
  const uniqueList = [];
  return prs.filter((pr) => {
    const inList = uniqueList.includes(pr.html_url);
    if (!inList) uniqueList.push(pr.html_url);
    return !inList;
  });
};

const getPRs = async (repo, page = 0, prs = []) => {
  const { data } = await getPRsPage(repo, page);

  if (data.length === 0) {
    return uniquePrsList(prs);
  }
  return await getPRs(repo, page + 1, prs.concat(data));
};

const extractGif = (body) => {
  const match = gifRegexp.exec(body);
  return !!match ? match[1] : null;
};

const infoFromPr = ({ user, body, html_url, title, created_at }) => {
  const gif = extractGif(body);
  return {
    gif,
    user: user.login,
    avatar: user.avatar_url,
    html_url,
    created_at,
    title,
  };
};

const withGifAndGivenMonth = ({ gif, created_at }) => {
  const month = new Date(Date.parse(created_at)).getMonth();
  const year = new Date(Date.parse(created_at)).getFullYear();
  const currentMonth = new Date().getMonth();
  let lastMonth = currentMonth - 1;
  let lastMonthYear = new Date().getFullYear();

  if (currentMonth === 0) {
    lastMonth = 11;
    lastMonthYear = lastMonthYear - 1;
  }
  return gif && month === lastMonth && year === lastMonthYear;
};

const gifsFromRepo = async (repo) => {
  const prs = await getPRs(repo.name);
  const mappedPrs = prs.map(infoFromPr);
  const gifs = mappedPrs.filter((pr) => withGifAndGivenMonth(pr));

  return gifs; // cleanup nulls
};

const gifsFromRepos = async (repos) =>
  Promise.all(repos.map(async (repo) => await gifsFromRepo(repo)));

exports.getGifs = async () => {
  const { data } = await getRepos();
  const gifsList = await gifsFromRepos(data);
  return gifsList.flat();
};
