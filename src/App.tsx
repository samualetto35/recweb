import React, { useState } from 'react';
import './App.css';
import CSVUploader from './components/CSVUploader';
import Dashboard from './components/Dashboard';
import ClientMetricsUploader from './components/ClientMetricsUploader';
import ClientMetricsDashboard from './components/ClientMetricsDashboard';

export interface ProjectData {
  'Project Name': string;
  'Project Start Date': string;
  'Project Geoscope': string;
  'Project Industry': string;
  'Project Manager': string;
  'Project Associates': string;
  'Project Demand': string;
  'Client Name': string;
  'Project Type': string;
  'Expert Name': string;
  'Expert Final Terms State': string;
  'Expert Final Interaction State': string;
  'Expert Final Outreach/Followup Number': string;
  'Event Executor Associate': string;
  'Event Type': string;
  'Event Date': string;
}

export interface ClientMetricsData {
  'Client Name': string;
  'Reticula Completed Calls': string;
  'Inex One Expected Calls': string;
  'Inex One Completed Calls': string;
  'Rate': string;
}

function App() {
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [isProjectDataLoaded, setIsProjectDataLoaded] = useState(false);
  const [clientMetricsData, setClientMetricsData] = useState<ClientMetricsData[]>([]);
  const [isClientMetricsDataLoaded, setIsClientMetricsDataLoaded] = useState(false);

  const handleProjectDataLoaded = (csvData: ProjectData[]) => {
    setProjectData(csvData);
    setIsProjectDataLoaded(true);
  };

  const handleClientMetricsDataLoaded = (csvData: ClientMetricsData[]) => {
    setClientMetricsData(csvData);
    setIsClientMetricsDataLoaded(true);
  };

  return (
    <div className="App">
      {!isProjectDataLoaded && !isClientMetricsDataLoaded ? (
        <div className="upload-sections">
          <div className="upload-section">
            <h2>Project Data Dashboard</h2>
            <p>Upload CSV with project details, expert interactions, and event data</p>
            <CSVUploader onDataLoaded={handleProjectDataLoaded} />
          </div>
          
          <div className="upload-section">
            <h2>Client Metrics Dashboard</h2>
            <p>Upload CSV with client performance metrics and completion rates</p>
            <ClientMetricsUploader onDataLoaded={handleClientMetricsDataLoaded} />
          </div>
        </div>
      ) : isProjectDataLoaded ? (
        <Dashboard data={projectData} />
      ) : (
        <ClientMetricsDashboard data={clientMetricsData} />
      )}
    </div>
  );
}

export default App;
