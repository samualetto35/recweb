import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProjectData } from '../../App';

interface ProjectDistributionChartProps {
  data: ProjectData[];
}

const ProjectDistributionChart: React.FC<ProjectDistributionChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const distribution = data.reduce((acc, item) => {
      const interactionState = item['Expert Final Interaction State'] || 'Unknown';
      acc[interactionState] = (acc[interactionState] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(distribution).reduce((sum, value) => sum + value, 0);
    
    return Object.entries(distribution)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={chartData} margin={{ left: 20, right: 20, top: 20, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={120}
          tick={{ fontSize: 11 }}
          interval={0}
        />
        <YAxis scale="log" domain={['dataMin', 'dataMax']} allowDataOverflow={false} />
        <Tooltip 
          formatter={(value: number, name: string) => [
            value, 
            'Projects'
          ]}
          labelFormatter={(label) => `${label} Interaction State`}
        />
        <Bar dataKey="value" fill="#8884d8" barSize={80} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProjectDistributionChart; 