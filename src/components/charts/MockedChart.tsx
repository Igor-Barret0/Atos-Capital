'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import * as XLSX from 'xlsx';
import { 
  PieChart, Pie, Cell, Sector,
  LineChart, Line, Area,
  BarChart, Bar, 
  ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart 
} from 'recharts';

// --- DADOS E ESTILOS PROFISSIONAIS ---

// 1. Gráfico de Pizza (Preferência por Filmes)
const pieData = [
  { name: 'Ação', value: 34.3 },
  { name: 'Comédia', value: 25.7 },
  { name: 'Terror', value: 20.0 },
  { name: 'Romance', value: 14.3 },
  { name: 'Drama', value: 5.7 },
];

// Subcategorias para o drill-down
const subcategoriasPorGenero: Record<string, Array<{name: string, value: number}>> = {
  'Ação': [
    { name: 'Ação - Aventura', value: 12.5 },
    { name: 'Ação - Comédia', value: 10.2 },
    { name: 'Ação - Ficção Científica', value: 8.1 },
    { name: 'Ação - Suspense', value: 3.5 },
  ],
  'Comédia': [
    { name: 'Comédia Romântica', value: 9.8 },
    { name: 'Comédia de Humor Negro', value: 7.2 },
    { name: 'Comédia Pastelão', value: 5.4 },
    { name: 'Comédia Dramática', value: 3.3 },
  ],
  'Terror': [
    { name: 'Terror Psicológico', value: 8.7 },
    { name: 'Terror Sobrenatural', value: 6.5 },
    { name: 'Terror de Zumbi', value: 3.2 },
    { name: 'Terror de Monstros', value: 1.6 },
  ],
  'Romance': [
    { name: 'Romance de Época', value: 6.1 },
    { name: 'Romance Adolescente', value: 4.8 },
    { name: 'Romance Erótico', value: 2.4 },
    { name: 'Romance Dramático', value: 1.0 },
  ],
  'Drama': [
    { name: 'Drama Familiar', value: 2.1 },
    { name: 'Drama Histórico', value: 1.8 },
    { name: 'Drama Policial', value: 1.2 },
    { name: 'Drama Médico', value: 0.6 },
  ],
};

// Cores fixas para o tema claro
const getChartColors = () => ({
  pie: ['#FFC300', '#3498DB', '#A569BD', '#E74C3C', '#1ABC9C'],
  bar: ['#4A90E2', '#50E3C2', '#9013FE'],
  line: '#5D3FD3',
  scatter: '#E74C3C',
  areaGradient: {
    start: 'rgba(93, 63, 211, 0.4)',
    end: 'rgba(93, 63, 211, 0.05)'
  },
  tooltip: {
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#1f2937',
  },
  legend: {
    text: '#4b5563',
  },
});

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

