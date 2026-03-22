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

// Custom hover renderer: draws black text on white background instead of white-on-white
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customDrawNodeHover = (context: CanvasRenderingContext2D, data: any, settings: any) => {
  const size = settings.labelSize;
  const font = settings.labelFont;
  const weight = settings.labelWeight;
  context.font = `${weight} ${size}px ${font}`;

  context.fillStyle = "#FFF";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 8;
  context.shadowColor = "#000";

  const PADDING = 2;
  if (typeof data.label === "string") {
    const textWidth = context.measureText(data.label).width;
    const boxWidth = Math.round(textWidth + 5);
    const boxHeight = Math.round(size + 2 * PADDING);
    const radius = Math.max(data.size, size / 2) + PADDING;
    const angleRadian = Math.asin(boxHeight / 2 / radius);
    const xDeltaCoord = Math.sqrt(Math.abs(radius ** 2 - (boxHeight / 2) ** 2));
    context.beginPath();
    context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
    context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
    context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
    context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
    context.arc(data.x, data.y, radius, angleRadian, -angleRadian);
    context.closePath();
    context.fill();
  } else {
    context.beginPath();
    context.arc(data.x, data.y, data.size + PADDING, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }

  context.shadowBlur = 0;

  // Draw label with black text
  if (data.label) {
    context.fillStyle = "#000";
    context.font = `${weight} ${size}px ${font}`;
    context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
  }
};

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
          defaultDrawNodeHover: customDrawNodeHover,
        }}
      >
        <LoadGraph data={data} />
        <ClickHandler onClickNode={onSelectPost} />
      </SigmaContainer>
    </Box>
  );
};

export default NetworkGraph;
