/*
 * Displays vote totals for "YTA", "NTA", etc in your console window.
 * This is intended to be run as a Chrome snippet.
 * After loading a given link, execute the snippet to display vote information in your console
 * For info on running snippets: https://developers.google.com/web/tools/chrome-devtools/javascript/snippets
 */

countVotes();

function countVotes() {
  const votes = {
    YTA: 0,
    NTA: 0,
    ESH: 0,
    NAH: 0,
    INFO: 0
  };
  // First, find all comments. Despite random class names, they all have this custom attribute:
  let comments = document.querySelectorAll('[data-test-id="comment"]');
  comments.forEach((comment, i) => {
    // The score div is right above the comment div - it has a random class, so this is the best way to target:
    const scoreDiv = comment.previousSibling;
    const potentialScoreSpans = scoreDiv.querySelectorAll("span");
    let score = null;
    for (let i = 0; i < potentialScoreSpans.length; i++) {
      const scoreSpan = potentialScoreSpans[i];
      const scoreText = scoreSpan.textContent;
      if (scoreText.endsWith("points")) {
        score = extractScore(scoreText);
        break;
      }
    }
    if (!score) return;
    const vote = extractVote(comment);
    if (!vote) return;
    votes[vote] += score;
  });
  sortAndDisplayPercent(votes);
}

function sortAndDisplayPercent(votes) {
  // Takes the raw vote totals and calculates percentages, then displays all info in console.
  const totalVotes = Object.values(votes).reduce(
    (total, val) => total + val,
    0
  );
  const entries = Object.entries(votes);
  const pctVotes = [];
  for (let [key, value] of entries) {
    const pct = (value / totalVotes) * 100;
    pctVotes.push({ vote: key, pct, score: value });
  }
  pctVotes.sort((a, b) => b.pct - a.pct);
  const fmtPctVotes = pctVotes.map(voteObj => {
    const { pct, score } = voteObj;
    const blocks = parseInt((pct / 10).toFixed(0));
    return {
      vote: voteObj.vote,
      pct: pct.toFixed(2) + "%",
      blocks: buildBar(blocks),
      score
    };
  });
  // Display the table in the console:
  console.table(fmtPctVotes);
}

function buildBar(numBlocks) {
  // Returns a string of ascii boxes based on the int numBlocks
  let blocks = "";
  for (let i = 0; i < numBlocks; i++) {
    blocks += "█";
  }
  return blocks;
}

function extractVote(commentNode) {
  // Each Reddit comment consists of 1 or more paragraphs.
  // Vote is assumed to be in first paragraph, but text could be anywhere.
  const commentParagraphs = commentNode.querySelectorAll("p");
  for (let i = 0; i < commentParagraphs.length; i++) {
    const paragraph = commentParagraphs[i].textContent;
    const voteSearchResults = paragraph.match(/(YTA|NTA|ESH|NAH|INFO)/);
    if (voteSearchResults) {
      return voteSearchResults[1];
    }
  }
  return null;
}

function extractScore(scoreText) {
  // Scores come in two formats:
  // Low scores: "404 points"
  // High scores: "21.6k points"
  const kPos = scoreText.length - 8; // counting backwards, k would be 8 chars from end
  const thousandScore = scoreText.charAt(kPos) === "k"; // if there's a k, this is thousands
  const scoreStr = thousandScore
    ? scoreText.substring(0, kPos)
    : scoreText.substring(0, kPos + 1);
  const baseScore = parseFloat(scoreStr);
  const multiplier = thousandScore ? 1000 : 1;
  const finalScore = parseInt(baseScore * multiplier);
  return finalScore;
}
