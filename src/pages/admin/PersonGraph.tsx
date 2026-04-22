import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Graph, NodeData, EdgeData } from '@antv/g6';
import { Select, Checkbox, Dropdown, MenuProps, message, Input, Modal, Form } from 'antd';
import { useStore } from '../../store';

// Define the legend options and colors
const LEGEND_TYPES = [
  { label: '人员', value: 'person', color: '#1890ff', shape: 'circle' },
  { label: '房屋', value: 'house', color: '#52c41a', shape: 'rect' },
  { label: '纠纷', value: 'dispute', color: '#f5222d', shape: 'triangle' },
  { label: '地址', value: 'address', color: '#faad14', shape: 'diamond' },
  { label: '单位', value: 'unit', color: '#722ed1', shape: 'hexagon' },
  { label: '工单', value: 'order', color: '#eb2f96', shape: 'star' },
];

// Helper to format nodes
const formatNodes = (nodes: any[]): NodeData[] => {
  return nodes.map((n: any) => {
    const typeInfo = LEGEND_TYPES.find(t => t.value === n.type) || LEGEND_TYPES[0];
    
    // Check if it's a risk node (e.g., dispute, or explicitly marked as risk)
    const isRisk = n.type === 'dispute' || n.properties?.isRisk === true || n.properties?.status === 'danger' || n.properties?.warnLevel === 'high';
    
    return {
      ...n,
      id: String(n.id),
      data: {
        ...n,
        type: n.type,
      },
      type: typeInfo.shape,
      style: {
        fill: typeInfo.color,
        ...(isRisk ? {
          shadowColor: 'red',
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          stroke: 'red',
          lineWidth: 2,
        } : {})
      }
    };
  });
};

