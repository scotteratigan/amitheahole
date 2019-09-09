# amitheahole
Weighted Vote Counter for Reddit's /r/amitheasshole

## Example Output

Results for https://www.reddit.com/r/AmItheAsshole/comments/d1btlg/aita_because_i_refuse_to_go_and_visit_my_special/:
![Screenshot](/example.png "Screenshot")

## Voting Options

Comments are searched for the specified "vote phrase", either:
1. YTA - You're the Asshole (& the other party is not)
2. NTA - You're Not the A-hole (& the other party is)
3. ESH - Everyone Sucks Here
4. NAH - No A-holes here
5. INFO - Not Enough Info

## Explanation

All the loaded comments are scanned for one of the vote phrases listed above. The weighted scores are tallied. (A post containing YTA with 1000 upvotes would add 1000 votes for YTA.)

## Usage

Copy-paste the contents of countVotes.js into a new Chrome snippet. Execute the snippet once the desired reddit post is loaded.
For more information on snippets, see here: https://developers.google.com/web/tools/chrome-devtools/javascript/snippets
