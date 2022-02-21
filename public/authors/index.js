const domains = {
  'soil-carbon': mapGraphData(SoilCarbonAuthors),
  'soil-biodiversity': mapGraphData(SoilBiodiversityAuthors),
  'belowground-mapping': mapGraphData(BelowgroundMappingAuthors),
  'belowground-ecosystems': mapGraphData(BelowgroundEcosystemsAuthors),
};

function renderSelectedNode(author, graphData) {
  const id = author.id;
  const coAuthorIds = graphData.edges
    .filter(({ from, to }) => from === id || to === id)
    .map(({ from, to }) => (from === id ? to : from));
  const coAuthors = graphData.nodes.filter(({ id }) =>
    coAuthorIds.includes(id),
  );
  const coAuthorsHTML = coAuthors
    .map(
      ({ name, id }) => `
          <span class="link-item" data-id="${id}">
            ${name}
          </span>
        `,
    )
    .join('');

  return `
      <div>
        <p class="h4">
            <a href="https://scholar.google.com/citations?user=${author.id}" target="_blank">${author.name}</a>
        </p>
      </div>
      <div>
        Number Of Articles: ${author.value}
      </div>
      <div>
        Number Of Citations: ${author.numberOfCitations}
      </div>
      <div>
        Co-authors: ${coAuthorsHTML}
      </div>
    `;
}

function renderSearchItems(query, graphData) {
  const authors = graphData.nodes.filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );
  if (authors.length > 0) {
    return authors
      .map(
        ({ name, id }) => `
          <li data-id="${id}">
            ${name}
          </li>
        `,
      )
      .join('');
  } else {
    return '<span class="no-search-data">No authors found</span>';
  }
}

initGraph({
  domains,
  defaultDomain: 'soil-carbon',
  renderSelectedNode,
  renderSearchItems,
  noDataMessage: 'No author selected',
});

function mapGraphData(data) {
  const nodes = data.nodes.map((node) => {
    let angle = Math.random() * Math.PI * 2;
    let radius = 100 + Math.floor(Math.random() * 4000);
    let x = Math.cos(angle) * radius;
    let y = Math.sin(angle) * radius;
    return {
      ...node,
      label: node.name,
      x,
      y,
    };
  });

  const maxEdgeWidth = 4;
  const edges = data.edges.map((edge) => {
    const width =
      edge.value < maxEdgeWidth
        ? maxEdgeWidth * (edge.value / maxEdgeWidth)
        : maxEdgeWidth;
    return {
      id: edge.id,
      from: edge.from,
      to: edge.to,
      width,
    };
  });

  return { nodes, edges };
}
