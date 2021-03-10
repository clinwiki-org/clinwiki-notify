let config = {};

export const loadConfig = () => {
    
    config.postgresUrl= process.env.DATABASE_URL || 'changeme';
    config.elasticsearchHost= process.env.ELASTICSEARCH_HOSTS || 'http://localhost:9200';
    config.elasticsearchUsername= process.env.ELASTICSEARCH_USERNAME || 'changeme';
    config.elasticsearchPassword= process.env.ELASTICSEARCH_PASSWORD || 'changeme';
    config.elasticIndex = process.env.ELASTICSEARCH_INDEX || 'studies_development';
    config.elasticMaxResults = process.env.ELASTICSEARCH_MAX_RESULTS || 15;
    config.cronTab= process.env.CRONTAB || '*/1 * * * *';
    config.smtpHost= process.env.SMTP_HOST || 'changeme';
    config.smtpPort= process.env.SMTP_PORT || 'changeme';
    config.smtpUser= process.env.SMTP_USER || 'changeme';
    config.smtpPassword= process.env.SMTP_PASSWORD || 'changeme';
    config.outboundEmail= process.env.SMTP_OUTBOUND_EMAIL || 'no-reply@yourdomain.com';
    config.webUrl= process.env.WEB_URL || 'http://localhost:3001';  
    config.defaultNotifyIntervalInDays = process.env.DEFAULT_NOTIFCATION_INTERVAL_DAYS  || 7;
    config.googleMapsAPIKey = process.env.GOOGLE_MAPS_API_KEY || 'changeme';
}

export default config;