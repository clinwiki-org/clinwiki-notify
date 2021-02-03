import {Pool} from 'pg';
import config from '../../config';
    
let pool = undefined;

export const query = async (str,params) => {
    if(!pool) {
        pool = new Pool({ connectionString: config.postgresUrl });
    }
    const res = await pool.query(str,params);
    return res;
}

