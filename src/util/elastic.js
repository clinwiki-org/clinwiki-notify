import {Client} from '@elastic/elasticsearch';
import superagent from 'superagent';
import config from '../../config';
const util = require('util')

export const query = async (body) => {
    try {
        const connection = getConnection();
        const payload = {
            index: getIndex(),
            body
        };
        //console.log(util.inspect(payload, false, null, true /* enable colors */))
        const results = await connection.search(payload);
        //console.log(util.inspect(results, false, null, true /* enable colors */))
        return results;
    }
    catch(err) {
        console.log('ERROR',err);
        if(err.statusCode === 400) {
            console.log(err.body.error)
        }
    }
};

const getIndex = () => {
    if(config.nodeEnv === 'production') {        
        return config.searchboxIndex;
    }
    return config.elasticIndex;
}

const getConnection = () => {
    if(config.nodeEnv === 'production') {
        const url = new URL(config.searchboxUrl);
        return  new Client({
            node: config.searchboxUrl,
        });
    
    }
    return  new Client({
        node: config.elasticsearchHost,
        auth: {
            username: config.elasticsearchUsername,
            password: config.elasticsearchPassword
        }
    });
};

export const newQuery = async (body) => {
    try {
        let encode = Buffer.from(config.elasticsearchUsername+':'+config.elasticsearchPassword)
            .toString('base64');
        console.log(encode)
        return await superagent.post(config.elasticsearchHost+'/'+config.elasticIndex+'/_search')
            .set('Authorization','Basic '+ encode)
            .send(body).then(response => response.body);
    }
    catch(err) {
        console.log(util.inspect(err, false, null, true /* enable colors */))
    }
}