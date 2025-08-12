import React, { useMemo, useState } from 'react';
import { ProjectData } from '../App';

interface MetricsComparisonProps {
  data: ProjectData[];
  type: 'managers' | 'associates' | null;
  onBack: () => void;
}

interface ManagerMetrics {
  name: string;
  totalProjects: number;
  uniqueClients: number;
  uniqueExperts: number;
  completedProjects: number;
  completedRate: string;
  followupDistribution: Record<string, number>;
  eventTypeDistribution: Record<string, number>;
  geoscopeDistribution: Record<string, number>;
}

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

  const renderDistribution = (distribution: Record<string, number>, total: number) => {
    return Object.entries(distribution)
      .sort((a, b) => parseInt(b[1].toString()) - parseInt(a[1].toString()))
      .map(([key, value]) => {
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
        return (
          <div key={key} className="distribution-item">
            <span className="distribution-key">{key}:</span>
            <span className="distribution-value">{value} ({percentage}%)</span>
          </div>
        );
      });
  };

  // Find highest values for each metric
  const findHighestValues = () => {
    const highestValues = {
      totalProjects: Math.max(...metrics.map(m => m.totalProjects)),
      uniqueClients: Math.max(...metrics.map(m => m.uniqueClients)),
      uniqueExperts: Math.max(...metrics.map(m => m.uniqueExperts)),
      completedProjects: Math.max(...metrics.map(m => m.completedProjects)),
      completedRate: Math.max(...metrics.map(m => parseFloat(m.completedRate)))
    };
    return highestValues;
  };

  const highestValues = findHighestValues();

  const renderDistributionNarrow = (distribution: Record<string, number>, total: number) => {
    return Object.entries(distribution)
      .sort((a, b) => parseInt(b[1].toString()) - parseInt(a[1].toString()))
      .slice(0, 3) // Show only top 3
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

  if (!type) return null;

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
        {metrics.map((metric, index) => (
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsComparison; 