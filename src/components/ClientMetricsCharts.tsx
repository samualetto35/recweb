import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ClientMetricsData } from '../App';

interface ClientMetricsChartsProps {
  data: ClientMetricsData[];
}

const ClientMetricsCharts: React.FC<ClientMetricsChartsProps> = ({ data }) => {
  const averageRateData = useMemo(() => {
    if (data.length === 0) return [];
    
    // Calculate average rate for each client
    return data.map(item => ({
      name: item['Client Name'],
      rate: parseFloat(item['Rate'] || '0'),
      reticulaCalls: parseInt(item['Reticula Completed Calls'] || '0'),
      inexOneCompleted: parseInt(item['Inex One Completed Calls'] || '0')
    })).sort((a, b) => b.rate - a.rate).slice(0, 10); // Top 10 by rate
  }, [data]);

  const histogramData = useMemo(() => {
    if (data.length === 0) return [];
    
    // Create histogram bins for Inex One Completed Calls
    const maxCompleted = Math.max(...data.map(item => parseInt(item['Inex One Completed Calls'] || '0')));
    const binSize = Math.max(1, Math.ceil(maxCompleted / 10));
    
    const bins: { [key: number]: number } = {};
    
    data.forEach(item => {
      const completed = parseInt(item['Inex One Completed Calls'] || '0');
      const bin = Math.floor(completed / binSize) * binSize;
      bins[bin] = (bins[bin] || 0) + 1;
    });
    
    return Object.entries(bins)
      .map(([bin, count]) => ({
        range: `${bin}-${parseInt(bin) + binSize - 1}`,
        count,
        bin: parseInt(bin)
      }))
      .sort((a, b) => a.bin - b.bin);
  }, [data]);

  const rateDistributionData = useMemo(() => {
    if (data.length === 0) return [];
    
    // Create rate distribution bins
    const rates = data.map(item => parseFloat(item['Rate'] || '0')).filter(rate => rate > 0);
    if (rates.length === 0) return [];
    
    const maxRate = Math.max(...rates);
    const binSize = Math.max(0.1, maxRate / 10);
    
    const bins: { [key: number]: number } = {};
    
    rates.forEach(rate => {
      const bin = Math.floor(rate / binSize) * binSize;
      bins[bin] = (bins[bin] || 0) + 1;
    });
    
    return Object.entries(bins)
      .map(([bin, count]) => ({
        range: `${parseFloat(bin).toFixed(1)}-${(parseFloat(bin) + binSize).toFixed(1)}`,
        count,
        bin: parseFloat(bin)
      }))
      .sort((a, b) => a.bin - b.bin);
  }, [data]);

  return (
    <div className="charts-grid">
      <div className="chart-container">
        <h3>Top 10 Clients by Rate</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={averageRateData} margin={{ left: 20, right: 20, top: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 11 }}
              interval={0}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                value,
                name === 'rate' ? 'Rate' : name === 'reticulaCalls' ? 'Reticula Calls' : 'Inex One Completed'
              ]}
              labelFormatter={(label) => `Client: ${label}`}
            />
            <Bar dataKey="rate" fill="#8884d8" name="Rate" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Inex One Completed Calls Distribution</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={histogramData} margin={{ left: 20, right: 20, top: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 11 }}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                value,
                'Number of Clients'
              ]}
              labelFormatter={(label) => `Completed Calls Range: ${label}`}
            />
            <Bar dataKey="count" fill="#82ca9d" name="Clients" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Rate Distribution</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={rateDistributionData} margin={{ left: 20, right: 20, top: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 11 }}
              interval={0}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                value,
                'Number of Clients'
              ]}
              labelFormatter={(label) => `Rate Range: ${label}`}
            />
            <Bar dataKey="count" fill="#ffc658" name="Clients" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Reticula vs Inex One Completed Calls</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={averageRateData} margin={{ left: 20, right: 20, top: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 11 }}
              interval={0}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                value,
                name === 'reticulaCalls' ? 'Reticula Calls' : 'Inex One Completed'
              ]}
              labelFormatter={(label) => `Client: ${label}`}
            />
            <Line type="monotone" dataKey="reticulaCalls" stroke="#8884d8" name="Reticula Calls" />
            <Line type="monotone" dataKey="inexOneCompleted" stroke="#82ca9d" name="Inex One Completed" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClientMetricsCharts; 