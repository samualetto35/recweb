import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProjectData } from '../../App';

interface GeoActivityChartProps {
  data: ProjectData[];
}

const GeoActivityChart: React.FC<GeoActivityChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const geoActivity = data.reduce((acc, item) => {
      const geoscope = item['Project Geoscope'] || 'Unknown';
      acc[geoscope] = (acc[geoscope] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(geoActivity)
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 regions
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ left: 20, right: 20, top: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GeoActivityChart; 