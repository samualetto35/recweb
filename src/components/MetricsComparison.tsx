import React, { useMemo, useState } from 'react';
import { ProjectData } from '../App';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface MetricsComparisonProps {
  data: ProjectData[];
  type: 'managers' | 'associates' | null;
  onBack: () => void;
}

// Using inline types via map return; keep interface removed to avoid unused symbol warnings

interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}

const MetricsComparison: React.FC<MetricsComparisonProps> = ({ data, type, onBack }) => {
  const [sortConfig, setSortConfig] = useState<SortOption>({
    field: 'totalProjects',
    direction: 'desc',
    label: 'Total Projects (Descending)'
  });
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Modal state for fullscreen timeline
  const [timelineName, setTimelineName] = useState<string | null>(null);
  const [seriesByName, setSeriesByName] = useState<Record<string, string>>({});

  const sortOptions: SortOption[] = [
    { field: 'totalProjects', direction: 'desc', label: 'Total Projects (Descending)' },
    { field: 'totalProjects', direction: 'asc', label: 'Total Projects (Ascending)' },
    { field: 'uniqueClients', direction: 'desc', label: 'Clients (Descending)' },
    { field: 'uniqueClients', direction: 'asc', label: 'Clients (Ascending)' },
    { field: 'uniqueExperts', direction: 'desc', label: 'Experts (Descending)' },
    { field: 'uniqueExperts', direction: 'asc', label: 'Experts (Ascending)' },
    { field: 'completedProjects', direction: 'desc', label: 'Completed (Descending)' },
    { field: 'completedProjects', direction: 'asc', label: 'Completed (Ascending)' },
    { field: 'completedRate', direction: 'desc', label: 'Rate (Descending)' },
    { field: 'completedRate', direction: 'asc', label: 'Rate (Ascending)' },
    { field: 'name', direction: 'asc', label: 'Name (A-Z)' },
    { field: 'name', direction: 'desc', label: 'Name (Z-A)' }
  ];

  const metrics = useMemo(() => {
    if (!type) return [];
    const key = type === 'managers' ? 'Project Manager' : 'Event Executor Associate';
    const uniqueValues = Array.from(new Set(data.map(item => item[key]))).filter(Boolean);

    return uniqueValues.map(name => {
      const filteredData = data.filter(item => item[key] === name);
      const totalProjects = filteredData.length;
      const uniqueClients = new Set(filteredData.map(item => item['Client Name'])).size;
      const uniqueExperts = new Set(filteredData.map(item => item['Expert Name'])).size;
      const completedProjects = filteredData.filter(item => 
        item['Expert Final Interaction State']?.toLowerCase().includes('completed')
      ).length;
      const completedRate = totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : '0';

      // Followup distribution
      const followupDistribution = filteredData.reduce((acc, item) => {
        const followupNumber = item['Expert Final Outreach/Followup Number'] || '0';
        const numericValue = parseInt(followupNumber, 10) || 0;
        if (numericValue >= 0 && numericValue <= 6) {
          acc[numericValue] = (acc[numericValue] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Event type distribution
      const eventTypeDistribution = filteredData.reduce((acc, item) => {
        const eventType = item['Event Type'] || 'Unknown';
        acc[eventType] = (acc[eventType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Geoscope distribution
      const geoscopeDistribution = filteredData.reduce((acc, item) => {
        const geoscope = item['Project Geoscope'] || 'Unknown';
        acc[geoscope] = (acc[geoscope] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        name,
        totalProjects,
        uniqueClients,
        uniqueExperts,
        completedProjects,
        completedRate,
        followupDistribution,
        eventTypeDistribution,
        geoscopeDistribution
      };
    }).sort((a, b) => {
      const aValue = sortConfig.field === 'completedRate' ? parseFloat(a[sortConfig.field as keyof typeof a] as string) : a[sortConfig.field as keyof typeof a];
      const bValue = sortConfig.field === 'completedRate' ? parseFloat(b[sortConfig.field as keyof typeof b] as string) : b[sortConfig.field as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [data, type, sortConfig]);

  const renderDistributionNarrow = (distribution: Record<string, number>, total: number) => {
    return Object.entries(distribution)
      .sort((a, b) => parseInt(b[1].toString()) - parseInt(a[1].toString()))
      .slice(0, 3)
      .map(([key, value]) => {
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
        return (
          <div key={key} className="distribution-item-narrow">
            <span className="distribution-key-narrow">{key}:</span>
            <span className="distribution-value-narrow">{value} ({percentage}%)</span>
          </div>
        );
      });
  };

  const normalizeDate = (value?: string) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  };

  const buildTimeSeries = (name: string, seriesKey: string) => {
    if (!type) return [];
    const key = type === 'managers' ? 'Project Manager' : 'Event Executor Associate';
    const items = data.filter(it => it[key] === name);

    const dateToValue: Record<string, number> = {};

    if (seriesKey === 'projects') {
      const dateToProjects: Record<string, Set<string>> = {};
      items.forEach(it => {
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
      items.forEach(it => {
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

    const series = Object.entries(dateToValue)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return series;
  };

  const seriesOptions = [
    { key: 'completed', label: 'Completed' },
    { key: 'indexed', label: 'Indexed' },
    { key: 'presented', label: 'Presented' },
    { key: 'events', label: 'All Events' },
    { key: 'projects', label: 'Projects' }
  ];

  if (!type) return null;

  const renderTimelineModal = () => {
    if (!timelineName) return null;
    const selectedSeries = seriesByName[timelineName] || 'completed';
    const timeSeries = buildTimeSeries(timelineName, selectedSeries);
    return (
      <div className="timeline-overlay">
        <div className="timeline-modal">
          <div className="timeline-header">
            <h3 className="timeline-title">{timelineName} • {seriesOptions.find(s => s.key === selectedSeries)?.label}</h3>
            <div className="timeline-controls">
              {seriesOptions.map(opt => (
                <button
                  key={opt.key}
                  className={`sort-button ${selectedSeries === opt.key ? 'active' : ''}`}
                  onClick={() => setSeriesByName(prev => ({ ...prev, [timelineName]: opt.key }))}
                >
                  {opt.label}
                </button>
              ))}
              <button className="close-button" onClick={() => setTimelineName(null)}>×</button>
            </div>
          </div>
          <div className="timeline-body">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ left: 20, right: 30, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip labelFormatter={(label) => `Date: ${label}`} formatter={(v: any) => [v, 'Count']} />
                <Line type="monotone" dataKey="value" stroke="#3498db" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // Highest values for KPIs
  const highestValues = {
    totalProjects: Math.max(...metrics.map(m => m.totalProjects)),
    uniqueClients: Math.max(...metrics.map(m => m.uniqueClients)),
    uniqueExperts: Math.max(...metrics.map(m => m.uniqueExperts)),
    completedProjects: Math.max(...metrics.map(m => m.completedProjects)),
    completedRate: Math.max(...metrics.map(m => parseFloat(m.completedRate)))
  };

  return (
    <div className="metrics-comparison">
      <div className="comparison-header">
        <h2>Compare All {type === 'managers' ? 'Managers' : 'Associates'}</h2>
        <div className="header-actions">
          <div className="sort-container">
            <button 
              className="sort-button"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              Sort by: {sortConfig.label}
            </button>
            {showSortOptions && (
              <div className="sort-dropdown">
                {sortOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`sort-option ${sortConfig.field === option.field && sortConfig.direction === option.direction ? 'active' : ''}`}
                    onClick={() => {
                      setSortConfig(option);
                      setShowSortOptions(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="back-button" onClick={onBack}>
            Back to Normal View
          </button>
        </div>
      </div>

      <div className="metrics-grid-narrow">
        {metrics.map((metric) => {
          return (
            <div key={metric.name} className="metric-column-narrow">
              <h3 className="metric-name-narrow">{metric.name}</h3>
              
              <div className="metric-kpis-narrow">
                <div className="metric-kpi-narrow">
                  <span className="kpi-label-narrow">Total:</span>
                  <span className={`kpi-value-narrow ${metric.totalProjects === highestValues.totalProjects ? 'highest-value' : ''}`}>
                    {metric.totalProjects}
                  </span>
                </div>
                
                <div className="metric-kpi-narrow">
                  <span className="kpi-label-narrow">Clients:</span>
                  <span className={`kpi-value-narrow ${metric.uniqueClients === highestValues.uniqueClients ? 'highest-value' : ''}`}>
                    {metric.uniqueClients}
                  </span>
                </div>
                
                <div className="metric-kpi-narrow">
                  <span className="kpi-label-narrow">Experts:</span>
                  <span className={`kpi-value-narrow ${metric.uniqueExperts === highestValues.uniqueExperts ? 'highest-value' : ''}`}>
                    {metric.uniqueExperts}
                  </span>
                </div>
                
                <div className="metric-kpi-narrow">
                  <span className="kpi-label-narrow">Completed:</span>
                  <span className={`kpi-value-narrow ${metric.completedProjects === highestValues.completedProjects ? 'highest-value' : ''}`}>
                    {metric.completedProjects}
                  </span>
                </div>
                
                <div className="metric-kpi-narrow">
                  <span className="kpi-label-narrow">Rate:</span>
                  <span className={`kpi-value-narrow ${parseFloat(metric.completedRate) === highestValues.completedRate ? 'highest-value' : ''}`}>
                    {metric.completedRate}%
                  </span>
                </div>
              </div>

              <div className="metric-distributions-narrow">
                <div className="distribution-section-narrow">
                  <h4 className="distribution-title-narrow">Followup</h4>
                  {renderDistributionNarrow(metric.followupDistribution, metric.totalProjects)}
                </div>

                <div className="distribution-section-narrow">
                  <h4 className="distribution-title-narrow">Event Type</h4>
                  {renderDistributionNarrow(metric.eventTypeDistribution, metric.totalProjects)}
                </div>

                <div className="distribution-section-narrow">
                  <h4 className="distribution-title-narrow">Geographic</h4>
                  {renderDistributionNarrow(metric.geoscopeDistribution, metric.totalProjects)}
                </div>
              </div>

              <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  className="sort-button"
                  onClick={() => setTimelineName(metric.name)}
                >
                  Show Timeline
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {renderTimelineModal()}
    </div>
  );
};

export default MetricsComparison; 