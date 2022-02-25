const domains = {
  biodiversity: mapGraphData(Biodiversity),
  carbon: mapGraphData(Carbon),
  restoration: mapGraphData(Restoration),
};

function renderSelectedNode(prof, graphData) {
  const id = prof.profileId;
  const coProfileIds = graphData.edges
    .filter(({ from, to }) => from === id || to === id)
    .map(({ from, to }) => (from === id ? to : from));
  const coProfiles = graphData.nodes.filter(({ profileId }) =>
    coProfileIds.includes(profileId),
  );
  const coProfilesHTML = coProfiles
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
            <a href="https://twitter.com/${prof.username}" target="_blank">${prof.name}</a>
        </p>
      </div>
      <div>
        Description: ${prof.description}
      </div>
      <div>
        Link: <a href="${prof.link}" target="_blank">${prof.link}</a>
      </div>
      <div>
        Location: ${prof.location}
      </div>
      <div>
        Number Of Followers: ${prof.value}
      </div>
      <div>
        Connections: <div class="connections">${coProfilesHTML}</div>
      </div>
    `;
}

function renderSearchItems(query, graphData) {
  const profiles = graphData.nodes.filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );
  if (profiles.length > 0) {
    return profiles
      .map(
        ({ name, id }) => `
          <li data-id="${id}">
            ${name}
          </li>
        `,
      )
      .join('');
  } else {
    return '<span class="no-search-data">No accounts found</span>';
  }
}

initGraph({
  domains,
  defaultDomain: 'biodiversity',
  renderSelectedNode,
  renderSearchItems,
  noDataMessage: 'No account selected',
});

function mapGraphData(data) {
  const nodes = data.nodes.map((node) => {
    let angle = Math.random() * Math.PI * 2;
    let radius = 50 + Math.floor(Math.random() * 4000);
    let x = Math.cos(angle) * radius;
    let y = Math.sin(angle) * radius;
    return {
      id: node.profileId,
      profileId: node.profileId,
      name: node.name,
      username: node.username,
      description: node.description,
      location: node.location,
      link: node.link,
      label: node.name,
      value: node.followersCount,
      x,
      y,
    };
  });

  const edges = data.edges.map((edge) => {
    return {
      id: edge.id,
      from: edge.from,
      to: edge.to,
    };
  });

  return { nodes, edges };
}
