import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProjectData } from '../../App';

interface ProjectProgressChartProps {
  data: ProjectData[];
}

const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const followupDistribution = data.reduce((acc, item) => {
      const followupNumber = item['Expert Final Outreach/Followup Number'] || '0';
      const numericValue = parseInt(followupNumber, 10) || 0;
      
      // Only count values from 0 to 6
      if (numericValue >= 0 && numericValue <= 6) {
        acc[numericValue] = (acc[numericValue] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    // Create data for all numbers 0-6, even if count is 0
    return Array.from({ length: 7 }, (_, i) => ({
      name: i.toString(),
      value: followupDistribution[i] || 0
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ left: 20, right: 20, top: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip 
          formatter={(value: number, name: string) => [
            value, 
            'Projects'
          ]}
          labelFormatter={(label) => `Followup Number: ${label}`}
        />
        <Bar dataKey="value" fill="#82ca9d" barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProjectProgressChart; 