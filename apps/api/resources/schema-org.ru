PREFIX schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

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
        schema:vehicleEngine
        schema:width
        schema:brand
        schema:producer
        schema:value
        schema:maxValue
        schema:minValue
        schema:additionalProperty
        schema:valueReference
        schema:weight
        schema:description
      }
    }
  }
};

INSERT DATA {
GRAPH </wba> {
  schema:valueReference
    rdfs:label "Value Reference"@en ;
  .

  schema:vehicleEngine
    rdfs:label "Engine"@en ;
  .

  schema:enginePower
    rdfs:label "Engine Power"@en ;
  .
}
}
