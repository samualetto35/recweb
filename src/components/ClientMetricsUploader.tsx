import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { ClientMetricsData } from '../App';

interface ClientMetricsUploaderProps {
  onDataLoaded: (data: ClientMetricsData[]) => void;
}

const ClientMetricsUploader: React.FC<ClientMetricsUploaderProps> = ({ onDataLoaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiredColumns = [
    'Client Name',
    'Reticula Completed Calls',
    'Inex One Expected Calls',
    'Inex One Completed Calls'
  ];

  const processCSV = useCallback((file: File) => {
    setIsLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsLoading(false);
        
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Please check the file format.');
          return;
        }

        const data = results.data as any[];
        
        // Check if all required columns are present
        const headers = Object.keys(data[0] || {});
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }

        // Process the data to calculate Rate column
        const processedData: ClientMetricsData[] = data.map(row => {
          const reticulaCompleted = parseInt(row['Reticula Completed Calls'] || '0');
          const inexOneCompleted = parseInt(row['Inex One Completed Calls'] || '0');
          
          // Calculate rate: 100/(Column D / Column B) where D is Inex One Completed Calls and B is Reticula Completed Calls
          let rate = 0;
          if (reticulaCompleted > 0 && inexOneCompleted > 0) {
            rate = 100 / (inexOneCompleted / reticulaCompleted);
          }

          return {
            'Client Name': row['Client Name'] || '',
            'Reticula Completed Calls': row['Reticula Completed Calls'] || '0',
            'Inex One Expected Calls': row['Inex One Expected Calls'] || '0',
            'Inex One Completed Calls': row['Inex One Completed Calls'] || '0',
            'Rate': rate.toFixed(2)
          };
        });

        onDataLoaded(processedData);
      },
      error: (error) => {
        setIsLoading(false);
        setError('Error reading file. Please try again.');
      }
    });
  }, [onDataLoaded, requiredColumns]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processCSV(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      processCSV(file);
    } else {
      setError('Please upload a valid CSV file.');
    }
  };

  return (
    <div className="csv-uploader">
      <div className="upload-container">
        <div
          className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <h3>Upload Client Metrics CSV</h3>
            <p>Drag and drop your CSV file here, or click to browse</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input-client-metrics"
            />
            <label htmlFor="file-input-client-metrics" className="upload-button">
              Choose File
            </label>
          </div>
        </div>

        {isLoading && (
          <div className="loading">
            <p>Processing CSV file...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        <div className="csv-format">
          <h4>Required CSV Format:</h4>
          <p>Your CSV should have the following columns:</p>
          <ul>
            <li><strong>Client Name</strong> - Name of the client</li>
            <li><strong>Reticula Completed Calls</strong> - Number of completed Reticula calls</li>
            <li><strong>Inex One Expected Calls</strong> - Number of expected Inex One calls</li>
            <li><strong>Inex One Completed Calls</strong> - Number of completed Inex One calls</li>
          </ul>
          <p><em>The Rate column will be automatically calculated as: 100/(Inex One Completed Calls / Reticula Completed Calls)</em></p>
        </div>
      </div>
    </div>
  );
};

export default ClientMetricsUploader; 