import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  MarkerType,
  Controls,
  Background
} from 'reactflow';
import dagre from 'dagre';

import 'reactflow/dist/style.css';
import {IconButton} from "@mui/material";
import {KeyboardDoubleArrowUp, KeyboardDoubleArrowLeft} from "@mui/icons-material";

// const dagreGraph = new dagre.graphlib.Graph();
// dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 160;
const nodeHeight = 28;


export default function VisualizeKindOfs({id, fetchAPI}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const dagreGraph = useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    return dagreGraph;
  }, [id]);

  const getLayoutedElements = useCallback((nodes, edges, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({rankdir: direction});

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {width: nodeWidth, height: nodeHeight});
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? 'left' : 'top';
      node.sourcePosition = isHorizontal ? 'right' : 'bottom';

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return {nodes, edges};
  }, [dagreGraph]);


  useEffect(() => {
    (async function () {
      if (id) {
        const {data} = await fetchAPI();
        const newNodes = [];
        const newEdges = [];
        for (const [uri, {label, kindOf}] of Object.entries(data)) {
          newNodes.push({
            id: uri,
            data: {
              label
            },
            position: {x: 0, y: 0}
          });
          // self
          if (uri.split('_')[1] === id) {
            newNodes[newNodes.length - 1].style = {backgroundColor: '#ffe5da'}
          }
          for (const parent of kindOf) {
            newEdges.push({
              id: `${uri}->${parent}`, source: parent, target: uri, label: 'kindOf',
              markerStart: {
                type: MarkerType.ArrowClosed,
              },
            })
          }
        }

        const {nodes: layoutedNodes, edges: layoutedEdges} = getLayoutedElements(
          newNodes,
          newEdges
        );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
    })();
  }, [id, getLayoutedElements])

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({...params, type: ConnectionLineType.SmoothStep, animated: true}, eds)
      ),
    []
  );
  const onLayout = useCallback(
    (direction) => {
      const {nodes: layoutedNodes, edges: layoutedEdges} = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, getLayoutedElements]
  );

  return (
    <div style={{width: '100%', height: '40vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Panel position="top-right">
          <IconButton onClick={() => onLayout('TB')}>
            <KeyboardDoubleArrowUp/>
          </IconButton>
          <IconButton onClick={() => onLayout('LR')}>
            <KeyboardDoubleArrowLeft/>
          </IconButton>
        </Panel>
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};
