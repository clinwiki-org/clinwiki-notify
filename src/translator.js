import logger from './util/logger';

const esb = require('elastic-builder');

const translate = async (json,lastDate) => {
    const criteria = await JSON.parse(json);

    let boolQuery = esb.boolQuery();

    
    translateAggFilters(criteria.agg_filters,boolQuery);
    translateAggFilters(criteria.crowd_agg_filters,boolQuery);

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

const translateAggFilters = (aggFilters,boolQuery) => {
    if(aggFilters) {
        aggFilters.forEach( agg => {
            boolQuery.must(translateFilterTerm(agg));
        });
    }
};

const translateFilterTerm = (agg) => {
    if(agg.gte || agg.lte || agg.gt || agg.lt) {        
        // This is a range term
        return translateRangeTerm(agg);
    }
    if(agg.lat || agg.long || agg.radius) {
        return translateGeoLoc(agg);
    }
    return translateValueTerms(agg);
};

const translateRangeTerm = (agg) => {
    logger.debug('translateRangeTerm '+agg);
    let query = esb.rangeQuery(agg.field);
    if(agg.lte) {
        query = query.lte(agg.lte);
    }
    if(agg.gte) {
        query = query.gte(agg.gte);
    }
    return query;
};

const translateValueTerms = (agg) => {
    let list = [];
    agg.values.forEach( val => list.push(esb.termQuery(agg.field,val)) );
    return esb.boolQuery().should(list);
}

const translateGeoLoc = (agg) => {
    logger.debug('translateGeoLoc '+agg);
    let query = esb.getDistanceQuery()
        .field(agg.field)
        .distance(agg.range)
        .geoPoint(esb.geoPoint().lat(agg.lat).lon(agg.long));
    return query;
}

export default translate;