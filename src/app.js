import schedule from 'node-schedule';
import * as db from './util/db';
import * as elastic from './util/elastic';
import logger from './util/logger';
import translate from './translator';
import config,{loadConfig} from '../config';
import * as broadcast from './broadcaster';
const util = require('util')

const USER_QUERY = 'SELECT ID,EMAIL,SEARCH_LAST_NOTIFICATION,SEARCH_NOTIFICATION_FREQUENCY FROM USERS';
const SAVED_SEARCHES_QUERY = 'SELECT * FROM SAVED_SEARCHES WHERE USER_ID=$1 AND IS_SUBSCRIBED=true';
const HASH_QUERY = 'SELECT LONG FROM SHORT_LINKS WHERE ID=$1';

export const app = () => {
    let job = schedule.scheduleJob(config.cronTab, async () => {
        logger.info('Starting Job');
        const usersRS = await db.query(USER_QUERY);
        const users = usersRS.rows;
        for(let i=0;i<users.length;i++) {
            const user = users[i];

            if(allowedToNotify(user)) {

                let searchResults = [];
                logger.info('Running saved searches for user '+user.email+' id:'+user.id);
                const savedSearchesRS = await db.query(SAVED_SEARCHES_QUERY, [user.id]);
                const savedSearches = savedSearchesRS.rows;
                logger.info('Found '+savedSearches.length+' subscribed searches for user '+user.email+' id:'+user.id);

                for(let k=0;k<savedSearches.length;k++) {
                    const savedSearch = savedSearches[k];

                    logger.info('Running search for saved search '+savedSearch.id);
                    const criteriaResults = await db.query(HASH_QUERY,[savedSearch.short_link_id]);    
                    const criteria = criteriaResults.rows[0].long;

                    logger.info('Translating search criteria '+util.inspect(criteria,false,null,true));
                    const translated = await translate(criteria,user.search_last_notification);
                    logger.info('Translated search criteria to '+util.inspect(translated, false, null, true ));

                    let esResults = await elastic.query(translated);
                    const results =  esResults.body.hits;
                    logger.info('Found '+results.total+' matches for search '
                        +savedSearch.name_label+( '('+savedSearch.id+')'));

                    if(results.length !== 0) { 
                        searchResults.push({savedSearch,total:results.total});
                    }
                }
                //console.log(util.inspect(searchResults, false, null, true /* enable colors */))
                broadcast.mailResults(user.email,searchResults.slice());
                let rs = await db.query('UPDATE USERS SET SEARCH_LAST_NOTIFICATION=$1 WHERE ID=$2 ',[new Date(),user.id]);
            }
        }
        logger.info('Job Finished.')
    });
}

const allowedToNotify = (user) => {

    logger.debug(user.email + ' search_last_notification: '+user.search_last_notification);
    // Check to see if a long enough time has passed since last notification
    if(!user.search_last_notification) {
        return true;
    }
    const interval = user.search_notification_frequency ? 
        user.search_notification_frequency : config.defaultNotifyIntervalInDays;
    let targetDate = new Date(user.search_last_notification);
    targetDate.setDate( targetDate.getDate() + interval);
    let now = new Date();
    if(targetDate.getTime() < now.getTime()) {
        return true;
    }
    return false;
};

