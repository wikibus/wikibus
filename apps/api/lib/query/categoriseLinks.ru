PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wba: <https://schema.wikibus.org/>

delete {
  graph ?graph {
    ?s ?p ?o
  }
} where {
  #{resourceValues}

  bind(iri(concat(str(?res), "#seeAlso")) as ?graph)

  graph ?graph {
    ?s ?p ?o
  }
};

insert {
  graph ?graph {
    ?res ?seeAlso ?link
  }
} where {
  #{resourceValues}

  ?res rdfs:seeAlso ?link .

  BIND(
    COALESCE(
              IF(regex(str(?link), "^http://dbpedia.org"), wba:dbpediaLink, 1/0),
              IF(regex(str(?link), "^https://www.facebook.com"), wba:facebookLink, 1/0),
              IF(regex(str(?link), "^https://www.flickr.com/photos"), wba:flickrLink, 1/0),
              IF(regex(str(?link), "^https?://phototrans.eu/"), wba:phototransLink, 1/0),
              1/0
            )
    as ?seeAlso
  )

  bind(iri(concat(str(?res), "#seeAlso")) as ?graph)
}
