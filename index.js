import {app} from './src/app';
import logger from './src/util/logger';
import dotenv from 'dotenv';
import {loadConfig} from './config';

                            
logger.info(" _____ _ _     _ _ _ _ _   _ ");
logger.info("|     | |_|___| | | |_| |_|_|");
logger.info("|   --| | |   | | | | | '_| |");
logger.info("|_____|_|_|_|_|_____|_|_,_|_|");
logger.info('ClinWiki saved search notifier starting...');

logger.info('Loading .env');
dotenv.config();
loadConfig();

logger.info('Running...');

app();
