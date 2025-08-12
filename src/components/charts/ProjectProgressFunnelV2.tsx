import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProjectData } from '../../App';

interface ProjectProgressFunnelV2Props {
  data: ProjectData[];
}

type MetricType = 'totalProjects' | 'uniqueExperts' | 'uniqueClients';

const ProjectProgressFunnelV2: React.FC<ProjectProgressFunnelV2Props> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('totalProjects');

  const chartData = useMemo(() => {
    const eventTypes = ['completed', 'call', 'interaction set', 'present', 'index'];
    
    return eventTypes.map(eventType => {
      const filteredData = data.filter(item => 
        item['Event Type']?.toLowerCase().includes(eventType.toLowerCase())
      );

      let value = 0;
      switch (selectedMetric) {
        case 'totalProjects':
          value = filteredData.length;
          break;
        case 'uniqueExperts':
          value = new Set(filteredData.map(item => item['Expert Name'])).size;
          break;
        case 'uniqueClients':
          value = new Set(filteredData.map(item => item['Client Name'])).size;
          break;
      }

      return {
        name: eventType.charAt(0).toUpperCase() + eventType.slice(1),
        value,
        eventType
      };
    }).filter(item => item.value > 0); // Only show bars with data
  }, [data, selectedMetric]);

  const getMetricLabel = (metric: MetricType) => {
    switch (metric) {
      case 'totalProjects': return 'Total Projects';
      case 'uniqueExperts': return 'Unique Experts';
      case 'uniqueClients': return 'Unique Clients';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label style={{ marginRight: '10px', fontWeight: '500', color: '#2c3e50' }}>
          Metric:
        </label>
        <select 
          value={selectedMetric} 
          onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            color: '#2c3e50'
          }}
        >
          <option value="totalProjects">Total Projects</option>
          <option value="uniqueExperts">Unique Experts</option>
          <option value="uniqueClients">Unique Clients</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ left: 20, right: 20, top: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            tick={{ fontSize: 11 }}
            interval={0}
          />
          <YAxis scale="log" domain={['dataMin', 'dataMax']} allowDataOverflow={false} />
          <Tooltip 
            formatter={(value: number, name: string) => [
              value, 
              getMetricLabel(selectedMetric)
            ]}
            labelFormatter={(label) => `${label} Events`}
          />
          <Bar 
            dataKey="value" 
            fill="#82ca9d" 
            name={getMetricLabel(selectedMetric)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectProgressFunnelV2; 