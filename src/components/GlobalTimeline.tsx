import React, { useMemo, useState } from 'react';
import { ProjectData } from '../App';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface GlobalTimelineProps {
  data: ProjectData[];
}

const seriesOptions = [
  { key: 'completed', label: 'Completed' },
  { key: 'indexed', label: 'Indexed' },
  { key: 'presented', label: 'Presented' },
  { key: 'events', label: 'All Events' },
  { key: 'projects', label: 'Projects' }
] as const;

const GlobalTimeline: React.FC<GlobalTimelineProps> = ({ data }) => {
  const [seriesKey, setSeriesKey] = useState<typeof seriesOptions[number]['key']>('completed');

  const normalizeDate = (value?: string) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  };

  const timeSeries = useMemo(() => {
    const dateToValue: Record<string, number> = {};

    if (seriesKey === 'projects') {
      const dateToProjects: Record<string, Set<string>> = {};
      data.forEach(it => {
        const date = normalizeDate(it['Project Start Date']);
        const projectName = it['Project Name'];
        if (!date || !projectName) return;
        if (!dateToProjects[date]) dateToProjects[date] = new Set<string>();
        dateToProjects[date].add(projectName);
      });
      Object.entries(dateToProjects).forEach(([date, set]) => {
        dateToValue[date] = set.size;
      });
    } else {
      data.forEach(it => {
        const date = normalizeDate(it['Event Date']);
        if (!date) return;
        const interaction = (it['Expert Final Interaction State'] || '').toLowerCase();
        const eventType = (it['Event Type'] || '').toLowerCase();
        const match = (
          (seriesKey === 'completed' && (interaction.includes('completed') || eventType.includes('completed'))) ||
          (seriesKey === 'indexed' && (interaction.includes('indexed') || eventType.includes('indexed'))) ||
          (seriesKey === 'presented' && (interaction.includes('presented') || eventType.includes('presented'))) ||
          (seriesKey === 'events')
        );
        if (!match) return;
        dateToValue[date] = (dateToValue[date] || 0) + 1;
      });
    }

    return Object.entries(dateToValue)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data, seriesKey]);

  return (
    <div className="full-width-card">
      <div className="full-width-card-header">
        <h3>Global Timeline</h3>
        <div className="sort-buttons">
          {seriesOptions.map(opt => (
            <button
              key={opt.key}
              className={`sort-button ${seriesKey === opt.key ? 'active' : ''}`}
              onClick={() => setSeriesKey(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="full-width-card-body">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={timeSeries} margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip labelFormatter={(label) => `Date: ${label}`} formatter={(v: any) => [v, 'Count']} />
            <Line type="monotone" dataKey="value" stroke="#3498db" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GlobalTimeline;
