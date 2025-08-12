import React, { useMemo } from 'react';
import { ClientMetricsData } from '../App';

interface ClientMetricsSummaryBoxesProps {
  data: ClientMetricsData[];
}

const ClientMetricsSummaryBoxes: React.FC<ClientMetricsSummaryBoxesProps> = ({ data }) => {
  const metrics = useMemo(() => {
    const totalClients = data.length;
    const totalReticulaCalls = data.reduce((sum, item) => sum + parseInt(item['Reticula Completed Calls'] || '0'), 0);
    const totalInexOneExpected = data.reduce((sum, item) => sum + parseInt(item['Inex One Expected Calls'] || '0'), 0);
    const totalInexOneCompleted = data.reduce((sum, item) => sum + parseInt(item['Inex One Completed Calls'] || '0'), 0);
    
    // Calculate average rate
    const rates = data.map(item => parseFloat(item['Rate'] || '0')).filter(rate => rate > 0);
    const averageRate = rates.length > 0 ? (rates.reduce((sum, rate) => sum + rate, 0) / rates.length).toFixed(2) : '0';
    
    // Calculate completion rate for Inex One
    const completionRate = totalInexOneExpected > 0 ? ((totalInexOneCompleted / totalInexOneExpected) * 100).toFixed(1) : '0';

    return {
      totalClients,
      totalReticulaCalls,
      totalInexOneExpected,
      totalInexOneCompleted,
      averageRate,
      completionRate
    };
  }, [data]);

  return (
    <div className="summary-boxes">
      <div className="summary-box">
        <div className="summary-icon">👥</div>
        <div className="summary-content">
          <div className="summary-number">{metrics.totalClients}</div>
          <div className="summary-label">Total Clients</div>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon">📞</div>
        <div className="summary-content">
          <div className="summary-number">{metrics.totalReticulaCalls}</div>
          <div className="summary-label">Reticula Calls</div>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon">🎯</div>
        <div className="summary-content">
          <div className="summary-number">{metrics.totalInexOneExpected}</div>
          <div className="summary-label">Expected Inex One</div>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon">✅</div>
        <div className="summary-content">
          <div className="summary-number">{metrics.totalInexOneCompleted}</div>
          <div className="summary-label">Completed Inex One</div>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon">📊</div>
        <div className="summary-content">
          <div className="summary-number">{metrics.averageRate}</div>
          <div className="summary-label">Avg Rate</div>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-icon">📈</div>
        <div className="summary-content">
          <div className="summary-number">{metrics.completionRate}%</div>
          <div className="summary-label">Completion Rate</div>
        </div>
      </div>
    </div>
  );
};

export default ClientMetricsSummaryBoxes; 