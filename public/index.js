let network;
let graphData;

function initGraph({
  domains,
  defaultDomain,
  renderSelectedNode,
  nodeColor = '#97c2fc',
  nodeBorderColor = '#307fea',
  chosenNodeColor = '#e08383',
  chosenNodeBorderColor = '#FF0000',
  lineColor = '#1cd595',
  chosenLineColor = '#FF0000',
  noDataMessage = 'No item selected',
}) {
  const container = document.getElementById('network');
  const options = {
    nodes: {
      shape: 'dot',
      color: {
        background: nodeColor,
        border: nodeBorderColor,
      },
      scaling: {
        min: 10,
        max: 100,
      },
      font: {
        size: 12,
        face: 'Tahoma',
      },
      chosen: {
        node: (n) => {
          n.color = chosenNodeColor;
          n.borderColor = chosenNodeBorderColor;
        },
      },
    },
    edges: {
      color: lineColor,
      width: 0.15,
      smooth: {
        type: 'continuous',
      },
      chosen: {
        edge: (e) => {
          e.color = chosenLineColor;
        },
      },
    },
    interaction: {
      hideEdgesOnDrag: true,
      tooltipDelay: 200,
    },
    layout: {
      randomSeed: 15,
      improvedLayout: true,
    },
    physics: false,
  };

  function selectNode(id) {
    const activeElem = document.getElementById('active_item');
    const selectedNode = graphData.nodes.find((node) => node.id === id);

    if (!selectedNode) {
      activeElem.innerHTML = `<div class="no-data">${noDataMessage}</div>`;
    } else {
      activeElem.innerHTML = renderSelectedNode(selectedNode, graphData);
    }
  }

  function drawGraph(domain) {
    graphData = domains[domain];
    network = new vis.Network(container, graphData, options);
    network.on('selectNode', function (params) {
      selectNode(params?.nodes[0]);
    });
    network.on('deselectNode', function () {
      selectNode();
    });
  }

  document.getElementById('select_domain').addEventListener('change', (e) => {
    drawGraph(e.target.value);
  });

  document.getElementById('active_item').addEventListener('click', (e) => {
    const nodeId = e.target?.dataset?.id;
    if (nodeId) {
      network.selectNodes([nodeId]);
      selectNode(nodeId);
    }
  });

  drawGraph(defaultDomain);
}

function truncate(input = '', max = 10) {
  if (input?.length > max) {
    return input.substring(0, max) + '...';
  }
  return input;
}
