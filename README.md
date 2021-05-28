# clinwiki-notify
Notification App for Subscribed Searches.

## Getting Started

Make sure you have an .env file in the root directory in order to insure the right environment variables are set. A sample one is included in sample.env. Rename it and put in the correct values for your setup.

**DATABASE_URL** : The connection string to the postgres database to use.

**SEARCHBOX_URL** : The url for the elasticsearch instance to search against.

**NODE_ENV** : For a dev environment, set it to "development"

**CRONTAB** : This is the crontab for how often the notification job should run.

The file schema-changes.sql contains the neccessary column changes needed to the USERS table.

To start the application, run the command: `npm start`

## Code Overview

Whenever the cron job is triggered, the app will search for all users with that haven't been notified since the number of days set in the DEFAULT_NOTIFCATION_INTERVAL_DAYS environment variable (default is 1 day). Then for each user, all their saved searches that have been flagged as IS_SUBSCRIBED true are pulled. This query from the SHORT_LINKS table is then translated into an Elasticsearch query and run against the ES server.

The overview of the results of all the saved search queries are aggregated and then sent to the broadcaster. The broadcaster passes the metadata to the ![PUG template](https://pugjs.org) in /src/views/savedSearchEmail.pug. The user is emailed the results and the app moves on to the next user.

**A note on the query translator:** This is a stripped down version of the one found in the main ![clinwiki app](https://github.com/clinwiki-org/clinwiki). There is no need for aggs or sorting so only the query piece is used.
