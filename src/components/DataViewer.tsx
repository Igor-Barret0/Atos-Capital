"use client";

import React, { useMemo, useState } from 'react';
import DynamicChart from './charts/DynamicChart';

type Row = Record<string, any>;

type DataViewerProps = {
  rows: Row[];
  title?: string;
};

const DataViewer: React.FC<DataViewerProps> = ({ rows, title }) => {
  const [view, setView] = useState<'table' | 'chart' | 'report'>('table');
  const columns = useMemo(() => (rows && rows.length > 0 ? Object.keys(rows[0]) : []), [rows]);
  const [xCol, setXCol] = useState<string | null>(columns[0] || null);
  const [yCol, setYCol] = useState<string | null>(columns.find(c => typeof rows[0]?.[c] === 'number') || null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [rowsToShow, setRowsToShow] = useState<number>(50);

  // Build chart data: group by xCol (categorical) and sum yCol (numeric)
  const chartData = useMemo(() => {
    if (!xCol || !yCol) return [];
    const map: Record<string, number> = {};
    rows.forEach(r => {
      const key = r[xCol] != null ? String(r[xCol]) : 'N/A';
      const v = Number(r[yCol]) || 0;
      map[key] = (map[key] || 0) + v;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [rows, xCol, yCol]);

  const exportCSV = (dataRows: Row[]) => {
    if (!dataRows || dataRows.length === 0) return;
    const header = Object.keys(dataRows[0]);
    const csvLines = [header.join(',')];
    dataRows.forEach(r => {
      const line = header.map(h => {
        const v = r[h];
        if (v === null || v === undefined) return '';
        // escape quotes
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(',');
      csvLines.push(line);
    });
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dados_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // removed XLSX export — CSV is supported

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 my-2">
      {title && <div className="text-sm font-semibold mb-2">{title}</div>}

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <label className="text-xs text-gray-600">Visualizar como:</label>
        <select value={view} onChange={(e) => setView(e.target.value as any)} className="px-2 py-1 border rounded">
          <option value="table">Tabela</option>
          <option value="chart">Gráfico</option>
          <option value="report">Relatório</option>
        </select>

        {view === 'chart' && (
          <>
            <label className="text-xs text-gray-600">Coluna categórica:</label>
            <select value={xCol || ''} onChange={(e) => setXCol(e.target.value || null)} className="px-2 py-1 border rounded">
              <option value="">(nenhuma)</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="text-xs text-gray-600">Coluna numérica:</label>
            <select value={yCol || ''} onChange={(e) => setYCol(e.target.value || null)} className="px-2 py-1 border rounded">
              <option value="">(nenhuma)</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="text-xs text-gray-600">Tipo:</label>
            <select value={chartType} onChange={(e) => setChartType(e.target.value as any)} className="px-2 py-1 border rounded">
              <option value="bar">Barra</option>
              <option value="line">Linha</option>
              <option value="pie">Pizza</option>
              <option value="scatter">Dispersão</option>
            </select>
          </>
        )}
      </div>

      <div>
        {view === 'table' && (
          <div>
            <div className="flex justify-end gap-2 mb-2">
              <button onClick={() => exportCSV(rows.slice(0, rowsToShow))} className="px-2 py-1 text-xs bg-white border rounded">Exportar CSV</button>
            </div>
            <div className="overflow-auto max-h-64 border rounded">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    {columns.map(col => <th key={col} className="px-2 py-1 text-left font-medium">{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, rowsToShow).map((r, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      {columns.map(col => <td key={col} className="px-2 py-1 align-top">{String(r[col] ?? '')}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rows.length > rowsToShow && (
              <div className="flex justify-center mt-2">
                <button onClick={() => setRowsToShow(prev => Math.min(rows.length, prev + 50))} className="px-3 py-1 text-sm bg-white border rounded">Mostrar mais</button>
              </div>
            )}
            {rows.length <= rowsToShow && rows.length > 0 && (
              <div className="p-2 text-xs text-gray-500">Mostrando {rowsToShow >= rows.length ? rows.length : rowsToShow} de {rows.length} registros</div>
            )}
          </div>
        )}

        {view === 'chart' && (
          (xCol && yCol && chartData.length > 0) ? (
            <DynamicChart chartType={chartType} data={chartData} title={`Soma de ${yCol} por ${xCol}`} />
          ) : (
            <div className="text-sm text-gray-500">Escolha uma coluna categórica e uma numérica para gerar o gráfico.</div>
          )
        )}

        {view === 'report' && (
          <div className="text-sm text-gray-700">
            <p><strong>Total de registros:</strong> {rows.length}</p>
            <p className="mt-2"><strong>Colunas:</strong> {columns.join(', ')}</p>
            <pre className="mt-3 text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(rows.slice(0, 10), null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataViewer;
