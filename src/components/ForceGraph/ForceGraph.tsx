import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  group: number;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
  isFavorite?: boolean;
  backlinks?: string[];
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

interface ForceGraphProps {
  graphData: { nodes: GraphNode[]; links: GraphLink[] };
  nodeLabel?: string;
  nodeColor?: (node: GraphNode) => string;
  nodeVal?: (node: GraphNode) => number;
  linkColor?: string;
  linkWidth?: number;
  onNodeClick?: (node: GraphNode) => void;
  onNodeHover?: (node: GraphNode | null) => void;
  height?: number;
  width?: number;
  backgroundColor?: string;
}

export const ForceGraph: React.FC<ForceGraphProps> = ({
  graphData,
  nodeColor = () => '#4F46E5',
  nodeVal = () => 5,
  linkColor = 'rgba(139, 92, 246, 0.6)',
  linkWidth = 2,
  onNodeClick,
  onNodeHover,
  height = 500,
  width = 500,
  backgroundColor = 'transparent'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);
  const nodesRef = useRef<d3.Selection<SVGGElement, any, SVGGElement, unknown> | null>(null);
  const linksRef = useRef<d3.Selection<SVGLineElement, any, SVGGElement, unknown> | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Limpar gráfico anterior e parar simulação
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const innerWidth = width;
    const innerHeight = height;

    // Se não houver nós, mostrar mensagem
    if (!graphData.nodes.length) {
      svg.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--text-secondary)')
        .attr('font-size', '14px')
        .text('Crie notas e use [[Título]] para criar conexões');
      return;
    }

    // Criar grupo principal para zoom
    const mainGroup = svg.append('g');

    // Criar gradiente para links
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'linkGradient')
      .attr('gradientUnits', 'userSpaceOnUse');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#4F46E5');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#8B5CF6');

    // Criar o simulador de força
    const simulation = d3.forceSimulation(graphData.nodes as any)
      .force('link', d3.forceLink(graphData.links)
        .id((d: any) => d.id)
        .distance(150)
        .strength(0.5))
      .force('charge', d3.forceManyBody()
        .strength(-300)
        .distanceMin(50)
        .distanceMax(300))
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force('collision', d3.forceCollide()
        .radius(40)
        .strength(0.7));

    simulationRef.current = simulation;

    // Criar grupo para links
    const link = mainGroup.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('stroke', linkColor)
      .attr('stroke-width', linkWidth)
      .attr('stroke-opacity', 0.7);

    linksRef.current = link;

    // Criar grupo para nós
    const node = mainGroup.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onNodeClick) onNodeClick(d as any);
      })
      .on('mouseenter', (event, d) => {
        event.stopPropagation();
        if (onNodeHover) onNodeHover(d as any);
      })
      .on('mouseleave', () => {
        if (onNodeHover) onNodeHover(null);
      });

    nodesRef.current = node;

    // Adicionar glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    filter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['coloredBlur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', (d: any) => d);

    // Adicionar círculos
    node.append('circle')
      .attr('r', d => Math.min(25, Math.max(10, nodeVal(d as any) * 1.5)))
      .attr('fill', d => nodeColor(d as any))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2.5)
      .attr('stroke-opacity', 0.9)
      .attr('filter', 'url(#glow)');

    // Adicionar textos
    node.append('text')
      .attr('dy', -18)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('paint-order', 'stroke')
      .attr('stroke', 'var(--bg-primary)')
      .attr('stroke-width', '2px')
      .text(d => {
        const name = (d as any).name;
        return name.length > 20 ? name.slice(0, 17) + '...' : name;
      })
      .style('pointer-events', 'none');

    // Adicionar badges de conexões
    node.append('text')
      .attr('dy', -5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .text(d => {
        const nodeData = d as any;
        const connections = (nodeData.backlinks?.length || 0) + (graphData.links.filter((l: any) => l.source === nodeData.id || l.target === nodeData.id).length);
        return connections > 0 ? `${connections} 🔗` : '';
      })
      .style('pointer-events', 'none');

    // Atualizar posições na simulação
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => Math.max(5, Math.min(innerWidth - 5, d.source.x)))
        .attr('y1', (d: any) => Math.max(5, Math.min(innerHeight - 5, d.source.y)))
        .attr('x2', (d: any) => Math.max(5, Math.min(innerWidth - 5, d.target.x)))
        .attr('y2', (d: any) => Math.max(5, Math.min(innerHeight - 5, d.target.y)));

      node.attr('transform', (d: any) => `translate(${Math.max(10, Math.min(innerWidth - 10, d.x))},${Math.max(10, Math.min(innerHeight - 10, d.y))})`);
    });

    // Adicionar zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on('zoom', (zoomEvent) => {
        mainGroup.attr('transform', zoomEvent.transform);
      });

    svg.call(zoom);

    // Centralizar visualização inicial
    const initialTransform = d3.zoomIdentity.translate(innerWidth / 2, innerHeight / 2).scale(0.8);
    svg.call(zoom.transform, initialTransform);

    // Limpeza
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graphData.nodes, graphData.links, height, width]); // Dependências reduzidas

  // Atualizar cores e tamanhos sem recriar o gráfico
  useEffect(() => {
    if (nodesRef.current) {
      nodesRef.current.selectAll('circle')
        .transition()
        .duration(300)
        .attr('fill', (d: any) => nodeColor(d));
      
      nodesRef.current.selectAll('text:first-of-type')
        .transition()
        .duration(300)
        .text((d: any) => {
          const name = (d as any).name;
          return name.length > 20 ? name.slice(0, 17) + '...' : name;
        });
    }
  }, [nodeColor, graphData.nodes]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ background: backgroundColor, borderRadius: '12px', width: '100%', height: '100%', cursor: 'grab' }}
    />
  );
};