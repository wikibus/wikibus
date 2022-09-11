prefix schema: <http://schema.org/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX as: <https://www.w3.org/ns/activitystreams#>

DELETE {
  graph ?res {
    ?res rdfs:seeAlso ?link .
  }
}
insert {
  graph ?post {
    ?post a schema:SocialMediaPosting .
    ?post schema:url ?link .
    ?post schema:mainEntity ?res .
  }

  graph ?event {
    ?event a ?eventType .
    ?event as:object ?post .
  }
}
where {
  #{resourceValues}

  VALUES ?pattern {
    "^https://www.facebook.com"
    "^https://www.flickr.com/photos"
    "^https?://phototrans.\\\\w{2,3}/"
    "^https://(www.)?(youtube.com|youtu.be)/"
  }

  GRAPH ?res {
    ?res rdfs:seeAlso ?link .
  }

  FILTER (regex(str(?link), ?pattern) )

  BIND(iri(concat("#{mediaPostingBase}", md5(str(?link)))) as ?post)

  OPTIONAL {
    ?post a ?postExists .
  }

  BIND(IF(BOUND(?postExists), as:Update, as:Create) as ?eventType)
  BIND(uuid() as ?event)
}
