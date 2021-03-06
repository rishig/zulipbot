"use strict"; // catch errors easier

const github = require("../github.js"); // GitHub wrapper initialization
const issueReferenced = require("../pullRequests/issueReferenced.js"); // check referenced issues

module.exports = exports = function(body, pullRequestNumber, repoName, repoOwner) {
  github.pullRequests.getCommits({
    owner: repoOwner,
    repo: repoName,
    number: pullRequestNumber
  }).then((response) => {
    let multipleReferences = [];
    response.data.forEach((pullRequest) => {
      const message = pullRequest.commit.message;
      if (!message) return;
      const reference = message.match(/#([0-9]+)/);
      if (!reference) return;
      if (!multipleReferences.includes(reference[1])) {
        issueReferenced(message, pullRequestNumber, repoName, repoOwner);
        multipleReferences.push(reference[1]);
      }
    });
  });
};
