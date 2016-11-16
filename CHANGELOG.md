# Changelog
**v3.0 - ??/??/????**
- Switched to Relay

**v2.4.0 - 12/11/2016**
- Now using inn.sc domain name.
- Updated dependencies.
- Added `!packages`/`!fastcart` command for Package Comparison Spreadsheet!

**v2.3.1 - 02/10/2016**
- Fixed issue with default config.
- Bot now gets version number from package.json
- Changed `!relay` calendar URL.

**v2.3 - 27/09/2016**
- Moved changelog from README.md to CHANGELOG.md.
- Removed streamer commands.
- Changed links to GitLab from GitHub.

**v2.2 - 26/08/2016**
- Can now be configured to log all deleted messages.
- Can now be configured to log all edits.

**v2.1 - 25/08/2016**
- Added a `!debug` command.
- Will not reply to system messages.
- Reduced number of decimal points in `!starmap` output.
- Introduced copy meta-command for copying all messages in a channel to another automatically.
- Introduced deleted response logging.

**v2.0.13 - 29/07/2016**
- Fixed Relay Twitch command.

**v2.0.12 - 20/07/2016**
- Now no longer attempts to autolink URLs that contain `/r/` that are not from reddit.

**v2.0.11 - 18/07/2016**
- No automatically links subreddits with names that are too short.

**v2.0.10 - 19/06/2016**
- No longer outputs `test` in place of the time since the kickstarter in the `!stats` command.

**v2.0.9 - 09/06/2016**
- Now matches subreddits with numbers in their names.

**v2.0.8 - 07/06/2016**
- Added `!bulkheads` command.

**v2.0.7 - 30/05/2016**
- Commands are now case-insensitive.

**v2.0.6 - 30/05/2016**
- Fixed issue with `!help` command not being automatically removed if the original message was deleted.
- Fixed issue with `!help` command not listing all commands.
- Fixed README typos.

**v2.0.5 - 29/05/2016**
- Now recommending `EnvironmentFile` over `Environment` in systemd unit files.
- Now no lists more pages than there are in `!help`.
- Now no longer allows page numbers higher than the number of pages to be requested in `!help`.
- Now checks for new/changed/removed repository commands every 5 minutes.

**v2.0.4 - 23/05/2016**
- Now no longer outputs '+-' in `!stats` for a negative difference.

**v2.0.3 - 18/05/2016**
- Now includes who autolinked a subreddit in response.
- Now deletes reply if original message is deleted.

**v2.0.2 - 18/05/2016**
- Fixed issue where aliases were being matched without the command prefix.

**v2.0.1 - 15/05/2016**
- Fixed issue with subreddit autolinking where it would link for proper links.

**v2.0.0 - 14/05/2016**
- Improved Command System.
- Enhanced Configuration.
- Subreddit Autolinking.
- Command Repository Support.
- Added help command pagination.
- Changed elizabot chat into a command.
- Refactored helper functions to return data rather than messages.
- Moved starmap helper into the command class.

View commits for a complete list.

**v1.0.0 - 09/04/2016**
- Initial Release.
