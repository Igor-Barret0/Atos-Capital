"use client";

import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type ChartPoint = { name: string; value: number };

type DynamicChartProps = {
  chartType: 'bar' | 'line' | 'pie' | 'scatter';
  data: ChartPoint[];
  title?: string;
};

const COLORS = ['#4A90E2', '#50E3C2', '#9013FE', '#E74C3C', '#FFC300', '#1ABC9C'];

const DynamicChart: React.FC<DynamicChartProps> = ({ chartType, data, title }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="text-sm text-gray-500">Nenhum dado para gerar o gráfico.</div>;
  }

  const getChartElement = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={COLORS[0]}>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      );
    }

    if (chartType === 'pie') {
      return (
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} fill={COLORS[0]} label>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    }

    // scatter fallback -> bar
    return (
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill={COLORS[1]}>
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 my-2 w-full max-w-2xl mx-auto">
      {title && <h4 className="text-sm font-semibold mb-2">{title}</h4>}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>{getChartElement()}</ResponsiveContainer>
      </div>
    </div>
  );
};

export default DynamicChart;
