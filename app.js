// State Management
let nodes = [];
let links = [];

// D3.js Setup
const svg = d3.select("#network-graph");
const width = window.innerWidth;
const height = window.innerHeight - 80; // Subtract header height

const g = svg.append("g");

// Add defs for patterns
const defs = svg.append("defs");

// Zoom behavior
const zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", (event) => {
        g.attr("transform", event.transform);
    });

svg.call(zoom);

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

let link = g.append("g").attr("class", "links").selectAll("line");
let node = g.append("g").attr("class", "nodes").selectAll(".node-group");

function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x},${d.y})`);
}

function updateGraph() {
    // Calculate degree (number of connections) for each node
    const degrees = {};
    nodes.forEach(n => degrees[n.id] = 0);
    links.forEach(l => {
        const sourceId = l.source.id || l.source;
        const targetId = l.target.id || l.target;
        degrees[sourceId] = (degrees[sourceId] || 0) + 1;
        degrees[targetId] = (degrees[targetId] || 0) + 1;
    });

    // Scale for radius (min 15, max 40) - increased for better image visibility
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(Object.values(degrees)) || 1])
        .range([15, 40]);

    // Update Patterns for images
    const nodePatterns = defs.selectAll("pattern")
        .data(nodes, d => d.id);

    nodePatterns.exit().remove();

    const patternEnter = nodePatterns.enter().append("pattern")
        .attr("id", d => `pattern-${d.id.replace(/\s+/g, "-")}`)
        .attr("patternUnits", "objectBoundingBox")
        .attr("width", 1)
        .attr("height", 1);

    // Randomize character set for variety from alohe/avatars (vibrent set 1-27)
    // We use a simple hash to make sure the same name always gets the same avatar
    patternEnter.append("image")
        .attr("xlink:href", d => {
            let hash = 0;
            for (let i = 0; i < d.id.length; i++) {
                hash = d.id.charCodeAt(i) + ((hash << 5) - hash);
            }
            const avatarId = (Math.abs(hash) % 27) + 1;
            return `https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${avatarId}.png`;
        })
        .attr("width", 80)
 // Larger than max radius * 2
        .attr("height", 80)
        .attr("preserveAspectRatio", "xMidYMid slice");

    // Update links
    link = link.data(links, d => `${d.source.id || d.source}-${d.target.id || d.target}`);
    link.exit().remove();
    link = link.enter().append("line")
        .attr("class", "link")
        .merge(link);

    // Update nodes
    node = node.data(nodes, d => d.id);
    node.exit().remove();

    const nodeEnter = node.enter().append("g")
        .attr("class", "node-group")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    nodeEnter.append("circle")
        .attr("class", "node")
        .attr("stroke", d => d3.schemeCategory10[Math.floor(Math.random() * 10)])
        .attr("stroke-width", 2);

    nodeEnter.append("text")
        .attr("dy", ".35em")
        .text(d => d.id);

    node = nodeEnter.merge(node);

    // Update visual properties for all nodes (both new and existing)
    node.select("circle")
        .transition().duration(500)
        .attr("r", d => radiusScale(degrees[d.id] || 0))
        .attr("fill", d => `url(#pattern-${d.id.replace(/\s+/g, "-")})`);

    // Ensure pattern image covers the circle correctly
    nodePatterns.select("image")
        .attr("width", d => radiusScale(degrees[d.id] || 0) * 2)
        .attr("height", d => radiusScale(degrees[d.id] || 0) * 2);

    node.select("text")
        .transition().duration(500)
        .attr("dx", d => radiusScale(degrees[d.id] || 0) + 5)
        .style("font-size", d => Math.max(12, Math.min(18, radiusScale(degrees[d.id] || 0) * 0.7)) + "px");

    // Update stats
    document.getElementById("node-count").innerText = `Nodes: ${nodes.length}`;
    document.getElementById("link-count").innerText = `Links: ${links.length}`;

    // Restart simulation
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
}

// Drag functionality
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Form Handling
const connectionForm = document.getElementById("connection-form");
connectionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userName = document.getElementById("user-name").value.trim();
    const connectionsInput = document.getElementById("connections").value.trim();

    if (!userName || !connectionsInput) return;

    const connectionNames = connectionsInput.split(",")
        .map(name => name.trim())
        .filter(name => name && name.toLowerCase() !== userName.toLowerCase());

    // Add User Node
    if (!nodes.find(n => n.id === userName)) {
        nodes.push({ id: userName });
    }

    // Add Connections
    connectionNames.forEach(name => {
        if (!nodes.find(n => n.id === name)) {
            nodes.push({ id: name });
        }

        // Add Link if it doesn't exist
        const linkExists = links.some(l => 
            (l.source === userName && l.target === name) || 
            (l.source === name && l.target === userName)
        );

        if (!linkExists) {
            links.push({ source: userName, target: name });
        }
    });

    updateGraph();
    
    // Switch to Graph View
    switchToGraph();
    
    // Clear form
    connectionForm.reset();
});

// View Switching Logic
const viewGraphBtn = document.getElementById("view-graph-btn");
const viewEntryBtn = document.getElementById("view-entry-btn");
const graphContainer = document.getElementById("graph-container");
const entryContainer = document.getElementById("entry-container");
const homeContainer = document.getElementById("home-container");
const startGameBtn = document.getElementById("start-game-btn");
const header = document.querySelector("header");

// Initial State: Hide header on home screen
header.classList.add("hidden");

// Generate QR Code
new QRCode(document.getElementById("qrcode"), {
    text: window.location.href,
    width: 180,
    height: 180,
    colorDark: "#020617",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});

function startGame() {
    homeContainer.classList.add("hidden");
    header.classList.remove("hidden");
    switchToGraph();
}

startGameBtn.addEventListener("click", startGame);

function switchToGraph() {
    graphContainer.classList.remove("hidden");
    entryContainer.classList.add("hidden");
    viewGraphBtn.classList.add("active");
    viewEntryBtn.classList.remove("active");
}

function switchToEntry() {
    graphContainer.classList.add("hidden");
    entryContainer.classList.remove("hidden");
    viewGraphBtn.classList.remove("active");
    viewEntryBtn.classList.add("active");
}

viewGraphBtn.addEventListener("click", switchToGraph);
viewEntryBtn.addEventListener("click", switchToEntry);

// Reset Zoom
document.getElementById("reset-zoom").addEventListener("click", () => {
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
    );
});

// Initial placeholder update
updateGraph();

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight - 80;
    svg.attr("width", newWidth).attr("height", newHeight);
    simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
    simulation.alpha(0.3).restart();
});
