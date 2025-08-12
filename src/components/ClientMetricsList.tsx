import React from 'react';
import { ClientMetricsData } from '../App';

interface ClientMetricsListProps {
  data: ClientMetricsData[];
  sortConfig: {
    field: keyof ClientMetricsData;
    direction: 'asc' | 'desc';
  };
  onSortChange: (field: keyof ClientMetricsData, direction: 'asc' | 'desc') => void;
}

const ClientMetricsList: React.FC<ClientMetricsListProps> = ({ data, sortConfig, onSortChange }) => {
  const handleSort = (field: keyof ClientMetricsData) => {
    const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSortChange(field, direction);
  };

  const getSortIcon = (field: keyof ClientMetricsData) => {
    if (sortConfig.field !== field) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="client-metrics-list">
      <div className="list-header">
        <h3>Client Metrics List</h3>
        <p>Showing {data.length} clients</p>
      </div>

      <div className="list-table">
        <div className="list-table-header">
          <div 
            className="list-header-cell sortable"
            onClick={() => handleSort('Client Name')}
          >
            Client Name {getSortIcon('Client Name')}
          </div>
          <div 
            className="list-header-cell sortable"
            onClick={() => handleSort('Reticula Completed Calls')}
          >
            Reticula Calls {getSortIcon('Reticula Completed Calls')}
          </div>
          <div 
            className="list-header-cell sortable"
            onClick={() => handleSort('Inex One Expected Calls')}
          >
            Expected Inex One {getSortIcon('Inex One Expected Calls')}
          </div>
          <div 
            className="list-header-cell sortable"
            onClick={() => handleSort('Inex One Completed Calls')}
          >
            Completed Inex One {getSortIcon('Inex One Completed Calls')}
          </div>
          <div 
            className="list-header-cell sortable"
            onClick={() => handleSort('Rate')}
          >
            Rate {getSortIcon('Rate')}
          </div>
          <div className="list-header-cell">
            Completion %
          </div>
        </div>

        <div className="list-table-body">
          {data.map((item, index) => {
            const reticulaCalls = parseInt(item['Reticula Completed Calls'] || '0');
            const inexOneExpected = parseInt(item['Inex One Expected Calls'] || '0');
            const inexOneCompleted = parseInt(item['Inex One Completed Calls'] || '0');
            const rate = parseFloat(item['Rate'] || '0');
            const completionRate = inexOneExpected > 0 ? ((inexOneCompleted / inexOneExpected) * 100).toFixed(1) : '0';

            return (
              <div key={index} className="list-table-row">
                <div className="list-cell">{item['Client Name']}</div>
                <div className="list-cell number">{reticulaCalls.toLocaleString()}</div>
                <div className="list-cell number">{inexOneExpected.toLocaleString()}</div>
                <div className="list-cell number">{inexOneCompleted.toLocaleString()}</div>
                <div className="list-cell number">{rate.toFixed(2)}</div>
                <div className="list-cell number">{completionRate}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {data.length === 0 && (
        <div className="no-data">
          <p>No data available. Please check your filters or upload data.</p>
        </div>
      )}
    </div>
  );
};

export default ClientMetricsList; 