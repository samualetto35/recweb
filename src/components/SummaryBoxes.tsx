import React, { useMemo } from 'react';
import { ProjectData } from '../App';

interface SummaryBoxesProps {
  data: ProjectData[];
}

const SummaryBoxes: React.FC<SummaryBoxesProps> = ({ data }) => {
  const summary = useMemo(() => {
    const totalProjects = data.length;
    const uniqueClients = new Set(data.map(item => item['Client Name'])).size;
    const uniqueExperts = new Set(data.map(item => item['Expert Name'])).size;
    const completedProjects = data.filter(item => 
      item['Expert Final Interaction State']?.toLowerCase().includes('completed')
    ).length;
    const completedRate = totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : '0';

    return {
      totalProjects,
      uniqueClients,
      uniqueExperts,
      completedProjects,
      completedRate
    };
  }, [data]);

  return (
    <div className="summary-boxes">
      <div className="summary-box">
        <div className="summary-icon">📊</div>
        <div className="summary-content">
          <h3>Total Projects</h3>
          <p className="summary-number">{summary.totalProjects}</p>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon">🏢</div>
        <div className="summary-content">
          <h3>Unique Clients</h3>
          <p className="summary-number">{summary.uniqueClients}</p>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon">👥</div>
        <div className="summary-content">
          <h3>Unique Experts</h3>
          <p className="summary-number">{summary.uniqueExperts}</p>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon">✅</div>
        <div className="summary-content">
          <h3>Completed</h3>
          <p className="summary-number">{summary.completedProjects}</p>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon">📊</div>
        <div className="summary-content">
          <h3>Completed Rate</h3>
          <p className="summary-number">{summary.completedRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryBoxes; 