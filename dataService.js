import axios from 'axios';
import Papa from 'papaparse';

const SHEET_ID = '1yHcKcLdv0TEEpEZ3cAWd9A_t8MBE-yk4JuWqJKn0IeI';

/**
 * Fetches and processes data from Google Sheets
 * @returns {Promise<Array>} Processed report data
 */
export const fetchReportsData = async () => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&timestamp=${timestamp}`;
    
   // const response = await axios.get(sheetUrl);
    const response = await axios.get(sheetUrl, {
      headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
      },
    });
    
    return new Promise((resolve, reject) => {
      Papa.parse(response.data, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cleanedData = cleanData(results.data);
          resolve(cleanedData);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching reports data:', error);
    throw error;
  }
};

/**
 * Cleans and processes raw CSV data
 * @param {Array} data - Raw CSV data
 * @returns {Array} Cleaned data
 */
const cleanData = (data) => {
  return data
    .map(row => {
      // Clean column values
      const cleaned = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.trim();
        cleaned[cleanKey] = typeof row[key] === 'string' ? row[key].trim() : row[key];
      });

      // Parse location coordinates
      if (cleaned.Location && cleaned.Location.includes(',')) {
        const [lat, lon] = cleaned.Location.split(',').map(coord => parseFloat(coord.trim()));
        cleaned.lat = lat;
        cleaned.lon = lon;
      }

      // Normalize Status (fix "Pending " space issue)
      if (cleaned.Status) {
        cleaned.Status = cleaned.Status.trim().charAt(0).toUpperCase() + 
                        cleaned.Status.trim().slice(1).toLowerCase();
      }

      // Normalize Category
      if (cleaned.Category) {
        cleaned.Category = cleaned.Category.trim();
      }

      // Normalize Urgency
      if (cleaned.Urgency) {
        cleaned.Urgency = cleaned.Urgency.trim().toLowerCase();
      }

      // Parse date if available
      if (cleaned.Date) {
        cleaned.parsedDate = new Date(cleaned.Date);
      }

      return cleaned;
    })
    .filter(row => row.lat && row.lon && !isNaN(row.lat) && !isNaN(row.lon)); // Remove invalid coordinates
};

/**
 * Calculate statistics from reports data
 * @param {Array} data - Reports data
 * @returns {Object} Statistics
 */
export const calculateStats = (data) => {
  const total = data.length;
  const pending = data.filter(r => r.Status === 'Pending').length;
  const resolved = data.filter(r => r.Status === 'Resolved').length;
  const successRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;

  // Category breakdown
  const categoryBreakdown = data.reduce((acc, report) => {
    const category = report.Category || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Urgency breakdown
  const urgencyBreakdown = data.reduce((acc, report) => {
    const urgency = report.Urgency || 'unknown';
    acc[urgency] = (acc[urgency] || 0) + 1;
    return acc;
  }, {});

  // Department workload (by category and urgency)
  const departmentWorkload = data.reduce((acc, report) => {
    const key = `${report.Category}-${report.Urgency}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    pending,
    resolved,
    successRate,
    categoryBreakdown,
    urgencyBreakdown,
    departmentWorkload
  };
};

/**
 * Group data for heatmap visualization
 * @param {Array} data - Reports data
 * @returns {Array} Heatmap data points
 */
export const prepareHeatmapData = (data) => {
  // Group reports by proximity (grid-based)
  const gridSize = 0.005; // Approximately 500m
  const heatmapGrid = {};

  data.forEach(report => {
    const gridLat = Math.round(report.lat / gridSize) * gridSize;
    const gridLon = Math.round(report.lon / gridSize) * gridSize;
    const key = `${gridLat},${gridLon}`;

    if (!heatmapGrid[key]) {
      heatmapGrid[key] = {
        lat: gridLat,
        lon: gridLon,
        count: 0,
        urgency: { high: 0, medium: 0, low: 0 }
      };
    }

    heatmapGrid[key].count += 1;
    if (report.Urgency && heatmapGrid[key].urgency[report.Urgency] !== undefined) {
      heatmapGrid[key].urgency[report.Urgency] += 1;
    }
  });

  return Object.values(heatmapGrid);
};
