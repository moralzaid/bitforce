import React, { useState, useEffect } from 'react';
import TacticalPerimeterMap from '../components/command/TacticalPerimeterMap';
import NodeCard from '../components/engineering/NodeCard';
import { engineeringAPI } from '../services/api';
import { Compass, Cpu, Layers } from 'lucide-react';

export default function PerimeterSectorMapPage() {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const fetchNodes = async () => {
    try {
      const res = await engineeringAPI.getNodes();
      if (res.data?.success) {
        setNodes(res.data.data);
        if (res.data.data.length > 0 && !selectedNode) {
          setSelectedNode(res.data.data[3] || res.data.data[0]); // Default NODE-04
        }
      }
    } catch (err) {
      console.warn('Using local fallback for node map');
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  return (
    <div className="space-y-5 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
            Perimeter Sector Map & Mesh Node Grid
          </h1>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          24.2 KM BORDER FENCE
        </span>
      </div>

      <TacticalPerimeterMap
        selectedNodeId={selectedNode?.nodeId || 'NODE-04'}
        onSelectNode={(node) => {
          const matched = nodes.find((n) => n.nodeId === node.id);
          if (matched) setSelectedNode(matched);
        }}
      />

      {/* Grid of 12 Sector Nodes */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200">12 Solar LoRa Edge Node Telemetry</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {nodes.map((node) => (
            <NodeCard key={node.nodeId} node={node} onDiagnosed={fetchNodes} />
          ))}
        </div>
      </div>
    </div>
  );
}
