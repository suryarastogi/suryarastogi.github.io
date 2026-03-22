import React, { useEffect, useState, useCallback } from "react";
import Graph from "graphology";
import {
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { Box, CircularProgress } from "@mui/material";

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  color: string;
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
          size: node.size || 10,
          color: node.color,
          label: node.label,
        });
      }
    }

    for (const edge of data.edges) {
      if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
        graph.addEdge(edge.source, edge.target, {
          color: edge.color || "#555",
          size: 2,
        });
      }
    }

    loadGraph(graph);
  }, [data, loadGraph]);

  return null;
};

interface ClickHandlerProps {
  onClickNode: (nodeId: string) => void;
}

const ClickHandler: React.FC<ClickHandlerProps> = ({ onClickNode }) => {
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  const handleEnterNode = useCallback(() => {
    const container = sigma.getContainer();
    container.style.cursor = "pointer";
  }, [sigma]);

  const handleLeaveNode = useCallback(() => {
    const container = sigma.getContainer();
    container.style.cursor = "default";
  }, [sigma]);

  const handleClickNode = useCallback(
    (event: { node: string }) => {
      onClickNode(event.node);
    },
    [onClickNode]
  );

  useEffect(() => {
    registerEvents({
      enterNode: handleEnterNode,
      leaveNode: handleLeaveNode,
      clickNode: handleClickNode,
    });
  }, [registerEvents, handleEnterNode, handleLeaveNode, handleClickNode]);

  return null;
};

interface NetworkGraphProps {
  onSelectPost: (postName: string) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ onSelectPost }) => {
  const [data, setData] = useState<GraphData | null>(null);

  useEffect(() => {
    fetch("/data/network.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error loading network graph:", err));
  }, []);

  if (!data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 300,
        mb: 2,
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 1,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <SigmaContainer
        style={{ height: "100%", width: "100%", backgroundColor: "#000" }}
        settings={{
          renderEdgeLabels: false,
          defaultEdgeType: "line",
          labelRenderedSizeThreshold: 0,
          labelFont: "Courier, monospace",
          labelSize: 14,
          labelColor: { color: "#fff" },
        }}
      >
        <LoadGraph data={data} />
        <ClickHandler onClickNode={onSelectPost} />
      </SigmaContainer>
    </Box>
  );
};

export default NetworkGraph;
