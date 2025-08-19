import React, { useState } from 'react';

interface FiltersProps {
  filters: {
    projectType: string;
    projectManager: string;
    clientName: string;
    geoscope: string;
    industry: string;
    eventType: string;
    eventExecutorAssociate: string;
    expertFinalTermsState: string;
    dateRange: { start: string; end: string };
  };
  filterOptions: {
    projectTypes: string[];
    projectManagers: string[];
    clientNames: string[];
    geoscopes: string[];
    industries: string[];
    eventTypes: string[];
    eventExecutorAssociates: string[];
    expertFinalTermsStates: string[];
  };
  onFilterChange: (filterType: string, value: string | { start: string; end: string }) => void;
  onCompareClick: () => void;
  onComparisonComplete?: (firstCondition: any, secondCondition: any) => void;
  onCompareAllManagers?: () => void;
  onCompareAllAssociates?: () => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, filterOptions, onFilterChange, onCompareClick, onComparisonComplete, onCompareAllManagers, onCompareAllAssociates }) => {
  const [showComparePopup, setShowComparePopup] = useState(false);
  const [compareStep, setCompareStep] = useState(1);
  const [firstCondition, setFirstCondition] = useState({
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
  const [secondCondition, setSecondCondition] = useState({
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

  const handleCompareClick = () => {
    setShowComparePopup(true);
    setCompareStep(1);
  };

  const handleFirstConditionSave = () => {
    setCompareStep(2);
  };

  const handleSecondConditionSave = () => {
    setShowComparePopup(false);
    setCompareStep(1);
    if (onComparisonComplete) {
      onComparisonComplete(firstCondition, secondCondition);
    }
  };

  const handleConditionChange = (step: number, filterType: string, value: string | { start: string; end: string }) => {
    if (step === 1) {
      setFirstCondition(prev => ({ ...prev, [filterType]: value }));
    } else {
      setSecondCondition(prev => ({ ...prev, [filterType]: value }));
    }
  };

  return (
    <div className="filters">
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="projectType">Project Type</label>
          <select
            id="projectType"
            value={filters.projectType}
            onChange={(e) => onFilterChange('projectType', e.target.value)}
          >
            <option value="">All Types</option>
            {filterOptions.projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="projectManager">Project Manager</label>
          <select
            id="projectManager"
            value={filters.projectManager}
            onChange={(e) => onFilterChange('projectManager', e.target.value)}
          >
            <option value="">All Managers</option>
            {filterOptions.projectManagers.map((manager) => (
              <option key={manager} value={manager}>
                {manager}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="clientName">Client Name</label>
          <select
            id="clientName"
            value={filters.clientName}
            onChange={(e) => onFilterChange('clientName', e.target.value)}
          >
            <option value="">All Clients</option>
            {filterOptions.clientNames.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="geoscope">Geoscope</label>
          <select
            id="geoscope"
            value={filters.geoscope}
            onChange={(e) => onFilterChange('geoscope', e.target.value)}
          >
            <option value="">All Regions</option>
            {filterOptions.geoscopes.map((geo) => (
              <option key={geo} value={geo}>
                {geo}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="industry">Industry</label>
          <select
            id="industry"
            value={filters.industry}
            onChange={(e) => onFilterChange('industry', e.target.value)}
          >
            <option value="">All Industries</option>
            {filterOptions.industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="eventType">Event Type</label>
          <select
            id="eventType"
            value={filters.eventType}
            onChange={(e) => onFilterChange('eventType', e.target.value)}
          >
            <option value="">All Event Types</option>
            {filterOptions.eventTypes.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="eventExecutorAssociate">Event Executor Associate</label>
          <select
            id="eventExecutorAssociate"
            value={filters.eventExecutorAssociate}
            onChange={(e) => onFilterChange('eventExecutorAssociate', e.target.value)}
          >
            <option value="">All Associates</option>
            {filterOptions.eventExecutorAssociates.map((associate) => (
              <option key={associate} value={associate}>
                {associate}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="expertFinalTermsState">Expert Final Terms State</label>
          <select
            id="expertFinalTermsState"
            value={filters.expertFinalTermsState}
            onChange={(e) => onFilterChange('expertFinalTermsState', e.target.value)}
          >
            <option value="">All Terms States</option>
            {filterOptions.expertFinalTermsStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters-row">
        <div className="date-filters">
          <div className="filter-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={filters.dateRange.start}
              onChange={(e) => onFilterChange('dateRange', { 
                ...filters.dateRange, 
                start: e.target.value 
              })}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              value={filters.dateRange.end}
              onChange={(e) => onFilterChange('dateRange', { 
                ...filters.dateRange, 
                end: e.target.value 
              })}
            />
          </div>
        </div>

        <div className="compare-section">
          <button 
            className="compare-button"
            onClick={handleCompareClick}
          >
            Compare
          </button>
          <button 
            className="compare-button"
            onClick={() => onCompareAllManagers && onCompareAllManagers()}
          >
            Compare All Managers
          </button>
          <button 
            className="compare-button"
            onClick={() => onCompareAllAssociates && onCompareAllAssociates()}
          >
            Compare All Associates
          </button>
        </div>
      </div>

      {/* Compare Popup */}
      {showComparePopup && (
        <div className="compare-popup-overlay">
          <div className="compare-popup">
            <div className="popup-header">
              <h3>Compare Data</h3>
              <button 
                className="close-button"
                onClick={() => setShowComparePopup(false)}
              >
                ×
              </button>
            </div>
            
            <div className="popup-content">
              <h4>{compareStep === 1 ? 'First Condition' : 'Second Condition'}</h4>
              
              <div className="popup-filters">
                <div className="filter-group">
                  <label>Project Type</label>
                  <select
                    value={compareStep === 1 ? firstCondition.projectType : secondCondition.projectType}
                    onChange={(e) => handleConditionChange(compareStep, 'projectType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    {filterOptions.projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Project Manager</label>
                  <select
                    value={compareStep === 1 ? firstCondition.projectManager : secondCondition.projectManager}
                    onChange={(e) => handleConditionChange(compareStep, 'projectManager', e.target.value)}
                  >
                    <option value="">All Managers</option>
                    {filterOptions.projectManagers.map((manager) => (
                      <option key={manager} value={manager}>
                        {manager}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Client Name</label>
                  <select
                    value={compareStep === 1 ? firstCondition.clientName : secondCondition.clientName}
                    onChange={(e) => handleConditionChange(compareStep, 'clientName', e.target.value)}
                  >
                    <option value="">All Clients</option>
                    {filterOptions.clientNames.map((client) => (
                      <option key={client} value={client}>
                        {client}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Geoscope</label>
                  <select
                    value={compareStep === 1 ? firstCondition.geoscope : secondCondition.geoscope}
                    onChange={(e) => handleConditionChange(compareStep, 'geoscope', e.target.value)}
                  >
                    <option value="">All Regions</option>
                    {filterOptions.geoscopes.map((geo) => (
                      <option key={geo} value={geo}>
                        {geo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Industry</label>
                  <select
                    value={compareStep === 1 ? firstCondition.industry : secondCondition.industry}
                    onChange={(e) => handleConditionChange(compareStep, 'industry', e.target.value)}
                  >
                    <option value="">All Industries</option>
                    {filterOptions.industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Event Type</label>
                  <select
                    value={compareStep === 1 ? firstCondition.eventType : secondCondition.eventType}
                    onChange={(e) => handleConditionChange(compareStep, 'eventType', e.target.value)}
                  >
                    <option value="">All Event Types</option>
                    {filterOptions.eventTypes.map((eventType) => (
                      <option key={eventType} value={eventType}>
                        {eventType}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Event Executor Associate</label>
                  <select
                    value={compareStep === 1 ? firstCondition.eventExecutorAssociate : secondCondition.eventExecutorAssociate}
                    onChange={(e) => handleConditionChange(compareStep, 'eventExecutorAssociate', e.target.value)}
                  >
                    <option value="">All Associates</option>
                    {filterOptions.eventExecutorAssociates.map((associate) => (
                      <option key={associate} value={associate}>
                        {associate}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Expert Final Terms State</label>
                  <select
                    value={compareStep === 1 ? firstCondition.expertFinalTermsState : secondCondition.expertFinalTermsState}
                    onChange={(e) => handleConditionChange(compareStep, 'expertFinalTermsState', e.target.value)}
                  >
                    <option value="">All Terms States</option>
                    {filterOptions.expertFinalTermsStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={compareStep === 1 ? firstCondition.dateRange.start : secondCondition.dateRange.start}
                    onChange={(e) => handleConditionChange(compareStep, 'dateRange', { 
                      ...(compareStep === 1 ? firstCondition.dateRange : secondCondition.dateRange), 
                      start: e.target.value 
                    })}
                  />
                </div>

                <div className="filter-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={compareStep === 1 ? firstCondition.dateRange.end : secondCondition.dateRange.end}
                    onChange={(e) => handleConditionChange(compareStep, 'dateRange', { 
                      ...(compareStep === 1 ? firstCondition.dateRange : secondCondition.dateRange), 
                      end: e.target.value 
                    })}
                  />
                </div>
              </div>

              <div className="popup-actions">
                {compareStep === 1 ? (
                  <button 
                    className="save-button"
                    onClick={handleFirstConditionSave}
                  >
                    Save First Condition
                  </button>
                ) : (
                  <button 
                    className="save-button"
                    onClick={handleSecondConditionSave}
                  >
                    Compare Data
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters; 