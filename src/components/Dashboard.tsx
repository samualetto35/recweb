import React, { useState, useMemo } from 'react';
import { ProjectData } from '../App';
import ProjectDistributionChart from './charts/ProjectDistributionChart';
import ProjectProgressChart from './charts/ProjectProgressChart';
import ProjectProgressFunnelV2 from './charts/ProjectProgressFunnelV2';
import GeoActivityChart from './charts/GeoActivityChart';
import SummaryBoxes from './SummaryBoxes';
import Filters from './Filters';
import MetricsComparison from './MetricsComparison';
import GlobalTimeline from './GlobalTimeline';

interface DashboardProps {
  data: ProjectData[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [filters, setFilters] = useState({
    projectType: '',
    projectManager: '',
    clientName: '',
    geoscope: '',
    industry: '',
    eventType: '',
    eventExecutorAssociate: '',
    expertFinalTermsState: '',
    dateRange: { start: '', end: '' }
  });

  const normalizeProjectType = (value: string): string => {
    if (!value) return '';
    const normalized = value.toString().toLowerCase().replace(/\./g, ' ').replace(/\s+/g, ' ').trim();
    if (normalized.includes('inex')) return 'inex one';
    if (normalized.includes('reticula')) return 'reticula';
    return normalized;
  };

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const canonicalTypes = ['All', 'Reticula', 'Inex One'];
    const additionalTypesRaw = Array.from(new Set(data.map(item => item['Project Type']))).filter(Boolean) as string[];
    const additionalTypes = additionalTypesRaw.filter((t) => {
      const n = normalizeProjectType(t);
      return n !== 'reticula' && n !== 'inex one';
    });
    const projectTypes = [...canonicalTypes, ...Array.from(new Set(additionalTypes))];
    const projectManagers = Array.from(new Set(data.map(item => item['Project Manager']))).filter(Boolean);
    const geoscopes = Array.from(new Set(data.map(item => item['Project Geoscope']))).filter(Boolean);
    const industries = Array.from(new Set(data.map(item => item['Project Industry']))).filter(Boolean);
    const eventTypes = Array.from(new Set(data.map(item => item['Event Type']))).filter(Boolean);
    const eventExecutorAssociates = Array.from(new Set(data.map(item => item['Event Executor Associate']))).filter(Boolean);
    const expertFinalTermsStates = Array.from(new Set(data.map(item => item['Expert Final Terms State']))).filter(Boolean);

    // Build client names from data constrained by current filters (excluding clientName to avoid circular dep)
    const dataForClientNames = data.filter(item => {
      if (filters.projectType && filters.projectType !== 'All') {
        const itemType = normalizeProjectType(item['Project Type'] || '');
        const selectedType = normalizeProjectType(filters.projectType);
        if (itemType !== selectedType) return false;
      }
      if (filters.projectManager && item['Project Manager'] !== filters.projectManager) return false;
      if (filters.geoscope && item['Project Geoscope'] !== filters.geoscope) return false;
      if (filters.industry && item['Project Industry'] !== filters.industry) return false;
      if (filters.eventType && item['Event Type'] !== filters.eventType) return false;
      if (filters.eventExecutorAssociate && item['Event Executor Associate'] !== filters.eventExecutorAssociate) return false;
      if (filters.expertFinalTermsState && item['Expert Final Terms State'] !== filters.expertFinalTermsState) return false;
      if (filters.dateRange.start || filters.dateRange.end) {
        const itemDate = new Date(item['Project Start Date']);
        if (filters.dateRange.start && itemDate < new Date(filters.dateRange.start)) return false;
        if (filters.dateRange.end && itemDate > new Date(filters.dateRange.end)) return false;
      }
      return true;
    });
    const clientNames = Array.from(new Set(dataForClientNames.map(item => item['Client Name']))).filter(Boolean);

    return {
      projectTypes,
      projectManagers,
      clientNames,
      geoscopes,
      industries,
      eventTypes,
      eventExecutorAssociates,
      expertFinalTermsStates
    };
  }, [data, filters]);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (filters.projectType && filters.projectType !== 'All') {
        const itemType = normalizeProjectType(item['Project Type'] || '');
        const selectedType = normalizeProjectType(filters.projectType);
        if (itemType !== selectedType) return false;
      }
      if (filters.projectManager && item['Project Manager'] !== filters.projectManager) return false;
      if (filters.clientName && item['Client Name'] !== filters.clientName) return false;
      if (filters.geoscope && item['Project Geoscope'] !== filters.geoscope) return false;
      if (filters.industry && item['Project Industry'] !== filters.industry) return false;
      if (filters.eventType && item['Event Type'] !== filters.eventType) return false;
      if (filters.eventExecutorAssociate && item['Event Executor Associate'] !== filters.eventExecutorAssociate) return false;
      if (filters.expertFinalTermsState && item['Expert Final Terms State'] !== filters.expertFinalTermsState) return false;
      
      if (filters.dateRange.start || filters.dateRange.end) {
        const itemDate = new Date(item['Project Start Date']);
        if (filters.dateRange.start && itemDate < new Date(filters.dateRange.start)) return false;
        if (filters.dateRange.end && itemDate > new Date(filters.dateRange.end)) return false;
      }
      
      return true;
    });
  }, [data, filters]);

  const handleFilterChange = (filterType: string, value: string | { start: string; end: string }) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const [isComparing, setIsComparing] = useState(false);
  const [firstConditionData, setFirstConditionData] = useState<ProjectData[]>([]);
  const [secondConditionData, setSecondConditionData] = useState<ProjectData[]>([]);
  const [metricsComparisonType, setMetricsComparisonType] = useState<'managers' | 'associates' | null>(null);

  const handleCompareClick = () => {
    console.log('Compare button clicked');
  };

  const handleCompareAllManagers = () => {
    setMetricsComparisonType('managers');
  };

  const handleCompareAllAssociates = () => {
    setMetricsComparisonType('associates');
  };

  const handleBackFromMetricsComparison = () => {
    setMetricsComparisonType(null);
  };

  const handleComparisonComplete = (firstCondition: any, secondCondition: any) => {
    const firstData = data.filter(item => {
      if (firstCondition.projectType && firstCondition.projectType !== 'All') {
        const itemType = normalizeProjectType(item['Project Type'] || '');
        const selectedType = normalizeProjectType(firstCondition.projectType);
        if (itemType !== selectedType) return false;
      }
      if (firstCondition.projectManager && item['Project Manager'] !== firstCondition.projectManager) return false;
      if (firstCondition.clientName && item['Client Name'] !== firstCondition.clientName) return false;
      if (firstCondition.geoscope && item['Project Geoscope'] !== firstCondition.geoscope) return false;
      if (firstCondition.industry && item['Project Industry'] !== firstCondition.industry) return false;
      if (firstCondition.eventType && item['Event Type'] !== firstCondition.eventType) return false;
      if (firstCondition.eventExecutorAssociate && item['Event Executor Associate'] !== firstCondition.eventExecutorAssociate) return false;
      if (firstCondition.expertFinalTermsState && item['Expert Final Terms State'] !== firstCondition.expertFinalTermsState) return false;
      
      if (firstCondition.dateRange.start || firstCondition.dateRange.end) {
        const itemDate = new Date(item['Project Start Date']);
        if (firstCondition.dateRange.start && itemDate < new Date(firstCondition.dateRange.start)) return false;
        if (firstCondition.dateRange.end && itemDate > new Date(firstCondition.dateRange.end)) return false;
      }
      
      return true;
    });

    const secondData = data.filter(item => {
      if (secondCondition.projectType && secondCondition.projectType !== 'All') {
        const itemType = normalizeProjectType(item['Project Type'] || '');
        const selectedType = normalizeProjectType(secondCondition.projectType);
        if (itemType !== selectedType) return false;
      }
      if (secondCondition.projectManager && item['Project Manager'] !== secondCondition.projectManager) return false;
      if (secondCondition.clientName && item['Client Name'] !== secondCondition.clientName) return false;
      if (secondCondition.geoscope && item['Project Geoscope'] !== secondCondition.geoscope) return false;
      if (secondCondition.industry && item['Project Industry'] !== secondCondition.industry) return false;
      if (secondCondition.eventType && item['Event Type'] !== secondCondition.eventType) return false;
      if (secondCondition.eventExecutorAssociate && item['Event Executor Associate'] !== secondCondition.eventExecutorAssociate) return false;
      if (secondCondition.expertFinalTermsState && item['Expert Final Terms State'] !== secondCondition.expertFinalTermsState) return false;
      
      if (secondCondition.dateRange.start || secondCondition.dateRange.end) {
        const itemDate = new Date(item['Project Start Date']);
        if (secondCondition.dateRange.start && itemDate < new Date(secondCondition.dateRange.start)) return false;
        if (secondCondition.dateRange.end && itemDate > new Date(secondCondition.dateRange.end)) return false;
      }
      
      return true;
    });

    setFirstConditionData(firstData);
    setSecondConditionData(secondData);
    setIsComparing(true);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Project Analytics Dashboard</h1>
        <p>Interactive visualization of your project data</p>
      </div>

      <Filters 
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onCompareClick={handleCompareClick}
        onComparisonComplete={handleComparisonComplete}
        onCompareAllManagers={handleCompareAllManagers}
        onCompareAllAssociates={handleCompareAllAssociates}
      />

      {!isComparing && !metricsComparisonType ? (
        <>
          <GlobalTimeline data={filteredData} />
          <SummaryBoxes data={filteredData} />

          <div className="charts-grid">
            <div className="chart-container">
              <h3>Project Distribution by Interaction State</h3>
              <ProjectDistributionChart data={filteredData} />
            </div>

            <div className="chart-container">
              <h3>Expert Final Outreach/Followup Number Distribution</h3>
              <ProjectProgressChart data={filteredData} />
            </div>

            <div className="chart-container">
              <h3>Project Progress Funnel V2 (Event Type)</h3>
              <ProjectProgressFunnelV2 data={filteredData} />
            </div>

            <div className="chart-container">
              <h3>Geographic Activity</h3>
              <GeoActivityChart data={filteredData} />
            </div>
          </div>
        </>
      ) : isComparing ? (
        <>
          <div className="comparison-header">
            <h2>Data Comparison</h2>
            <button 
              className="back-button"
              onClick={() => setIsComparing(false)}
            >
              Back to Normal View
            </button>
          </div>

          <div className="comparison-grid">
            <div className="comparison-column">
              <h3>Condition 1</h3>
              <SummaryBoxes data={firstConditionData} />
              
              <div className="charts-grid">
                <div className="chart-container">
                  <h4>Project Distribution</h4>
                  <ProjectDistributionChart data={firstConditionData} />
                </div>

                <div className="chart-container">
                  <h4>Followup Number Distribution</h4>
                  <ProjectProgressChart data={firstConditionData} />
                </div>

                <div className="chart-container">
                  <h4>Event Type Distribution</h4>
                  <ProjectProgressFunnelV2 data={firstConditionData} />
                </div>

                <div className="chart-container">
                  <h4>Geographic Activity</h4>
                  <GeoActivityChart data={firstConditionData} />
                </div>
              </div>
            </div>

            <div className="comparison-column">
              <h3>Condition 2</h3>
              <SummaryBoxes data={secondConditionData} />
              
              <div className="charts-grid">
                <div className="chart-container">
                  <h4>Project Distribution</h4>
                  <ProjectDistributionChart data={secondConditionData} />
                </div>

                <div className="chart-container">
                  <h4>Followup Number Distribution</h4>
                  <ProjectProgressChart data={secondConditionData} />
                </div>

                <div className="chart-container">
                  <h4>Event Type Distribution</h4>
                  <ProjectProgressFunnelV2 data={secondConditionData} />
                </div>

                <div className="chart-container">
                  <h4>Geographic Activity</h4>
                  <GeoActivityChart data={secondConditionData} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : metricsComparisonType ? (
        <MetricsComparison 
          data={filteredData}
          type={metricsComparisonType}
          onBack={handleBackFromMetricsComparison}
        />
      ) : null}
    </div>
  );
};

export default Dashboard; 