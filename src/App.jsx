import React, {useState, useEffect, useRef} from "react"
import * as d3 from "d3"
import {QRCodeSVG} from "qrcode.react"
import {addUserConnections, subscribeToGraph, clearAllData} from "./firebaseService"

const App = () => {
	const [view, setView] = useState("home")
	const [graphData, setGraphData] = useState({nodes: [], links: []})
	const [loading, setLoading] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	useEffect(() => {
		const unsubscribe = subscribeToGraph((data) => {
			setGraphData({
				nodes: Array.isArray(data.nodes) ? [...data.nodes] : [],
				links: Array.isArray(data.links) ? [...data.links] : [],
			})
		})
		return () => unsubscribe()
	}, [])

	const handleViewChange = (newView) => {
		setView(newView)
		setIsMenuOpen(false)
	}

	const handleAddConnections = async (userName, connectionNames) => {
		try {
			setLoading(true)
			await addUserConnections(userName, connectionNames)
			setView("graph")
		} catch (err) {
			alert("Error adding connections.")
		} finally {
			setLoading(false)
		}
	}

	const handleReset = async () => {
		try {
			setLoading(true)
			await clearAllData()
		} catch (err) {
			alert("Error resetting data.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="fixed inset-0 flex flex-col bg-slate-900 text-slate-100 overflow-hidden h-[100dvh]">
			{/* Optimized Header */}
			<header className="bg-gradient-to-r from-indigo-900 to-purple-900 px-4 md:px-12 py-3 md:py-5 flex justify-between items-center shadow-2xl z-[300] flex-shrink-0 relative">
				<h1
					className="text-xl md:text-2xl font-semibold tracking-tighter cursor-pointer select-none"
					onClick={() => setView("home")}>
					LinkedYet?
				</h1>

				{/* Desktop Navigation - Strictly for Large Screens (md+) */}
				<nav className="hidden  md:flex  items-center gap-4">
					<button
						className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${view === "graph" ? "bg-white text-indigo-600 border-white shadow-lg" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}
						onClick={() => handleViewChange("graph")}>
						Live Network
					</button>
					<button
						className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${view === "entry" ? "bg-white text-indigo-600 border-white shadow-lg" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}
						onClick={() => handleViewChange("entry")}>
						Add Connections
					</button>
				</nav>

				{/* Mobile Hamburger Button - Strictly for Small Screens (< md) */}
				<button
					className="md:hidden p-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors focus:outline-none"
					onClick={() => setIsMenuOpen(!isMenuOpen)}>
					<div className="w-6 h-5 relative flex flex-col justify-between">
						<span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
						<span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
						<span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
					</div>
				</button>

				{/* Mobile Dropdown Menu - Strictly for Small Screens (< md) */}
				<div className={`md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-2xl transition-all duration-300 ease-in-out transform z-[400] ${isMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
					<div className="flex flex-col p-4 gap-3">
						<button
							className={`w-full py-4 px-6 rounded-2xl font-semibold text-left transition-all ${view === "graph" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-300 bg-slate-800/50 hover:bg-slate-800"}`}
							onClick={() => handleViewChange("graph")}>
							Live Network
						</button>
						<button
							className={`w-full py-4 px-6 rounded-2xl font-semibold text-left transition-all ${view === "entry" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-300 bg-slate-800/50 hover:bg-slate-800"}`}
							onClick={() => handleViewChange("entry")}>
							Add Connections
						</button>
					</div>
				</div>
			</header>

			<main className="flex-1 relative overflow-hidden w-full flex flex-col">
				{loading && (
					<div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center text-center p-4">
						<div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-slate-200/20 border-l-indigo-500 rounded-full animate-spin-custom mb-4"></div>
						<p className="font-semibold tracking-widest text-xs sm:text-sm uppercase">Syncing Network...</p>
					</div>
				)}

				{/* Home Screen */}
				<div className={`flex bg-none z-[200] justify-center items-center p-4 ${view !== "home" ? "hidden" : ""}`}>
					<div className="text-center w-full max-w-xl p-6 sm:p-16 bg-purple-850 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] border border-white/10 shadow-2xl overflow-y-auto max-h-full">
						<h1 className="text-4xl sm:text-6xl font-semibold mb-4 text-blue-50 tracking-tight">LinkedYet?</h1>
						<p className="text-base sm:text-lg text-slate-400 mb-8 leading-relaxed text-center">Visualize connections in real-time.</p>
						{/* <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl inline-block shadow-2xl mb-8">
							<QRCodeSVG
								value={window.location.href}
								size={120}
							/>
						</div> */}
						<br />
						<button
							className="w-full sm:w-auto bg-white text-indigo-950 px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
							onClick={() => handleViewChange("graph")}>
							Start Connecting
						</button>
					</div>
				</div>

				{/* Live Graph View */}
				<div className={`flex h-full flex-col ${view === "graph" ? "z-10" : "hidden z-0"}`}>
					{graphData.nodes.length > 0 ? (
						<div className="flex-1 relative overflow-hidden flex flex-col w-full h-full">
							<NetworkGraph data={graphData} />

							{/* Responsive Controls */}
							<div className="absolute bottom-6 left-4 right-4 sm:right-auto sm:left-10 bg-slate-800/90 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-700 shadow-2xl flex flex-row items-center justify-between sm:justify-start gap-4 sm:gap-10 z-50">
								<button
									className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
									onClick={handleReset}
									disabled={loading}>
									Reset
								</button>
								<div className="text-[10px] sm:text-sm font-medium text-slate-300 flex gap-3 items-center">
									<span>
										Nodes: <b className="text-indigo-400">{graphData.nodes.length}</b>
									</span>
									<span className="opacity-30">|</span>
									<span>
										Links: <b className="text-indigo-400">{graphData.links.length}</b>
									</span>
								</div>
							</div>
						</div>
					) : (
						<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
							<p className="text-slate-400 text-lg mb-6 max-w-[280px]">Networking is just like Wi-Fi. It is invisible until you connect! Start the first link.</p>
							<button
								className="text-indigo-400 font-semibold border-b-2 border-indigo-400/30 hover:text-indigo-300 transition-colors"
								onClick={() => handleViewChange("entry")}>
								Add your first connection
							</button>
						</div>
					)}
				</div>

				{/* Entry View */}
				<div className={`flex justify-center items-center backdrop-blur-md p-4 ${view === "entry" ? "z-10" : "hidden z-0"}`}>
					<div className="bg-slate-800 p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[2rem] w-full max-w-lg border border-slate-700 shadow-2xl overflow-y-auto max-h-full">
						<h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-white tracking-tight">Add Connections</h2>
						<EntryForm
							onAdd={handleAddConnections}
							disabled={loading}
						/>
					</div>
				</div>
			</main>
		</div>
	)
}

const NetworkGraph = ({data}) => {
	const svgRef = useRef()
	const gRef = useRef()
	const defsRef = useRef()
	const containerRef = useRef()
	const [dimensions, setDimensions] = useState({width: 0, height: 0})

	// Use ResizeObserver for accurate container sizing
	useEffect(() => {
		if (!containerRef.current) return

		const observer = new ResizeObserver((entries) => {
			if (entries[0]) {
				const {width, height} = entries[0].contentRect
				setDimensions({width, height})
			}
		})

		observer.observe(containerRef.current)
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		if (dimensions.width === 0 || dimensions.height === 0) return

		const svg = d3.select(svgRef.current)
		const g = d3.select(gRef.current)
		const defs = d3.select(defsRef.current)

		g.selectAll("*").remove()
		defs.selectAll("*").remove()

		if (!data || !data.nodes || data.nodes.length === 0) return

		const {width, height} = dimensions
		const nodes = data.nodes.map((d) => ({...d}))
		const links = data.links.map((d) => ({...d}))

		const degrees = {}
		nodes.forEach((n) => (degrees[n.id] = 0))
		links.forEach((l) => {
			degrees[l.source] = (degrees[l.source] || 0) + 1
			degrees[l.target] = (degrees[l.target] || 0) + 1
		})

		const isMobile = width < 640
		const radiusScale = d3
			.scaleSqrt()
			.domain([0, d3.max(Object.values(degrees)) || 1])
			.range(isMobile ? [12, 28] : [22, 55])

		const avatarMap = {}
		nodes.forEach((node, i) => {
			const uniqueAvatarId = (i % 27) + 1
			avatarMap[node.id] = uniqueAvatarId
		})

		nodes.forEach((node) => {
			const avatarId = avatarMap[node.id]
			const r = radiusScale(degrees[node.id])

			defs
				.append("pattern")
				.attr("id", `pattern-${node.id.replace(/\s+/g, "-")}`)
				.attr("patternUnits", "objectBoundingBox")
				.attr("width", 1)
				.attr("height", 1)
				.append("image")
				.attr("xlink:href", `https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${avatarId}.png`)
				.attr("width", r * 2)
				.attr("height", r * 2)
				.attr("preserveAspectRatio", "xMidYMid slice")
		})

		const simulation = d3
			.forceSimulation(nodes)
			.force(
				"link",
				d3
					.forceLink(links)
					.id((d) => d.id)
					.distance(isMobile ? 80 : 160),
			)
			.force("charge", d3.forceManyBody().strength(isMobile ? -150 : -500))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force(
				"collision",
				d3.forceCollide().radius((d) => radiusScale(degrees[d.id]) + 5),
			)

		const link = g
			.append("g")
			.selectAll("line")
			.data(links)
			.enter()
			.append("line")
			.attr("stroke", "#475569")
			.attr("stroke-opacity", 0.5)
			.attr("stroke-width", isMobile ? 1 : 2)

		const nodeGroup = g
			.append("g")
			.selectAll("g")
			.data(nodes)
			.enter()
			.append("g")
			.call(
				d3
					.drag()
					.on("start", (event, d) => {
						if (!event.active) simulation.alphaTarget(0.3).restart()
						d.fx = d.x
						d.fy = d.y
					})
					.on("drag", (event, d) => {
						d.fx = event.x
						d.fy = event.y
					})
					.on("end", (event, d) => {
						if (!event.active) simulation.alphaTarget(0)
						d.fx = null
						d.fy = null
					}),
			)

		nodeGroup
			.append("circle")
			.attr("r", (d) => radiusScale(degrees[d.id]))
			.attr("fill", (d) => `url(#pattern-${d.id.replace(/\s+/g, "-")})`)
			.attr("stroke", (d, i) => d3.schemeTableau10[i % 10])
			.attr("stroke-width", isMobile ? 1.5 : 3)

		nodeGroup
			.append("text")
			.attr("fill", "white")
			.attr("font-weight", 700)
			.attr("font-size", isMobile ? "9px" : "13px")
			.attr("text-anchor", "middle")
			.attr("dy", (d) => radiusScale(degrees[d.id]) + (isMobile ? 10 : 18))
			.style("text-shadow", "0 1px 2px rgba(0,0,0,0.8)")
			.text((d) => d.id)

		simulation.on("tick", () => {
			nodes.forEach((d) => {
				const r = radiusScale(degrees[d.id])
				d.x = Math.max(r, Math.min(width - r, d.x))
				d.y = Math.max(r, Math.min(height - r, d.y))
			})

			link
				.attr("x1", (d) => d.source.x)
				.attr("y1", (d) => d.source.y)
				.attr("x2", (d) => d.target.x)
				.attr("y2", (d) => d.target.y)
			nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`)
		})

		const zoom = d3
			.zoom()
			.scaleExtent([0.1, 8])
			.on("zoom", (e) => g.attr("transform", e.transform))
		svg.call(zoom)

		return () => simulation.stop()
	}, [data, dimensions])

	return (
		<div
			ref={containerRef}
			className="w-full h-full bg-slate-900 bg-[radial-gradient(#334155_0.5px,transparent_0.5px)] [background-size:24px_24px]">
			<svg
				ref={svgRef}
				className="w-full h-full">
				<defs ref={defsRef}></defs>
				<g ref={gRef}></g>
			</svg>
		</div>
	)
}

const EntryForm = ({onAdd, disabled}) => {
	const [name, setName] = useState("")
	const [connections, setConnections] = useState("")

	const handleSubmit = (e) => {
		e.preventDefault()
		if (!name.trim() || !connections.trim()) return
		const connArray = connections
			.split(",")
			.map((c) => c.trim())
			.filter((c) => c && c.toLowerCase() !== name.toLowerCase())
		onAdd(name.trim(), connArray)
		setName("")
		setConnections("")
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 sm:space-y-6 text-left">
			<div className="space-y-1 sm:space-y-2">
				<label className="block text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-400">Your Name</label>
				<input
					type="text"
					placeholder="Who are you?"
					className="w-full p-3 sm:p-4 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-white text-sm sm:text-base"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					disabled={disabled}
				/>
			</div>
			<div className="space-y-1 sm:space-y-2">
				<label className="block text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-400">Who did you connect with?</label>
				<textarea
					placeholder="Names (comma separated)"
					className="w-full p-3 sm:p-4 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-white h-24 sm:h-32 text-sm sm:text-base"
					value={connections}
					onChange={(e) => setConnections(e.target.value)}
					required
					disabled={disabled}
				/>
			</div>
			<button
				type="submit"
				className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white p-4 sm:p-5 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-xl disabled:opacity-50"
				disabled={disabled}>
				{disabled ? "Saving..." : "Register Connections"}
			</button>
		</form>
	)
}

export default App