export default function PersonGraph() {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const graphRef = useRef<Graph | null>(null);
  const [layout, setLayout] = useState('force');
  const [visibleTypes, setVisibleTypes] = useState(LEGEND_TYPES.map(t => t.value));
  
  // Right click menu state
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: any | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

  const [searchText, setSearchText] = useState('');
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const selectedNodesRef = useRef<string[]>([]);
  const [isPathFinding, setIsPathFinding] = useState(false);
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [disputeFormNode, setDisputeFormNode] = useState<any>(null);
  const addDisputeRecord = useStore(state => state.addDisputeRecord);
  
  // Sync selectedNodes to ref for G6 event listeners
  useEffect(() => {
    selectedNodesRef.current = selectedNodes;
  }, [selectedNodes]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Graph
    const graph = new Graph({
      container: containerRef.current,
      autoFit: 'view',
      layout: {
        type: layout,
        preventOverlap: true,
        linkDistance: 150,
      },
      node: {
        style: {
          size: 40,
          labelText: (d: any) => d.data?.label || d.label,
          labelPlacement: 'bottom',
        },
        state: {
          highlight: {
            stroke: '#1890ff',
            lineWidth: 3,
            shadowColor: '#1890ff',
            shadowBlur: 10,
          },
          dim: {
            opacity: 0.2,
          },
          selected: {
            stroke: '#ff4d4f',
            lineWidth: 3,
            shadowColor: '#ff4d4f',
            shadowBlur: 10,
          },
        }
      },
      edge: {
        style: {
          labelText: (d: any) => d.data?.label || d.label,
          labelBackground: true,
          endArrow: true,
        },
        state: {
          highlight: {
            stroke: '#1890ff',
            lineWidth: 2,
          },
          dim: {
            opacity: 0.2,
          },
          selected: {
            stroke: '#ff4d4f',
            lineWidth: 2,
          },
        }
      },
      behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
      plugins: [
        {
          type: 'tooltip',
          trigger: 'hover',
          getContent: (e: any, items: any[]) => {
            const data = items[0]?.data || items[0];
            if (!data) return '';
            
            const props = data.properties || {};
            const typeLabel = LEGEND_TYPES.find(t => t.value === data.type)?.label || data.type || '未知';
            
            let html = `<div style="padding: 12px; min-width: 200px; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 4px;">
                ${data.label || data.id} <span style="font-size: 12px; color: #888;">(${typeLabel})</span>
              </h4>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 12px; line-height: 1.8;">`;
              
            // Custom fields based on type
            if (data.type === 'person') {
              html += `<li><strong>身份证号:</strong> ${props.idCard || '未知'}</li>`;
              html += `<li><strong>联系电话:</strong> ${props.phone || '未知'}</li>`;
              html += `<li><strong>人员类型:</strong> ${props.personType || '常住人口'}</li>`;
            } else if (data.type === 'house') {
              html += `<li><strong>房屋面积:</strong> ${props.area || 0} ㎡</li>`;
              html += `<li><strong>使用状态:</strong> ${props.status || '自住'}</li>`;
            } else if (data.type === 'dispute') {
              html += `<li><strong>纠纷等级:</strong> <span style="color: red;">${props.level || '高'}</span></li>`;
              html += `<li><strong>发生时间:</strong> ${props.date || '未知'}</li>`;
            } else if (data.type === 'unit') {
              html += `<li><strong>统一信用代码:</strong> ${props.creditCode || '未知'}</li>`;
              html += `<li><strong>法人代表:</strong> ${props.legalPerson || '未知'}</li>`;
            } else if (data.type === 'order') {
              html += `<li><strong>工单状态:</strong> ${props.status || '处理中'}</li>`;
              html += `<li><strong>预警级别:</strong> ${props.warnLevel || '一般'}</li>`;
            } else {
              for (const key in props) {
                if (props[key]) {
                  html += `<li><strong>${key}:</strong> ${props[key]}</li>`;
                }
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
          nodes: formatNodes(data.nodes),
          edges: data.edges.map((e: any): EdgeData => ({ 
            ...e, 
            source: String(e.source), 
            target: String(e.target),
            data: { ...e }
          })),
        });
        await graph.render();
      } catch (err) {
        console.error(err);
        message.error('加载图谱数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Event listeners
    graph.on('node:click', (e: any) => {
      const target = e.target;
      const nodeId = target?.id;
      if (!nodeId) return;

      if (e.originalEvent?.ctrlKey || e.originalEvent?.metaKey) {
        const currentSelected = selectedNodesRef.current;
        let newSelected = [...currentSelected];
        if (newSelected.includes(nodeId)) {
          newSelected = newSelected.filter(id => id !== nodeId);
        } else {
          if (newSelected.length >= 2) {
            newSelected.shift(); // keep max 2
          }
          newSelected.push(nodeId);
        }
        setSelectedNodes(newSelected);

        // Update selected state visually
        const allNodes = graph.getData().nodes?.map(n => n.id) || [];
        const stateObj: Record<string, string[]> = {};
        allNodes.forEach(id => {
          stateObj[id] = newSelected.includes(id) ? ['selected'] : [];
        });
        graph.setElementState(stateObj);
      }
    });

    graph.on('node:dblclick', async (e: any) => {
      const target = e.target;
      const nodeId = target?.id;
      if (!nodeId) return;
      
      try {
        const res = await fetch(`/api/graph/hop/${nodeId}`);
        if (!res.ok) throw new Error('Failed to fetch hop data');
        const newData = await res.json();
        
        const currentData = graph.getData();
        const currentNodesMap = new Map((currentData.nodes || []).map(n => [n.id, n]));
        const currentEdgesMap = new Map((currentData.edges || []).map(e => [e.source + '-' + e.target, e]));
        
        const nodesToAdd = formatNodes(newData.nodes || []).filter(n => !currentNodesMap.has(n.id));
        const edgesToAdd = (newData.edges || []).map((e: any): EdgeData => ({
          ...e,
          source: String(e.source),
          target: String(e.target),
          data: { ...e }
        })).filter((e: any) => !currentEdgesMap.has(e.source + '-' + e.target));
        
        if (nodesToAdd.length > 0 || edgesToAdd.length > 0) {
          graph.addData({
            nodes: nodesToAdd,
            edges: edgesToAdd
          });
          await graph.render();
          message.success(`成功扩展 ${nodesToAdd.length} 个节点，${edgesToAdd.length} 条连线`);
        } else {
          message.info('没有更多关联数据');
        }
      } catch (err) {
        console.error('扩展节点失败:', err);
        message.error('扩展节点失败');
      }
    });

    graph.on('node:contextmenu', (e: any) => {
      e.originalEvent?.preventDefault();
      e.preventDefault();
      
      const target = e.target;
      const nodeId = target?.id;
      if (!nodeId) return;
      
      // Get the full node data from the graph
      const nodeData = graph.getNodeData(nodeId);
      
      const { clientX, clientY } = e.originalEvent || e;
      
      setMenuState({
        visible: true,
        x: clientX,
        y: clientY,
        node: nodeData,
      });
    });

    graph.on('canvas:click', () => {
      setMenuState(prev => ({ ...prev, visible: false }));
    });

    return () => {
      if (graphRef.current) {
        graphRef.current.destroy();
      }
    };
  }, [id]);

  // Update layout when changed
  useEffect(() => {
    if (!graphRef.current) return;
    const graph = graphRef.current;
    
    // If layout hasn't changed, ignore. G6 handles layout update via updateLayout or setOptions
    // Wait, in G6 v5 we can do:
    const update = async () => {
      // @ts-ignore
      graph.setOptions({ layout: { type: layout } });
      await graph.render();
    };
    update();
  }, [layout]);

  // Filter nodes by legend
  useEffect(() => {
    if (!graphRef.current) return;
    
    const graph = graphRef.current;
    const data = graph.getData();
    if (!data || !data.nodes) return;
    
    const nodes = data.nodes;
    const hiddenNodes: string[] = [];
    const visibleNodes: string[] = [];
    
    nodes.forEach(node => {
      const type = (node.data?.type || node.type) as string;
      if (visibleTypes.includes(type)) {
        visibleNodes.push(node.id);
      } else {
        hiddenNodes.push(node.id);
      }
    });
    
    const updateVisibility = async () => {
      if (hiddenNodes.length > 0) {
        await graph.hideElement(hiddenNodes);
      }
      if (visibleNodes.length > 0) {
        await graph.showElement(visibleNodes);
      }
    };
    
    updateVisibility();
    
  }, [visibleTypes]);

  const handleSearch = (value: string) => {
    if (!graphRef.current) return;
    const graph = graphRef.current;
    const data = graph.getData();
    if (!data.nodes) return;

    if (!value.trim()) {
      handleReset();
      return;
    }

    const stateObj: Record<string, string[]> = {};
    const keyword = value.toLowerCase();

    data.nodes.forEach(n => {
      let isMatch = false;
      if (String(n.data?.label || n.label).toLowerCase().includes(keyword)) {
        isMatch = true;
      } else {
        const props = (n.data?.properties || n.properties || {}) as Record<string, any>;
        for (const key in props) {
          if (String(props[key]).toLowerCase().includes(keyword)) {
            isMatch = true;
            break;
          }
        }
      }
      stateObj[n.id] = isMatch ? ['highlight'] : ['dim'];
    });

    data.edges?.forEach(e => {
      const edgeId = e.id || (e.source + '-' + e.target);
      stateObj[edgeId as string] = ['dim'];
    });

    graph.setElementState(stateObj);
  };

  const bfsShortestPath = (nodes: any[], edges: any[], sourceId: string, targetId: string) => {
    const adj = new Map<string, string[]>();

    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      const s = String(e.source);
      const t = String(e.target);
      if (adj.has(s)) adj.get(s)!.push(t);
      if (adj.has(t)) adj.get(t)!.push(s);
    });

    const queue: string[][] = [[sourceId]];
    const visited = new Set([sourceId]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const node = path[path.length - 1];

      if (node === targetId) return path;

      const neighbors = adj.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }
    return null;
  };

  const handleFindPath = () => {
    if (!graphRef.current || selectedNodes.length !== 2) {
      message.warning('请使用 Ctrl/Cmd + 点击 选中两个节点');
      return;
    }
    
    const graph = graphRef.current;
    const data = graph.getData();
    if (!data.nodes || !data.edges) return;

    const path = bfsShortestPath(data.nodes, data.edges, selectedNodes[0], selectedNodes[1]);

    if (!path) {
      message.info('两节点之间不存在路径');
      return;
    }

    const pathNodes = new Set(path);
    const pathEdges = new Set();
    for (let i = 0; i < path.length - 1; i++) {
      pathEdges.add(`${path[i]}-${path[i+1]}`);
      pathEdges.add(`${path[i+1]}-${path[i]}`);
    }

    const stateObj: Record<string, string[]> = {};
    data.nodes.forEach(n => {
      if (pathNodes.has(n.id)) {
        stateObj[n.id] = ['highlight'];
      } else {
        stateObj[n.id] = ['dim'];
      }
    });

    data.edges.forEach(e => {
      const s = String(e.source);
      const t = String(e.target);
      const edgeId = e.id || (e.source + '-' + e.target);
      if (pathEdges.has(`${s}-${t}`)) {
        stateObj[edgeId as string] = ['highlight'];
      } else {
        stateObj[edgeId as string] = ['dim'];
      }
    });

    graph.setElementState(stateObj);
    setIsPathFinding(true);
  };

  const handleReset = () => {
    if (!graphRef.current) return;
    setSearchText('');
    setSelectedNodes([]);
    setIsPathFinding(false);
    
    const graph = graphRef.current;
    const data = graph.getData();
    const stateObj: Record<string, string[]> = {};
    data.nodes?.forEach(n => stateObj[n.id] = []);
    data.edges?.forEach(e => {
      const edgeId = e.id || (e.source + '-' + e.target);
      stateObj[edgeId as string] = [];
    });
    graph.setElementState(stateObj);
  };

  const getMenuItems = (): MenuProps['items'] => {
    const node = menuState.node;
    if (!node) return [];
    
    const type = node.data?.type || node.type;
    
    const items: MenuProps['items'] = [
      {
        key: 'detail',
        label: `查看${LEGEND_TYPES.find(t => t.value === type)?.label || ''}详情`,
        onClick: () => {
          message.info(`即将跳转到详情页: ${node.data?.label || node.id}`);
          if (type === 'person') {
            navigate('/admin/population');
          } else if (type === 'house') {
            navigate('/admin/house');
          } else if (type === 'dispute') {
            navigate('/admin/dispute');
          } else if (type === 'unit') {
            navigate('/admin/unit');
          } else {
            navigate('/admin');
          }
          setMenuState(prev => ({ ...prev, visible: false }));
        }
      }
    ];
    
    if (type === 'person') {
      items.push({
        key: 'add-dispute',
        label: '新增纠纷记录',
        onClick: () => {
          setDisputeFormNode(node);
          setDisputeModalVisible(true);
          setMenuState(prev => ({ ...prev, visible: false }));
        }
      });
    } else if (type === 'house') {
      items.push({
        key: 'view-residents',
        label: '查看居住人员',
        onClick: () => {
          message.info('正在查询居住人员...');
          setMenuState(prev => ({ ...prev, visible: false }));
        }
      });
    }
    
    items.push(
      { type: 'divider' },
      {
        key: 'expand',
        label: '扩展关联节点',
        onClick: async () => {
          setMenuState(prev => ({ ...prev, visible: false }));
          const nodeId = node.id;
          if (!nodeId) return;
          try {
            const res = await fetch(`/api/graph/hop/${nodeId}`);
            if (!res.ok) throw new Error('Failed to fetch hop data');
            const newData = await res.json();
            
            const currentData = graphRef.current!.getData();
            const currentNodesMap = new Map((currentData.nodes || []).map(n => [n.id, n]));
            const currentEdgesMap = new Map((currentData.edges || []).map(e => [e.source + '-' + e.target, e]));
            
            const nodesToAdd = formatNodes(newData.nodes || []).filter(n => !currentNodesMap.has(n.id));
            const edgesToAdd = (newData.edges || []).map((e: any): EdgeData => ({
              ...e,
              source: String(e.source),
              target: String(e.target),
              data: { ...e }
            })).filter((e: any) => !currentEdgesMap.has(e.source + '-' + e.target));
            
            if (nodesToAdd.length > 0 || edgesToAdd.length > 0) {
              graphRef.current!.addData({
                nodes: nodesToAdd,
                edges: edgesToAdd
              });
              await graphRef.current!.render();
              message.success(`成功扩展 ${nodesToAdd.length} 个节点，${edgesToAdd.length} 条连线`);
            } else {
              message.info('没有更多关联数据');
            }
          } catch (err) {
            console.error('扩展节点失败:', err);
            message.error('扩展节点失败');
          }
        }
      }
    );
    
    return items;
  };

  const [disputeForm] = Form.useForm();

  const handleAddDispute = async () => {
    try {
      const values = await disputeForm.validateFields();
      
      const newDisputeId = Date.now();
      await addDisputeRecord({
        id: newDisputeId,
        title: values.title,
        type: values.type,
        content: values.content,
        status: '处理中',
      });
      
      message.success('纠纷记录新增成功');
      
      // Add node and edge to graph
      if (graphRef.current && disputeFormNode) {
        const graph = graphRef.current;
        const newDisputeNode = {
          id: `dispute-${newDisputeId}`,
          type: 'dispute',
          label: values.title,
          properties: {
            level: '高',
            date: new Date().toISOString().split('T')[0]
          }
        };
        
        const newEdge = {
          source: disputeFormNode.id,
          target: `dispute-${newDisputeId}`,
          label: '涉事'
        };
        
        const formattedNodes = formatNodes([newDisputeNode]);
        
        graph.addData({
          nodes: formattedNodes,
          edges: [{
            ...newEdge,
            source: String(newEdge.source),
            target: String(newEdge.target),
            data: { ...newEdge }
          }]
        });
        
        await graph.render();
      }
      
      setDisputeModalVisible(false);
      disputeForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-bold">人员关系图谱</h1>
          
          <div className="flex items-center gap-2 ml-4 bg-white p-2 rounded shadow-sm border border-gray-200">
            <Input.Search 
              placeholder="在图谱内搜索..." 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 200 }}
              allowClear
            />
            
            <button
              onClick={handleFindPath}
              className={`px-3 py-1 rounded text-sm text-white ${selectedNodes.length === 2 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={selectedNodes.length !== 2}
            >
              关系探路
            </button>
            
            <button
              onClick={handleReset}
              className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
            >
              清除探路/检索
            </button>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <span className="text-gray-600 text-sm">布局方式:</span>
            <Select 
              value={layout} 
              onChange={setLayout}
              style={{ width: 150 }}
              options={[
                { value: 'force', label: '力导向 (Force)' },
                { value: 'concentric', label: '同心圆 (Concentric)' },
                { value: 'circular', label: '环形 (Circular)' },
                { value: 'grid', label: '网格 (Grid)' },
              ]}
            />
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 shrink-0 ml-4"
        >
          返回
        </button>
      </div>
      
      <div className="mb-4 p-4 bg-white rounded-lg shadow border border-gray-200">
        <div className="font-medium mb-2 text-sm text-gray-700">图例过滤</div>
        <Checkbox.Group 
          value={visibleTypes} 
          onChange={(checkedValues) => setVisibleTypes(checkedValues as string[])}
          className="flex flex-wrap gap-6"
        >
          {LEGEND_TYPES.map(type => (
            <Checkbox key={type.value} value={type.value}>
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 inline-block rounded-sm" 
                  style={{ backgroundColor: type.color }}
                ></span>
                {type.label}
              </div>
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
        
        {menuState.visible && (
          <div 
            style={{ 
              position: 'fixed', 
              left: menuState.x, 
              top: menuState.y, 
              zIndex: 1000 
            }}
          >
            <Dropdown 
              menu={{ items: getMenuItems() }} 
              open={menuState.visible}
              onOpenChange={(open) => !open && setMenuState(prev => ({ ...prev, visible: false }))}
            >
              <div style={{ width: 1, height: 1 }} />
            </Dropdown>
          </div>
        )}
      </div>
      
      <Modal
        title={`为 ${disputeFormNode?.data?.label || disputeFormNode?.id} 新增纠纷记录`}
        open={disputeModalVisible}
        onOk={handleAddDispute}
        onCancel={() => {
          setDisputeModalVisible(false);
          disputeForm.resetFields();
        }}
        okText="确认新增"
        cancelText="取消"
      >
        <Form form={disputeForm} layout="vertical">
          <Form.Item
            name="title"
            label="纠纷标题"
            rules={[{ required: true, message: '请输入纠纷标题' }]}
          >
            <Input placeholder="请输入纠纷标题" />
          </Form.Item>
          <Form.Item
            name="type"
            label="纠纷类型"
            rules={[{ required: true, message: '请选择纠纷类型' }]}
          >
            <Select
              options={[
                { value: '邻里纠纷', label: '邻里纠纷' },
                { value: '物业纠纷', label: '物业纠纷' },
                { value: '家庭纠纷', label: '家庭纠纷' },
                { value: '劳资纠纷', label: '劳资纠纷' },
              ]}
              placeholder="请选择纠纷类型"
            />
          </Form.Item>
          <Form.Item
            name="content"
            label="详细描述"
            rules={[{ required: true, message: '请输入纠纷详细描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入详细描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
