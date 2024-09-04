PREFIX schema: <http://schema.org/>

WITH schema:
INSERT {
  ?s ?p ?o
} WHERE {
  SERVICE <https://raw.githubusercontent.com/zazuko/rdf-vocabularies/master/ontologies/schema/schema.nq> {
    graph schema: {
      ?s ?p ?o
    }
  }
};

INSERT {
  GRAPH </wba> {
    ?s ?p ?o
  }
} WHERE {
  graph schema: {
    {
      ?s ?p ?o .
      ?s schema:isPartOf <http://auto.schema.org> .
    } UNION {
      ?s ?p ?o .
      VALUES ?s {
        schema:height
        schema:width
        schema:brand
        schema:producer
        schema:value
        schema:maxValue
        schema:minValue
        schema:additionalProperty
        schema:valueReference
      }
    }
  }
}
