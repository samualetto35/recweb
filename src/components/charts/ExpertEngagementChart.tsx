import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ProjectData } from '../../App';

interface ExpertEngagementChartProps {
  data: ProjectData[];
}

const ExpertEngagementChart: React.FC<ExpertEngagementChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const engagement = data.reduce((acc, item) => {
      const clientName = item['Client Name'] || 'Unknown';
      const projectType = item['Project Type'] || 'Unknown';
      // const expertName = item['Expert Name'] || 'Unknown';
      
      if (!acc[clientName]) {
        acc[clientName] = {
          clientName,
          Reticula: 0,
          'inex.one': 0,
          total: 0
        };
      }
      
      acc[clientName][projectType]++;
      acc[clientName].total++;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(engagement)
      .filter((item: any) => item.total > 0)
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 10); // Top 10 clients
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ left: 20, right: 20, top: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="clientName" angle={-45} textAnchor="end" height={120} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Reticula" fill="#8884d8" />
        <Bar dataKey="inex.one" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpertEngagementChart; 