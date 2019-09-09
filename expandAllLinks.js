/*
 * Expand top-level hidden comment threads on a Reddit post. This can be run as a helper-script for expandAllLinks, but is not required.
 * After testing, this is not required since Reddit's sorting algorithm displays the heavily-voted comments first.
 * This is intended to be run as a Chrome snippet.
 * After loading a given link, execute the snippet to display vote information in your console
 * For info on running snippets: https://developers.google.com/web/tools/chrome-devtools/javascript/snippets
 */

var ADDITIONAL_COMMENT_LOAD_DELAY_MS = 5000; // var to allow re-execution without error in browser snippet

setTimeout(() => {
  // initial invocation is delayed to give page time to load:
  openAllReplies();
}, ADDITIONAL_COMMENT_LOAD_DELAY_MS);

function openAllReplies(cb = printDone) {
  console.log("Checking to fetch more replies...");
  const replyLinks = document.querySelectorAll("[id^='moreComments'] p");
  const theLink = replyLinks[replyLinks.length - 1];
  if (!theLink) return cb();
  const numRepliesStr = theLink.textContent;
  const numReplies = numRepliesStr.match(/(\d+) more repl/)[1];
  console.log("Additional replies:", numReplies);
  if (numReplies < 10) return cb();
  theLink.click();
  setTimeout(() => {
    scrollPage();
    openAllReplies(cb);
  }, ADDITIONAL_COMMENT_LOAD_DELAY_MS);
}

function scrollPage() {
  window.scrollTo(0, document.body.scrollHeight);
}

function printDone() {
  console.log("DONE.");
}
