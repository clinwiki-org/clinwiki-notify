import {Pool} from 'pg';
import config from '../../config';

const connectionString = config.postgresUrl;
    
const pool = new Pool({ connectionString });

export const query = async (str,params) => {
    const res = await pool.query(str,params);
    return res;
}

