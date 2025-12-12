import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NeighborData } from '../types';

const WaterGridMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<NeighborData | null>(null);

  // Generate mock neighborhood data
  const generateData = (): NeighborData[] => {
    const data: NeighborData[] = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        id: `house-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        pressure: Math.random() > 0.9 ? 45 : 65 + Math.random() * 10, // Some low pressure
        status: 'normal'
      });
    }
    return data;
  };

  const [data, setData] = useState<NeighborData[]>([]);

  useEffect(() => {
    setData(generateData());
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const width = svgRef.current.clientWidth;
    const height = 400;

    const xScale = d3.scaleLinear().domain([0, 100]).range([20, width - 20]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([20, height - 20]);

    // Draw connecting lines (The "Grid")
    // Simple Delaunay triangulation for visual connections
    const delaunay = d3.Delaunay.from(data, d => xScale(d.x), d => yScale(d.y));
    const { points, triangles } = delaunay;
    
    // Draw paths
    let pathData = "";
    for (let i = 0; i < triangles.length; i += 3) {
        const t0 = triangles[i] * 2;
        const t1 = triangles[i + 1] * 2;
        const t2 = triangles[i + 2] * 2;
        pathData += `M${points[t0]},${points[t0 + 1]}L${points[t1]},${points[t1 + 1]}L${points[t2]},${points[t2 + 1]}Z`;
    }

    svg.append("path")
       .attr("d", pathData)
       .attr("fill", "none")
       .attr("stroke", "#1e293b")
       .attr("stroke-width", 1);

    // Draw Nodes
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", (d) => d.pressure < 50 ? 8 : 4)
      .attr("fill", (d) => d.pressure < 50 ? "#ef4444" : "#0ea5e9")
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 12);
        setSelectedNode(d);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("r", d.pressure < 50 ? 8 : 4);
        setSelectedNode(null);
      });

    // Add pulse animation to critical nodes
    const criticalNodes = data.filter(d => d.pressure < 50);
    if(criticalNodes.length > 0) {
        // Just a visual indicator that logic detected "Main Line Break"
    }

  }, [data]);

  return (
    <div className="w-full relative">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur p-3 rounded-lg border border-slate-700">
        <h3 className="text-sm font-bold text-slate-200">Municipal Pressure Grid</h3>
        <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-sky-500"></div>
            <span className="text-xs text-slate-400">Normal (65-75 psi)</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs text-red-400">Pressure Drop Detected</span>
        </div>
      </div>

      <svg ref={svgRef} className="w-full h-[400px] bg-slate-900 rounded-xl border border-slate-800 shadow-inner" />

      {selectedNode && (
         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl text-center min-w-[200px]">
            <p className="text-xs text-slate-400">Sensor ID: {selectedNode.id}</p>
            <p className="text-lg font-bold text-white">{selectedNode.pressure.toFixed(1)} PSI</p>
            <p className={`text-xs font-semibold ${selectedNode.pressure < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                {selectedNode.pressure < 50 ? 'POSSIBLE LEAK / BREAK' : 'OPTIMAL FLOW'}
            </p>
         </div>
      )}
    </div>
  );
};

export default WaterGridMap;