const esb = require('elastic-builder');

const translate = async (json,lastDate) => {
    const criteria = await JSON.parse(json);
    // console.log('agg_filters',criteria.agg_filters)
    // console.log('crowd_agg_filters',criteria.crowd_agg_filters)
    // console.log('q',criteria.q)

    let boolQuery = esb.boolQuery();

    if(criteria.q.key === 'AND' && criteria.q.children) {
        criteria.q.children.forEach( child => {
            boolQuery.must(esb.simpleQueryStringQuery('('+child.key+')') );
        })
    }
    if(criteria.q.key === 'OR' && criteria.q.children) {
        criteria.q.children.forEach( child => {
            boolQuery.should(esb.simpleQueryStringQuery('('+child.key+')') );
        })
    }

    if(lastDate) {
        const dateString = lastDate.getMonth()+'/'+lastDate.getDate()+'/'+lastDate.getFullYear();
        boolQuery.must(esb.simpleQueryStringQuery('indexed_at:{'+dateString+' TO *}'));
    }
    let requestBody = esb.requestBodySearch().query( boolQuery );

    return requestBody.toJSON();
}

export default translate;