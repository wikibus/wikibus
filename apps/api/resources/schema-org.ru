PREFIX schema: <http://schema.org>

WITH </wba>
INSERT {
  ?s ?p ?o
} WHERE {
  SERVICE <https://raw.githubusercontent.com/zazuko/rdf-vocabularies/master/ontologies/schema/schema.nq> {
    graph schema: {
      ?s ?p ?o
    }
  }
}
