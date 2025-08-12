import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { ProjectData } from '../App';

interface CSVUploaderProps {
  onDataLoaded: (data: ProjectData[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const processCSV = useCallback((file: File) => {
    setIsLoading(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsLoading(false);
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Please check the format.');
          return;
        }
        
        const data = results.data as ProjectData[];
        if (data.length === 0) {
          setError('No data found in CSV file.');
          return;
        }

        // Validate required columns
        const requiredColumns = [
          'Project Name', 'Project Start Date', 'Project Geoscope', 'Project Industry', 
          'Project Manager', 'Project Associates', 'Project Demand', 'Client Name',
          'Project Type', 'Expert Name', 'Expert Final Terms State',
          'Expert Final Interaction State', 'Expert Final Outreach/Followup Number',
          'Event Executor Associate', 'Event Type', 'Event Date'
        ];

        const firstRow = data[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));
        
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }

        onDataLoaded(data);
      },
      error: (error) => {
        setIsLoading(false);
        setError('Error reading file: ' + error.message);
      }
    });
  }, [onDataLoaded]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      processCSV(file);
    } else {
      setError('Please select a valid CSV file.');
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
      setError('Please drop a valid CSV file.');
    }
  };

  return (
    <div className="csv-uploader">
      <div className="upload-container">
        <h1 className="upload-title">Project Dashboard</h1>
        <p className="upload-subtitle">Upload your CSV file to visualize project data</p>
        
        <div 
          className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <div className="upload-icon">📊</div>
            <h3>Upload CSV File</h3>
            <p>Drag and drop your CSV file here, or click to browse</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="file-input"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="upload-button">
              Choose File
            </label>
          </div>
        </div>

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing CSV file...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        <div className="csv-format">
          <h4>Expected CSV Format:</h4>
          <p>Your CSV should include these columns:</p>
          <ul>
            <li>Project Name, Project Start Date, Project Geoscope, Project Industry</li>
            <li>Project Manager, Project Associates, Project Demand, Client Name</li>
            <li>Project Type, Expert Name, Expert Final Terms State</li>
            <li>Expert Final Interaction State, Expert Final Outreach/Followup Number</li>
            <li>Event Executor Associate, Event Type, Event Date</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CSVUploader; 