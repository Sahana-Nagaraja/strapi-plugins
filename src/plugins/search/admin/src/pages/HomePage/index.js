import React, { memo } from 'react';
import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

const searchClient = instantMeiliSearch(
  "http://localhost:7700",
  "stMeilisearch"
);

const HomePage = () => (
  <InstantSearch
    indexName="pages"
    searchClient={searchClient}
  >
    <SearchBox />
    <Hits hitComponent={Hit} />
  </InstantSearch>
);

const Hit = ({ hit }) => <Highlight attribute="name" hit={hit} />;

export default memo(HomePage);
