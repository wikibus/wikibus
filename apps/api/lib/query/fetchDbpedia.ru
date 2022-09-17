PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX schema: <http://schema.org/>

delete {
  graph ?dbpedia {
    ?s ?p ?o
  }
} where {
  #{resourceValues}

  bind(iri(concat(str(?res), "#dbpedia")) as ?dbpedia)

  graph ?dbpedia {
    ?s ?p ?o
  }
};

insert {
  graph ?dbpedia {
    ?link dbo:abstract ?abs .
  }
} where {
  #{resourceValues}

  ?res rdfs:seeAlso ?link .
  filter(regex(str(?link), "dbpedia.org"))

  bind(iri(concat(str(?res), "#dbpedia")) as ?dbpedia)

  service <https://dbpedia.org/sparql> {
    ?link dbo:abstract ?abs .
  }
};

insert {
  graph ?res {
    ?res schema:image
      [
        a schema:ImageObject ;
        schema:contentUrl ?logo ;
        schema:caption ?caption ;
    ]
  }
} where {
  #{resourceValues}

  ?res rdfs:seeAlso ?link .
  FILTER NOT EXISTS {
      ?res schema:image []
  }

  filter(regex(str(?link), "dbpedia.org"))

  bind(iri(concat(str(?res), "#dbpedia")) as ?dbpedia)

  service <https://dbpedia.org/sparql> {
    ?link dbo:thumbnail ?logo .
    OPTIONAL { ?link dbo:thumbnailCaption ?caption }
  }
};

insert {
  graph ?dbpedia {
    ?wikiPage schema:about ?link .
    ?wikiPage schema:inLanguage ?lang .
    ?wikiPage rdfs:label ?label
  }
} where {
  #{resourceValues}

  ?res rdfs:seeAlso ?link .
  filter(regex(str(?link), "dbpedia.org"))

  bind(iri(concat(str(?res), "#dbpedia")) as ?dbpedia)

  service <https://dbpedia.org/sparql> {
    ?link owl:sameAs ?wikidataId .
  }

  filter(regex(str(?wikidataId), "wikidata.org"))
  service <https://query.wikidata.org/sparql> {
    ?wikiPage schema:about ?wikidataId .
    ?wikiPage schema:inLanguage ?lang .
    ?wikiPage schema:name ?wikiTitle
  }

  bind(concat("(", ?lang, ") ", ?wikiTitle) as ?label)
};

insert {
  graph ?dbpedia {
    ?wikiPage schema:about ?link .
    ?wikiPage schema:inLanguage ?lang .
    ?wikiPage rdfs:label ?label
  }
} where {
  #{resourceValues}

  ?res rdfs:seeAlso ?wikiPage .
  filter(regex(str(?wikiPage), "wikipedia.org"))

  bind(iri(concat(str(?res), "#dbpedia")) as ?dbpedia)

  service <https://query.wikidata.org/sparql> {
    ?wikiPage schema:about ?wikidataId .
    ?wikiPage schema:inLanguage ?lang .
    ?wikiPage schema:name ?wikiTitle
  }

  bind(concat("(", ?lang, ") ", ?wikiTitle) as ?label)
}