// 2. Gráfico de Linha (Faturamento da Empresa)
const lineData = [
  { ano: 2015, faturamento: 18000 },
  { ano: 2016, faturamento: 13000 },
  { ano: 2017, faturamento: 14500 },
  { ano: 2018, faturamento: 11000 },
  { ano: 2019, faturamento: 15200 },
];

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="p-3 rounded shadow-lg border border-opacity-20"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          color: '#1f2937',
        }}
      >
        <p className="font-semibold">{`Ano: ${label}`}</p>
        <p style={{ color: '#5D3FD3' }}>{`Faturamento: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

// 3. Gráfico de Barras Empilhadas (Vendas por Vendedor)
const barData = [
    { name: 'Igor', jan: 4000, fev: 2400, mar: 2400 },
    { name: 'Dyatlov', jan: 3000, fev: 1398, mar: 2210 },
    { name: 'Veronezi', jan: 2000, fev: 9800, mar: 2290 },
    { name: 'Jean', jan: 2780, fev: 3908, mar: 2000 },
    { name: 'Gustavo', jan: 1890, fev: 4800, mar: 2181 },
    { name: 'Particular', jan: 2390, fev: 3800, mar: 2500 },
    { name: 'Breno', jan: 3490, fev: 4300, mar: 2100 },
];

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Mapeia os nomes dos meses para português
    const meses: {[key: string]: string} = {
      'jan': 'Janeiro',
      'fev': 'Fevereiro',
      'mar': 'Março'
    };
    
    return (
      <div 
        className="p-3 rounded shadow-lg border border-opacity-20"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          color: '#000000',
        }}
      >
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} className="flex justify-between items-center">
            <span className="mr-2">{meses[pld.dataKey] || pld.dataKey}:</span>
            <span className="font-medium" style={{ color: pld.fill }}>
              {formatCurrency(pld.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 4. Gráfico de Dispersão com Regressão
const scatterData = [
  { x: 0.1, y: 0.5 }, { x: 0.2, y: 0.8 }, { x: 0.25, y: 0.7 },
  { x: 0.3, y: 1.2 }, { x: 0.4, y: 1.5 }, { x: 0.45, y: 1.4 },
  { x: 0.5, y: 1.8 }, { x: 0.6, y: 2.1 }, { x: 0.7, y: 2.5 },
  { x: 0.8, y: 2.8 }, { x: 0.9, y: 3.1 }, { x: 1.0, y: 3.4 },
];
const regressionData = [{x: 0, y: 0.2}, {x: 1.1, y: 3.6}];

const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div 
        className="p-3 rounded shadow-lg border border-opacity-20"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          color: '#1f2937',
        }}
      >
        <p>{`Eixo X: ${data.x}`}</p>
        <p>{`Eixo Y: ${data.y}`}</p>
      </div>
    );
  }
  return null;
};

// --- COMPONENTE PRINCIPAL ---

const chartTypes = ['pie', 'line', 'bar', 'scatter'];

type MockedChartProps = {
  chartType?: 'pie' | 'line' | 'bar' | 'scatter';
};

const MockedChart: React.FC<MockedChartProps> = ({ 
  chartType: requestedChartType
}) => {
  // Theme colors for light mode
  const themeColors = {
    background: '#ffffff',
    text: '#1f2937',
    grid: '#e5e7eb',
    card: '#f9fafb',
  };

  // Get chart colors (always light theme)
  const chartColors = getChartColors();

  // Estados para controlar o drill-down
  const [drillDownData, setDrillDownData] = useState<{vendedor: string, data: {name: string, value: number}[]} | null>(null);
  const [drillDownPie, setDrillDownPie] = useState<{categoria: string, data: {name: string, value: number}[]} | null>(null);
  
  // Estados para filtros
  const [filtrosMeses, setFiltrosMeses] = useState<Record<string, boolean>>({
    jan: true,
    fev: true,
    mar: true,
  });
  
  // Valores iniciais baseados nos dados
  const valoresIniciais = useMemo(() => {
    const valores = barData.flatMap(v => [v.jan, v.fev, v.mar]);
    return {
      min: Math.min(...valores),
      max: Math.max(...valores)
    };
  }, []);

  const [filtroValorMin, setFiltroValorMin] = useState<number>(valoresIniciais.min);
  const [filtroValorMax, setFiltroValorMax] = useState<number>(valoresIniciais.max);
  const [showFiltrosAvancados, setShowFiltrosAvancados] = useState<boolean>(false);
  
  // Set light theme colors for chart elements
  const chartBackground = themeColors.background;
  const textColor = themeColors.text;
  const gridColor = themeColors.grid;
  const cardBackground = themeColors.card;
  
  // Filter data based on filters
  const barDataFiltrada = useMemo(() => {
    console.log('Filtrando com valores:', { filtroValorMin, filtroValorMax, filtrosMeses });
    
    const resultado = barData.filter(vendedor => {
      // Verifica se o vendedor tem algum valor dentro da faixa selecionada
      const temDentroDaFaixa = Object.entries(vendedor).some(([key, value]) => {
        if (key === 'name') return false; // Ignora a chave 'name'
        if (!filtrosMeses[key as keyof typeof filtrosMeses]) return false;
        
        const valorNumerico = Number(value);
        const dentroDaFaixa = valorNumerico >= filtroValorMin && 
                            valorNumerico <= filtroValorMax;
        
        return !isNaN(valorNumerico) && dentroDaFaixa;
      });
      
      console.log(`Vendedor ${vendedor.name} - Tem dados dentro da faixa:`, temDentroDaFaixa);
      return temDentroDaFaixa;
    });
    
    console.log('Resultado do filtro:', resultado);
    return resultado;
  }, [filtrosMeses, filtroValorMin, filtroValorMax]);
  
  // Calcular valores mínimo e máximo para os sliders
  const valoresVendas = barData.flatMap(v => [v.jan, v.fev, v.mar]);
  const valorMinimo = Math.min(...valoresVendas);
  const valorMaximo = Math.max(...valoresVendas);
  
  // Componente de Filtros Avançados
  const FiltrosAvancados = () => (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Filtros Avançados</h4>
        <button 
          onClick={() => setShowFiltrosAvancados(false)}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Ocultar
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Faixa de Valores: {formatCurrency(filtroValorMin)} - {formatCurrency(filtroValorMax)}
          </label>
          <div className="px-2">
            <input
              type="range"
              min={valorMinimo}
              max={valorMaximo}
              value={filtroValorMin}
              onChange={(e) => setFiltroValorMin(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label="Valor mínimo"
            />
            <input
              type="range"
              min={valorMinimo}
              max={valorMaximo}
              value={filtroValorMax}
              onChange={(e) => setFiltroValorMax(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
              aria-label="Valor máximo"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatCurrency(valorMinimo)}</span>
            <span>{formatCurrency(valorMaximo)}</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meses:
          </label>
          <div className="flex flex-wrap gap-4">
            {Object.entries(filtrosMeses).map(([mes, ativo]) => (
              <label key={mes} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={() => toggleFiltroMes(mes)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  aria-label={`${mes.charAt(0).toUpperCase() + mes.slice(1)}`}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {mes.charAt(0).toUpperCase() + mes.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  // Toggle para mostrar/ocultar filtros avançados
  const ToggleFiltrosButton = () => (
    <button
      onClick={() => setShowFiltrosAvancados(!showFiltrosAvancados)}
      className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mt-2"
      aria-expanded={showFiltrosAvancados}
      aria-controls="filtros-avancados"
    >
      {showFiltrosAvancados ? 'Ocultar' : 'Mostrar'} filtros avançados
      <svg 
        className={`w-4 h-4 ml-1 transition-transform ${showFiltrosAvancados ? 'rotate-180' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  // Função para alternar um filtro de mês
  const toggleFiltroMes = (mes: string) => {
    setFiltrosMeses(prev => ({
      ...prev,
      [mes]: !prev[mes]
    }));
  };

  // Verificar se há pelo menos um mês ativo
  const mesesAtivos = Object.values(filtrosMeses).filter(Boolean).length > 0;
  const mesesDisponiveis = Object.keys(filtrosMeses);
  
  // Verificar se há dados após a filtragem
  const semDados = barDataFiltrada.length === 0;
  
  // Refs para os elementos dos gráficos
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Função para exportar dados para XLSX
  const exportToXLSX = () => {
    // Criar um novo workbook
    const wb = XLSX.utils.book_new();
    
    // Exportar dados com base no tipo de gráfico atual
    if (chartType === 'pie') {
      // Dados do gráfico de pizza
      const wsPizza = XLSX.utils.json_to_sheet(pieData);
      XLSX.utils.sheet_add_aoa(wsPizza, [["Categoria", "Porcentagem"]], { origin: "A1" });
      XLSX.utils.book_append_sheet(wb, wsPizza, "Distribuição por Gênero");
      
      // Se estiver no drill-down, exportar também os dados detalhados
      if (drillDownPie) {
        const wsPizzaDetalhado = XLSX.utils.json_to_sheet(drillDownPie.data);
        XLSX.utils.sheet_add_aoa(
          wsPizzaDetalhado, 
          [[`Subcategorias de ${drillDownPie.categoria}`]], 
          { origin: "A1" }
        );
        XLSX.utils.book_append_sheet(wb, wsPizzaDetalhado, `Detalhes ${drillDownPie.categoria}`);
      }
    } 
    else if (chartType === 'line') {
      // Dados do gráfico de linha
      const wsLinha = XLSX.utils.json_to_sheet(lineData);
      XLSX.utils.sheet_add_aoa(wsLinha, [["Ano", "Faturamento"]], { origin: "A1" });
      XLSX.utils.book_append_sheet(wb, wsLinha, "Faturamento Anual");
    } 
    else if (chartType === 'bar') {
      // Dados do gráfico de barras
      const wsBarras = XLSX.utils.json_to_sheet(barDataFiltrada);
      XLSX.utils.sheet_add_aoa(wsBarras, [["Vendedor", "Janeiro", "Fevereiro", "Março"]], { origin: "A1" });
      XLSX.utils.book_append_sheet(wb, wsBarras, "Vendas por Vendedor");
      
      // Se estiver no drill-down, exportar também os dados detalhados
      if (drillDownData) {
        const wsDetalhes = XLSX.utils.json_to_sheet(drillDownData.data);
        XLSX.utils.sheet_add_aoa(
          wsDetalhes, 
          [[`Vendas Mensais - ${drillDownData.vendedor}`]], 
          { origin: "A1" }
        );
        XLSX.utils.book_append_sheet(wb, wsDetalhes, `Vendas ${drillDownData.vendedor}`);
      }
    } 
    else if (chartType === 'scatter') {
      // Dados do gráfico de dispersão
      const wsDispersao = XLSX.utils.json_to_sheet(
        scatterData.map((point, index) => ({
          'Ponto': index + 1,
          'Valor X': point.x,
          'Valor Y': point.y
        }))
      );
      XLSX.utils.sheet_add_aoa(wsDispersao, [["Ponto", "Valor X", "Valor Y"]], { origin: "A1" });
      XLSX.utils.book_append_sheet(wb, wsDispersao, "Dados de Dispersão");
    }
    
    // Gerar o arquivo XLSX com nome baseado no tipo de gráfico
    XLSX.writeFile(wb, `dados_${chartType}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };
  
  // Função para exportar o gráfico como imagem
  const exportChartAsPng = async () => {
    if (!chartRef.current) return;
    
    // Cria um clone do nó para evitar modificar o DOM original
    const node = chartRef.current.cloneNode(true) as HTMLElement;
    
    // Remove o botão de exportação do clone
    const exportButton = node.querySelector('.export-button');
    if (exportButton) {
      exportButton.remove();
    }
    
    // Adiciona estilos temporários para melhorar a exportação
    const style = document.createElement('style');
    style.textContent = `
      .recharts-wrapper, .recharts-surface, svg {
        overflow: visible !important;
      }
      .recharts-legend-wrapper {
        position: static !important;
        width: 100% !important;
      }
      body, html {
        margin: 0 !important;
        padding: 0 !important;
      }
    `;
    
    // Cria um container temporário
    const container = document.createElement('div');
    container.appendChild(style);
    container.appendChild(node);
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    try {
      const dataUrl = await toPng(node, {
        backgroundColor: 'white',
        pixelRatio: 2,
        cacheBust: true,
        style: {
          margin: '0',
          padding: '0'
        }
      });
      
      const link = document.createElement('a');
      link.download = `grafico-${chartType || 'personalizado'}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar o gráfico:', error);
      alert('Não foi possível exportar o gráfico. Tente novamente.');
    } finally {
      // Limpa o container temporário
      document.body.removeChild(container);
    }
  };
  
  // Export buttons with proper z-index to stay below settings menu
  const ExportButton = () => (
    <div className="export-buttons absolute -top-2 -right-2 z-10 flex flex-col space-y-2 p-1 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg" style={{ zIndex: 10 }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          exportToXLSX();
        }}
        className="p-1.5 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
        title="Exportar dados para Excel"
        aria-label="Exportar para Excel"
      >
        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          exportChartAsPng();
        }}
        className="p-1.5 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
        title="Exportar gráfico como imagem"
        aria-label="Exportar gráfico"
      >
        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
  );

  // Função para lidar com o clique em uma barra do gráfico de colunas
  const handleBarClick = (data: any, index: number) => {
    const vendedor = barData[index].name;
    const vendasMensais = [
      { name: 'Janeiro', value: barData[index].jan },
      { name: 'Fevereiro', value: barData[index].fev },
      { name: 'Março', value: barData[index].mar },
    ];
    setDrillDownData({ vendedor, data: vendasMensais });
  };

  // Função para voltar ao gráfico de colunas
  const handleBackToBars = () => {
    setDrillDownData(null);
  };

  // Função para lidar com o clique em uma fatia do gráfico de pizza
  const handlePieClick = (data: any, index: number) => {
    const categoria = pieData[index].name;
    setDrillDownPie({ categoria, data: subcategoriasPorGenero[categoria] });
  };

  // Função para voltar ao gráfico de pizza principal
  const handleBackToPie = () => {
    setDrillDownPie(null);
  };

  const chartType = useMemo(() => {
    if (requestedChartType && chartTypes.includes(requestedChartType)) {
      return requestedChartType;
    }
    const randomIndex = Math.floor(Math.random() * chartTypes.length);
    return chartTypes[randomIndex];
  }, [requestedChartType]);

  return (
    <div>
      {chartType === 'pie' && !drillDownPie && (
        <div ref={chartRef} className="bg-white rounded-lg shadow-md p-4 my-2 w-full max-w-2xl mx-auto relative">
          <ExportButton />
          <h3 className="text-sm font-semibold mb-2 text-black">Relação entre Investimento e Retorno</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              isAnimationActive={true}
              animationDuration={800}
              onClick={handlePieClick}
              activeShape={(props: any) => {
                const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
                const sin = Math.sin(-RADIAN * midAngle);
                const cos = Math.cos(-RADIAN * midAngle);
                const sx = cx + (outerRadius + 10) * cos;
                const sy = cy + (outerRadius + 10) * sin;
                return (
                  <g>
                    <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
                    <Sector
                      cx={cx}
                      cy={cy}
                      innerRadius={innerRadius}
                      outerRadius={outerRadius + 5} // Efeito de explosão
                      startAngle={startAngle}
                      endAngle={endAngle}
                      fill={fill}
                    />
                  </g>
                );
              }}
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={chartColors.pie[index % chartColors.pie.length]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            <Legend />
          </PieChart>
          <p className="text-xs text-gray-500 text-center mt-2">Clique em uma fatia para ver as subcategorias</p>
        </div>
      )}

      {chartType === 'pie' && drillDownPie && (
        <div ref={chartRef} className="bg-white rounded-lg shadow-md p-4 my-2 w-full max-w-2xl mx-auto relative">
          <ExportButton />
          <div className="flex items-center mb-4">
            <button 
              onClick={handleBackToPie}
              className="p-1 mr-2 rounded-full hover:bg-gray-100"
              aria-label="Voltar para o gráfico de pizza"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h3 className="text-sm font-semibold text-black">Subcategorias de {drillDownPie.categoria}</h3>
          </div>
          <BarChart
            width={500}
            height={300}
            data={drillDownPie.data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              horizontal={true} 
              vertical={false}
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 500, textAnchor: 'end' }}
              tickLine={false}
              height={60}
              interval={0}
              angle={-45}
            />
           <YAxis 
             tickFormatter={(value) => `${Math.round(value)}%`}
             tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
             tickLine={false}
             domain={[0, 'dataMax + 1']}
             allowDecimals={false}
             width={40}
             tickCount={5}
           />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Porcentagem']}
              labelFormatter={(label) => `Categoria: ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem',
              }}
              itemStyle={{ color: '#1f2937' }}
              labelStyle={{ color: '#6b7280' }}
            />
            <Bar dataKey="value" name="Porcentagem">
              {drillDownPie.data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={chartColors.pie[index % chartColors.pie.length]}
                  stroke="none"
                />
              ))}
            </Bar>
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                color: '#4b5563',
              }}
            />
          </BarChart>
          <p className="text-xs text-gray-500 text-center mt-2">
            Distribuição percentual das subcategorias de {drillDownPie.categoria}
          </p>
        </div>
      )}

      {chartType === 'line' && (
        <div ref={chartRef} className="bg-white rounded-lg shadow-md p-4 my-2 w-full max-w-2xl mx-auto relative">
          <ExportButton />
          <LineChart width={500} height={300} data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5D3FD3" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#5D3FD3" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ano" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomLineTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="faturamento" stroke="#5D3FD3" fillOpacity={1} fill="url(#colorFaturamento)" />
            <Line type="monotone" dataKey="faturamento" stroke="#5D3FD3" strokeWidth={2} activeDot={{ r: 8 }} dot={false} />
          </LineChart>
        </div>
      )}

      {chartType === 'bar' && !drillDownData && (
        <div ref={chartRef} className="bg-white rounded-lg shadow-md p-4 my-2 w-full max-w-2xl mx-auto relative">
          <ExportButton />
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-black">Vendas por Vendedor</h3>
            <ToggleFiltrosButton />
          </div>
          
          {showFiltrosAvancados && <FiltrosAvancados />}
          
          {!showFiltrosAvancados && (
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {mesesDisponiveis.map((mes) => (
                <label key={mes} className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-50 rounded-full">
                  <input
                    type="checkbox"
                    checked={filtrosMeses[mes]}
                    onChange={() => toggleFiltroMes(mes)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    aria-label={`Filtrar ${mes}`}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {mes.charAt(0).toUpperCase() + mes.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          )}

          {!semDados && mesesAtivos ? (
            <div className="overflow-x-auto">
              <BarChart 
                width={500} 
                height={300} 
                data={barDataFiltrada} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barCategoryGap={20}
                barGap={4}
              >
                <CartesianGrid 
                  horizontal={true}
                  vertical={false}
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb"
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={formatCurrency} 
                  tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
                  tickLine={false}
                />
                <Tooltip 
                  content={<CustomBarTooltip />} 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} 
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px',
                    color: '#4b5563',
                  }}
                />
                {filtrosMeses.jan && (
                  <Bar 
                    dataKey="jan" 
                    stackId="a" 
                    fill="#4A90E2" 
                    name="Janeiro"
                    isAnimationActive={true} 
                    animationDuration={800} 
                    onClick={handleBarClick}
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {filtrosMeses.fev && (
                  <Bar 
                    dataKey="fev" 
                    stackId="a" 
                    fill="#50E3C2" 
                    name="Fevereiro"
                    isAnimationActive={true} 
                    animationDuration={800} 
                    onClick={handleBarClick}
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {filtrosMeses.mar && (
                  <Bar 
                    dataKey="mar" 
                    stackId="a" 
                    fill="#9013FE" 
                    name="Março"
                    isAnimationActive={true} 
                    animationDuration={800} 
                    onClick={handleBarClick}
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg p-4 text-center">
              {!mesesAtivos ? (
                <>
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">Selecione pelo menos um mês para visualizar o gráfico.</p>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">Nenhum dado encontrado com os filtros atuais.</p>
                  <button 
                    onClick={() => {
                      setFiltroValorMin(valorMinimo);
                      setFiltroValorMax(valorMaximo);
                    }}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Limpar filtros
                  </button>
                </>
              )}
            </div>
          )}
          
          {!showFiltrosAvancados && !semDados && mesesAtivos && (
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Mostrando {barDataFiltrada.length} de {barData.length} vendedores
                {filtroValorMin > valorMinimo || filtroValorMax < valorMaximo ? (
                  <span className="ml-1">
                    • Filtrado de {formatCurrency(filtroValorMin)} a {formatCurrency(filtroValorMax)}
                  </span>
                ) : null}
              </p>
              <p className="text-xs text-gray-400 mt-1">Clique em uma coluna para ver os detalhes</p>
            </div>
          )}
        </div>
      )}

      {chartType === 'bar' && drillDownData && (
        <div ref={chartRef} className="bg-white rounded-lg shadow-md p-4 my-2 w-full max-w-2xl mx-auto relative">
          <ExportButton />
          <div className="flex items-center mb-4">
            <button 
              onClick={handleBackToBars}
              className="p-1 mr-2 rounded-full hover:bg-gray-100"
              aria-label="Voltar para o gráfico de colunas"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h3 className="text-sm font-semibold">Distribuição Mensal - {drillDownData.vendedor}</h3>
          </div>
          <BarChart
            width={500}
            height={300}
            data={drillDownData.data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#4b5563', fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => {
                const meses: {[key: string]: string} = {
                  'Jan': 'Janeiro',
                  'Fev': 'Fevereiro',
                  'Mar': 'Março'
                };
                return meses[value] || value;
              }}
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: '#000000', fontSize: 12, fontWeight: 'bold' }}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Porcentagem']}
              labelFormatter={(label) => `Mês: ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem',
              }}
              itemStyle={{ color: '#1f2937' }}
              labelStyle={{ color: '#6b7280' }}
            />
            <Bar dataKey="value" name="Porcentagem">
              {drillDownData.data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={chartColors.pie[index % chartColors.pie.length]}
                  stroke="none"
                />
              ))}
            </Bar>
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                color: '#4b5563',
              }}
            />
          </BarChart>
          <p className="text-xs text-gray-500 text-center mt-2">
            Distribuição percentual por mês para {drillDownData.vendedor}
          </p>
        </div>
      )}

      {chartType === 'scatter' && (
        <div ref={chartRef} className="bg-white rounded-lg shadow-md p-4 my-2 w-full max-w-2xl mx-auto relative">
          <ExportButton />
          <ComposedChart width={500} height={300} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="x" 
              type="number" 
              name="Eixo X"
              tick={{ fill: '#4b5563' }}
              axisLine={{ stroke: '#9ca3af' }}
              tickLine={{ stroke: '#9ca3af' }}
            />
            <YAxis 
              dataKey="y" 
              type="number" 
              name="Eixo Y"
              tick={{ fill: '#4b5563' }}
              axisLine={{ stroke: '#9ca3af' }}
              tickLine={{ stroke: '#9ca3af' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3', stroke: '#d1d5db' }} 
              content={<CustomScatterTooltip />} 
            />
            <Legend wrapperStyle={{ color: '#4b5563' }} />
            <Scatter 
              name="Pontos" 
              data={scatterData} 
              fill="#EF4444"
              shape="circle"
              activeShape={{ 
                fill: '#F87171', 
                stroke: '#DC2626',
                strokeWidth: 1,
                r: 8
              }}
            />
            <Line 
              name="Linha de Regressão" 
              data={regressionData} 
              dataKey="y" 
              stroke="#9ca3af" 
              dot={false} 
              activeDot={false} 
              strokeWidth={2} 
              strokeDasharray="5 5"
              isAnimationActive={false} 
            />
          </ComposedChart>
        </div>
      )}
    </div>
  );
};

export default MockedChart;
