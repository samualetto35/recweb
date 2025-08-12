import React, { useState, useMemo } from 'react';
import { ClientMetricsData } from '../App';
import ClientMetricsSummaryBoxes from './ClientMetricsSummaryBoxes';
import ClientMetricsFilters from './ClientMetricsFilters';
import ClientMetricsCharts from './ClientMetricsCharts';
import ClientMetricsList from './ClientMetricsList';

interface ClientMetricsDashboardProps {
  data: ClientMetricsData[];
}

const ClientMetricsDashboard: React.FC<ClientMetricsDashboardProps> = ({ data }) => {
  const [filters, setFilters] = useState({
    clientName: '',
    minRate: '',
    maxRate: '',
    minReticulaCalls: '',
    maxReticulaCalls: '',
    minInexOneExpected: '',
    maxInexOneExpected: '',
    minInexOneCompleted: '',
    maxInexOneCompleted: ''
  });

  const [sortConfig, setSortConfig] = useState({
    field: 'Client Name' as keyof ClientMetricsData,
    direction: 'asc' as 'asc' | 'desc'
  });

  const [showList, setShowList] = useState(false);

  const filterOptions = useMemo(() => {
    return {
      clientNames: Array.from(new Set(data.map(item => item['Client Name']))).filter(Boolean).sort()
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const clientName = item['Client Name'].toLowerCase();
      const rate = parseFloat(item['Rate']);
      const reticulaCalls = parseInt(item['Reticula Completed Calls']);
      const inexOneExpected = parseInt(item['Inex One Expected Calls']);
      const inexOneCompleted = parseInt(item['Inex One Completed Calls']);

      return (
        (!filters.clientName || clientName.includes(filters.clientName.toLowerCase())) &&
        (!filters.minRate || rate >= parseFloat(filters.minRate)) &&
        (!filters.maxRate || rate <= parseFloat(filters.maxRate)) &&
        (!filters.minReticulaCalls || reticulaCalls >= parseInt(filters.minReticulaCalls)) &&
        (!filters.maxReticulaCalls || reticulaCalls <= parseInt(filters.maxReticulaCalls)) &&
        (!filters.minInexOneExpected || inexOneExpected >= parseInt(filters.minInexOneExpected)) &&
        (!filters.maxInexOneExpected || inexOneExpected <= parseInt(filters.maxInexOneExpected)) &&
        (!filters.minInexOneCompleted || inexOneCompleted >= parseInt(filters.minInexOneCompleted)) &&
        (!filters.maxInexOneCompleted || inexOneCompleted <= parseInt(filters.maxInexOneCompleted))
      );
    });
  }, [data, filters]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (sortConfig.field === 'Rate' || sortConfig.field === 'Reticula Completed Calls' || 
          sortConfig.field === 'Inex One Expected Calls' || sortConfig.field === 'Inex One Completed Calls') {
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    });
  }, [filteredData, sortConfig]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (field: keyof ClientMetricsData, direction: 'asc' | 'desc') => {
    setSortConfig({ field, direction });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Client Metrics Dashboard</h1>
        <div className="dashboard-actions">
          <button 
            className={`view-toggle-button ${!showList ? 'active' : ''}`}
            onClick={() => setShowList(false)}
          >
            Charts View
          </button>
          <button 
            className={`view-toggle-button ${showList ? 'active' : ''}`}
            onClick={() => setShowList(true)}
          >
            List View
          </button>
        </div>
      </div>

      <ClientMetricsFilters 
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        sortConfig={sortConfig}
      />

      <ClientMetricsSummaryBoxes data={filteredData} />

      {showList ? (
        <ClientMetricsList 
          data={sortedData}
          sortConfig={sortConfig}
          onSortChange={handleSortChange}
        />
      ) : (
        <ClientMetricsCharts data={filteredData} />
      )}
    </div>
  );
};

export default ClientMetricsDashboard; 