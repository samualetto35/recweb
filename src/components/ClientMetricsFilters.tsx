import React from 'react';
import { ClientMetricsData } from '../App';

interface ClientMetricsFiltersProps {
  filters: {
    clientName: string;
    minRate: string;
    maxRate: string;
    minReticulaCalls: string;
    maxReticulaCalls: string;
    minInexOneExpected: string;
    maxInexOneExpected: string;
    minInexOneCompleted: string;
    maxInexOneCompleted: string;
  };
  filterOptions: {
    clientNames: string[];
  };
  onFilterChange: (filters: any) => void;
  onSortChange: (field: keyof ClientMetricsData, direction: 'asc' | 'desc') => void;
  sortConfig: {
    field: keyof ClientMetricsData;
    direction: 'asc' | 'desc';
  };
}

const ClientMetricsFilters: React.FC<ClientMetricsFiltersProps> = ({
  filters,
  filterOptions,
  onFilterChange,
  onSortChange,
  sortConfig
}) => {
  const handleInputChange = (field: string, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const handleSortChange = (field: keyof ClientMetricsData) => {
    const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSortChange(field, direction);
  };

  return (
    <div className="filters">
      <div className="filters-row">
        <div className="filter-group">
          <label>Client Name:</label>
          <input
            type="text"
            value={filters.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            placeholder="Search client name..."
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Rate Range:</label>
          <div className="range-inputs">
            <input
              type="number"
              value={filters.minRate}
              onChange={(e) => handleInputChange('minRate', e.target.value)}
              placeholder="Min"
              className="filter-input range-input"
            />
            <span>-</span>
            <input
              type="number"
              value={filters.maxRate}
              onChange={(e) => handleInputChange('maxRate', e.target.value)}
              placeholder="Max"
              className="filter-input range-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Reticula Calls Range:</label>
          <div className="range-inputs">
            <input
              type="number"
              value={filters.minReticulaCalls}
              onChange={(e) => handleInputChange('minReticulaCalls', e.target.value)}
              placeholder="Min"
              className="filter-input range-input"
            />
            <span>-</span>
            <input
              type="number"
              value={filters.maxReticulaCalls}
              onChange={(e) => handleInputChange('maxReticulaCalls', e.target.value)}
              placeholder="Max"
              className="filter-input range-input"
            />
          </div>
        </div>
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label>Inex One Expected Range:</label>
          <div className="range-inputs">
            <input
              type="number"
              value={filters.minInexOneExpected}
              onChange={(e) => handleInputChange('minInexOneExpected', e.target.value)}
              placeholder="Min"
              className="filter-input range-input"
            />
            <span>-</span>
            <input
              type="number"
              value={filters.maxInexOneExpected}
              onChange={(e) => handleInputChange('maxInexOneExpected', e.target.value)}
              placeholder="Max"
              className="filter-input range-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Inex One Completed Range:</label>
          <div className="range-inputs">
            <input
              type="number"
              value={filters.minInexOneCompleted}
              onChange={(e) => handleInputChange('minInexOneCompleted', e.target.value)}
              placeholder="Min"
              className="filter-input range-input"
            />
            <span>-</span>
            <input
              type="number"
              value={filters.maxInexOneCompleted}
              onChange={(e) => handleInputChange('maxInexOneCompleted', e.target.value)}
              placeholder="Max"
              className="filter-input range-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <div className="sort-buttons">
            <button
              className={`sort-button ${sortConfig.field === 'Client Name' ? 'active' : ''}`}
              onClick={() => handleSortChange('Client Name')}
            >
              Client Name {sortConfig.field === 'Client Name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-button ${sortConfig.field === 'Rate' ? 'active' : ''}`}
              onClick={() => handleSortChange('Rate')}
            >
              Rate {sortConfig.field === 'Rate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-button ${sortConfig.field === 'Reticula Completed Calls' ? 'active' : ''}`}
              onClick={() => handleSortChange('Reticula Completed Calls')}
            >
              Reticula Calls {sortConfig.field === 'Reticula Completed Calls' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-button ${sortConfig.field === 'Inex One Expected Calls' ? 'active' : ''}`}
              onClick={() => handleSortChange('Inex One Expected Calls')}
            >
              Expected {sortConfig.field === 'Inex One Expected Calls' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-button ${sortConfig.field === 'Inex One Completed Calls' ? 'active' : ''}`}
              onClick={() => handleSortChange('Inex One Completed Calls')}
            >
              Completed {sortConfig.field === 'Inex One Completed Calls' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientMetricsFilters; 