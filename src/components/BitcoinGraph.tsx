import React, { useEffect, useState, useCallback, useRef } from "react";
import Graph from "graphology";
import {
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { Typography, Box, CircularProgress, Button } from "@mui/material";

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  size?: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  color: string;
  label?: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const LoadGraph: React.FC<{ data: GraphData }> = ({ data }) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();

    for (const node of data.nodes) {
      if (!graph.hasNode(node.id)) {
        graph.addNode(node.id, {
          x: node.x,
          y: node.y,
          size: node.size ? Math.max(node.size / 20, 3) : 3,
          color: node.color,
          label: node.label,
        });
      }
    }

    for (const edge of data.edges) {
      if (
        graph.hasNode(edge.source) &&
        graph.hasNode(edge.target) &&
        !graph.hasEdge(edge.id)
      ) {
        graph.addEdge(edge.source, edge.target, {
          color: edge.color || "#ccc",
          size: 1,
        });
      }
    }

    loadGraph(graph);
  }, [data, loadGraph]);

  return null;
};

const HoverLabel: React.FC = () => {
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleEnterNode = useCallback(
    (event: { node: string }) => {
      setHoveredNode(sigma.getGraph().getNodeAttribute(event.node, "label"));
      sigma.getGraph().setNodeAttribute(event.node, "highlighted", true);
    },
    [sigma]
  );

  const handleLeaveNode = useCallback(
    (event: { node: string }) => {
      setHoveredNode(null);
      sigma.getGraph().setNodeAttribute(event.node, "highlighted", false);
    },
    [sigma]
  );

  useEffect(() => {
    registerEvents({
      enterNode: handleEnterNode,
      leaveNode: handleLeaveNode,
    });
  }, [registerEvents, handleEnterNode, handleLeaveNode]);

  if (!hoveredNode) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 8,
        left: 8,
        bgcolor: "rgba(0,0,0,0.8)",
        color: "#fff",
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        fontSize: "0.75rem",
        pointerEvents: "none",
        zIndex: 1,
        maxWidth: "80%",
        wordBreak: "break-all",
      }}
    >
      {hoveredNode}
    </Box>
  );
};

interface BitcoinGraphProps {
  dataFile: string;
  title?: string;
}

const BitcoinGraph: React.FC<BitcoinGraphProps> = ({ dataFile, title }) => {
  const [data, setData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activated, setActivated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only mount sigma when the element is in the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fetch data when first visible
  useEffect(() => {
    if (!visible || data || loading) return;

    setLoading(true);
    fetch(`/data/bitcoin/${dataFile}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${dataFile}`);
        return res.json();
      })
      .then((json: GraphData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [visible, data, loading, dataFile]);

  if (error) {
    return <Typography color="error">Error loading graph: {error}</Typography>;
  }

  const showGraph = visible && activated && data;

  return (
    <Box sx={{ my: 3 }} ref={containerRef}>
      {title && (
        <Typography variant="subtitle2" sx={{ mb: 1, fontStyle: "italic" }}>
          {title}
        </Typography>
      )}
      <Box
        sx={{
          height: 500,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 1,
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#000",
        }}
      >
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {data && !activated && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
              {data.nodes.length} nodes, {data.edges.length} edges
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setActivated(true)}
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            >
              Load Graph
            </Button>
          </Box>
        )}
        {showGraph && (
          <SigmaContainer
            style={{ height: "100%", width: "100%", backgroundColor: "#000" }}
            settings={{
              renderEdgeLabels: false,
              defaultEdgeType: "line",
              labelRenderedSizeThreshold: 12,
              labelFont: "Courier, monospace",
              labelColor: { color: "#fff" },
            }}
          >
            <LoadGraph data={data} />
            <HoverLabel />
          </SigmaContainer>
        )}
      </Box>
      {data && activated && (
        <Typography variant="caption" sx={{ mt: 0.5, display: "block", opacity: 0.6 }}>
          {data.nodes.length} nodes, {data.edges.length} edges — scroll to zoom,
          drag to pan, hover for details
        </Typography>
      )}
    </Box>
  );
};

export default BitcoinGraph;
