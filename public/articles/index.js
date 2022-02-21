const domains = {
  'biodiversity-credit': mapGraphData(BiodiversityCreditArticles),
  'biodiversity-offset': mapGraphData(BiodiversityOffsetArticles),
  'biodiversity-token': mapGraphData(BiodiversityTokenArticles),
};

function renderSelectedNode(article, graphData) {
  const coArticleIds = graphData.edges
    .filter(({ from, to }) => from === article.id || to === article.id)
    .map(({ from, to }) => (from === article.id ? to : from));
  const coArticles = graphData.nodes.filter(({ id }) =>
    coArticleIds.includes(id),
  );
  const coArticlesHTML = coArticles
    .map(
      ({ articleTitle, id }) => `
          <span class="link-item" data-id="${id}">
            ${truncate(articleTitle)}
          </span>
        `,
    )
    .join('');

  return `
      <div>
        <p class="h4">
            <a href="${article.link}" target="_blank">
                ${article.articleTitle}
            </a>
        </p>
      </div>
      <div>
        Number Of Citations: 
        <a href="${article.link}" target="_blank">
            ${article.numberOfCitations}
        </a>
      </div>
      <div>
        Authors: ${article.authors.map(({ name }) => name).join(', ')}
      </div>
      <div>
        Common articles: ${coArticlesHTML || '-'}
      </div>
    `;
}

initGraph({
  domains,
  defaultDomain: 'biodiversity-credit',
  renderSelectedNode,
  noDataMessage: 'No article selected',
});

function mapGraphData(data) {
  const nodes = data.nodes.map((node) => {
    let angle = Math.random() * Math.PI * 2;
    let radius = 50 + Math.floor(Math.random() * 4000);
    let x = Math.cos(angle) * radius;
    let y = Math.sin(angle) * radius;
    return {
      id: node.id,
      link: node.link,
      authors: node.authors,
      numberOfCitations: node.numberOfCitations,
      articleTitle: node.title,
      label: truncate(node.title),
      value: node.numberOfCitations,
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
