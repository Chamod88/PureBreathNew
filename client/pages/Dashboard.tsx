import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Phone, CheckCircle, AlertTriangle, User } from 'lucide-react';
import Header from '@/components/Header';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const [dragActive, setDragActive] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileError, setFileError] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);
    const analysisApiUrl = import.meta.env.VITE_ANALYSIS_API_URL || 'http://localhost:8000';
    const authApiUrl = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000';
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [testHistory, setTestHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchTestHistory = async () => {
      console.log('fetchTestHistory called, user:', user);
      if (!user?.id) {
        console.log('No user.id, returning');
        return;
      }

      console.log('Fetching history for user.id:', user.id);
      setLoadingHistory(true);
      try {
        const url = `${authApiUrl}/api/analysis/history/${user.id}?limit=10`;
        console.log('API URL:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('API response data:', data);
          const formattedHistory = data.analyses.map(analysis => ({
            id: analysis.id,
            date: new Date(analysis.uploadedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            fileName: analysis.fileName,
            status: analysis.prediction.charAt(0).toUpperCase() + analysis.prediction.slice(1),
            confidence: analysis.confidence,
            fileSize: analysis.fileSize,
            duration: analysis.duration,
            uploadedAt: analysis.uploadedAt,
          }));
          console.log('Formatted history:', formattedHistory);
          setTestHistory(formattedHistory);
        } else {
          console.error('Response not ok, status:', response.status, 'text:', await response.text());
        }
      } catch (error) {
        console.error('Failed to fetch test history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    useEffect(() => {
      fetchTestHistory();
    }, [user?.id]);

   const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, errorMessage: 'Please upload a valid audio file (WAV or MP3)' };
    }
    if (file.size > maxSize) {
      return { isValid: false, errorMessage: 'File size exceeds 10MB limit' };
    }
    return { isValid: true, errorMessage: null };
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        setFileError(validation.errorMessage);
        setSelectedFile(null);
        return;
      }
      setFileError(null);
      setSelectedFile(file);
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setIsLoading(true);
    setUploadProgress(0);
    setUploadError(null);
    setError(null);
    setPrediction(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (user?.id) {
        formData.append('userId', user.id);
      }
      // Simulate progress for demo; in real app, use XMLHttpRequest for progress
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      const response = await fetch(`${analysisApiUrl}/predict`, {
        method: 'POST',
        body: formData,
      });
      clearInterval(interval);
      setUploadProgress(100);
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Invalid file format or corrupted audio');
        } else if (response.status >= 500) {
          throw new Error('Server error - please try again later');
        } else {
          throw new Error('Upload failed - please check your connection');
        }
      }
      const result = await response.json();
      setPrediction(result);
      // Refresh test history after successful analysis
      if (user?.id) {
        fetchTestHistory();
      }
    } catch (err) {
      setUploadError(err.message || 'An error occurred during upload');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setFileError(null);
    setUploadError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);
      if (!validation.isValid) {
        setFileError(validation.errorMessage);
        return;
      }
      setSelectedFile(file);
      uploadFile(file);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto p-6">

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div
            className={`bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-center cursor-pointer transition ${
              dragActive ? 'ring-4 ring-blue-300' : ''
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (!isLoading && (e.key === 'Enter' || e.key === ' ')) { fileInputRef.current?.click(); e.preventDefault(); } }}
            aria-label="Upload audio file"
          >
            <Upload className="w-8 h-8 text-white mx-auto mb-3" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              {isLoading ? 'Analyzing...' : 'Upload Respiratory Sound & Analyze'}
            </h2>
            <p className="text-blue-100">
              {isLoading ? 'Please wait while we process your audio' : selectedFile ? `Selected: ${selectedFile.name}` : 'Drag and drop WAV/MP3 file here or click to browse'}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="audio/wav,audio/mpeg,audio/mp3"
              style={{ display: 'none' }}
            />
          </div>
          {selectedFile && !isLoading && (
            <div className="mt-4 text-center">
              <p className="text-gray-700">Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
            </div>
          )}
          {uploadProgress > 0 && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-center text-sm text-gray-600 mt-2">Uploading... {uploadProgress}%</p>
            </div>
          )}
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm mb-2">
              🔬 AI-Powered Analysis • Not for medical diagnosis
            </p>
            <p className="text-xs text-gray-400">
              Results are for informational purposes only. Consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>

        {prediction && !isLoading && !fileError && !uploadError && !error && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 text-center">
            <p className="text-green-800">File uploaded and analyzed successfully!</p>
          </div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor Result Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>

            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing audio file...</p>
              </div>
            )}

            {(fileError || uploadError || error) && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-red-900">Upload/Analysis Error</h3>
                </div>
                <p className="text-red-800">{fileError || uploadError || error}</p>
              </div>
            )}

            {prediction && !isLoading && !error && (
              <div className={`border-2 rounded-lg p-5 ${
                prediction.prediction === 'healthy'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {prediction.prediction === 'healthy' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  )}
                  <h3 className={`text-xl font-bold ${
                    prediction.prediction === 'healthy' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {prediction.prediction === 'healthy' ? 'Healthy Patient' : 'Disease Detected'}
                  </h3>
                </div>
                <p className={`mb-2 ${
                  prediction.prediction === 'healthy' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {prediction.prediction === 'healthy'
                    ? 'No abnormalities detected in the respiratory sound.'
                    : `${prediction.prediction.charAt(0).toUpperCase() + prediction.prediction.slice(1)} detected.`
                  }
                </p>
                <p className={`font-semibold ${
                  prediction.prediction === 'healthy' ? 'text-green-800' : 'text-red-800'
                }`}>
                  Confidence: {(prediction.confidence * 100).toFixed(1)}%
                </p>

                {prediction.prediction !== 'healthy' && (
                  <>
                    <p className="text-gray-700 font-semibold mb-3 mt-4">Recommended Actions</p>
                    <div className="bg-yellow-50 rounded-lg p-4 mb-3">
                      <p className="font-semibold text-gray-800 mb-2">⚠️ Consult a specialist immediately</p>
                      <p className="text-sm text-gray-700">Schedule an appointment with a pulmonologist for further evaluation.</p>
                    </div>

                    <p className="text-gray-700 font-semibold mb-3">Available Specialists</p>

                    <div className="bg-blue-50 rounded-lg p-4 mb-3 text-center">
                      <p className="font-semibold text-gray-800">Dr. Anya Sharma - Pulmonologist</p>
                      <p className="text-sm text-gray-600">Specialist in respiratory diseases</p>
                    </div>

                    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Dr. Ben Carter</p>
                          <p className="text-sm text-gray-600">General Physician</p>
                        </div>
                      </div>
                      <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                        <Phone className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Steps to Prevent</h4>
                      <div className="space-y-3">
                        {prediction.prediction === 'copd' && (
                          <>
                            <div className="bg-blue-50 rounded-lg p-4">
                              <h5 className="font-semibold text-gray-800 mb-2">COPD — General Prevention & Management (5 Steps)</h5>
                              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Avoid smoking completely and minimize exposure to air pollutants and dust.</li>
                                <li>Follow prescribed treatments and attend regular medical checkups.</li>
                                <li>Practice breathing exercises to improve lung efficiency.</li>
                                <li>Maintain vaccinations to prevent respiratory infections.</li>
                                <li>Monitor symptoms closely and seek medical advice if breathing worsens.</li>
                              </ul>
                            </div>
                          </>
                        )}
                        {prediction.prediction === 'pneumonia' && (
                          <>
                            <div className="bg-blue-50 rounded-lg p-4">
                              <h5 className="font-semibold text-gray-800 mb-2">Pneumonia — General Prevention (5 Steps)</h5>
                              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Practice good hygiene, including frequent handwashing and mask use when necessary.</li>
                                <li>Keep vaccinations up to date as recommended by healthcare professionals.</li>
                                <li>Avoid close contact with individuals who have respiratory infections.</li>
                                <li>Maintain good nutrition and hydration to strengthen the immune system.</li>
                                <li>Seek early medical attention if symptoms such as fever, cough, or chest pain appear.</li>
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {prediction.prediction === 'healthy' && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Steps to Prevent</h4>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Healthy Individuals — General Prevention (5 Steps)</h5>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Maintain good air quality by avoiding polluted or smoky environments whenever possible.</li>
                        <li>Practice regular hand hygiene to reduce exposure to germs and infections.</li>
                        <li>Engage in regular physical activity to support lung strength and overall health.</li>
                        <li>Avoid smoking and exposure to secondhand smoke.</li>
                        <li>Ensure adequate rest, hydration, and a balanced diet to support immune function.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!prediction && !isLoading && !error && (
              <div className="text-center py-8 text-gray-500">
                <p>Upload an audio file to see analysis results</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Test History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Recent Test History</h2>

              {loadingHistory ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading history...</p>
                </div>
              ) : testHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No test history available</p>
                  <p className="text-sm">Upload an audio file to see your analysis history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testHistory.map((test) => (
                    <div key={test.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 font-medium">{test.fileName}</span>
                          <span className="text-xs text-gray-500">
                            ({(test.fileSize / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {test.date}
                          {test.confidence && ` • ${(test.confidence * 100).toFixed(1)}% confidence`}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                          test.status === "Healthy"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {test.status}
                      </span>
                      <button
                        onClick={() => { setSelectedReport(test); setReportDialogOpen(true); }}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition ml-4"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">View Report</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Patient Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Patient Details</h2>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span> {user?.email || 'Not available'}
                  </p>
                  {user?.age && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Age:</span> {user.age} years
                    </p>
                  )}
                  <p className="text-gray-700">
                    <span className="font-semibold">Patient ID:</span> {user?.id || 'Not available'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Account Type:</span> {user?.email?.includes('google') ? 'Google' : 'Email'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedReport && (
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Analysis Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600"><strong>File Name:</strong></p>
                <p>{selectedReport.fileName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600"><strong>Upload Date:</strong></p>
                <p>{selectedReport.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600"><strong>File Size:</strong></p>
                <p>{selectedReport.fileSize ? `${(selectedReport.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</p>
              </div>
              {selectedReport.duration && (
                <div>
                  <p className="text-sm text-gray-600"><strong>Duration:</strong></p>
                  <p>{selectedReport.duration.toFixed(1)} seconds</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600"><strong>Analysis Result:</strong></p>
                <p className={`font-semibold ${selectedReport.status === 'Healthy' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedReport.status}
                </p>
              </div>
              {selectedReport.confidence && (
                <div>
                  <p className="text-sm text-gray-600"><strong>Confidence:</strong></p>
                  <p>{(selectedReport.confidence * 100).toFixed(1)}%</p>
                </div>
              )}
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  This analysis is for informational purposes only. Consult healthcare professionals for medical advice.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}