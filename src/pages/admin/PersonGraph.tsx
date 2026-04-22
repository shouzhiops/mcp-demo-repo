import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Graph } from '@antv/g6';

export default function PersonGraph() {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Graph
    const graph = new Graph({
      container: containerRef.current,
      autoFit: 'view',
      layout: {
        type: 'force',
        preventOverlap: true,
        linkDistance: 150,
      },
      node: {
        style: {
          size: 40,
          labelText: (d: any) => d.label,
          labelPlacement: 'bottom',
        }
      },
      edge: {
        style: {
          labelText: (d: any) => d.label,
          labelBackground: true,
          endArrow: true,
        },
      },
      behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
      plugins: [
        {
          type: 'tooltip',
          trigger: 'hover',
          getContent: (e: any, items: any) => {
            const model = items[0]?.model;
            if (!model) return '';
            const props = model.properties || {};
            let html = `<div style="padding: 8px;"><h4>${model.label} (${model.type})</h4><ul>`;
            for (const key in props) {
              if (props[key]) {
                html += `<li><strong>${key}:</strong> ${props[key]}</li>`;
              }
            }
            html += `</ul></div>`;
            return html;
          },
        },
      ],
    });

    graphRef.current = graph;

    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/graph/person/${id}`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        
        await graph.setData({
          nodes: data.nodes.map((n: any) => {
            const colors: Record<string, string> = {
              person: '#1890ff',
              house: '#52c41a',
              dispute: '#f5222d',
              address: '#faad14'
            };
            const shapes: Record<string, string> = {
              person: 'circle',
              house: 'rect',
              dispute: 'triangle',
              address: 'diamond'
            };
            return {
              ...n,
              id: String(n.id),
              type: shapes[n.type] || 'circle',
              style: {
                fill: colors[n.type] || '#ccc',
              }
            };
          }),
          edges: data.edges.map((e: any) => ({ ...e, source: String(e.source), target: String(e.target) })),
        });
        await graph.render();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      if (graphRef.current) {
        graphRef.current.destroy();
      }
    };
  }, [id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">人员关系图谱</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          返回
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow border border-gray-200 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
      </div>
    </div>
  );
}
