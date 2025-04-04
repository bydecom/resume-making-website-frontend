import React, { useState, useEffect } from 'react';

const ScanPDFPopup = ({ isOpen, onScanComplete = () => {}, onError = () => {}, fileName = 'Resume.pdf' }) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMarkers, setScanMarkers] = useState([
    { id: 1, position: 25, active: false },
    { id: 2, position: 40, active: false },
    { id: 3, position: 75, active: false },
  ]);

  // Simulate scanning animation
  useEffect(() => {
    if (!isOpen) return;
    
    let isCancelled = false;
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 1;

        // Update scan markers based on progress
        if (newProgress === 25) {
          setScanMarkers((prev) => prev.map((marker) => (marker.id === 1 ? { ...marker, active: true } : marker)));
        } else if (newProgress === 40) {
          setScanMarkers((prev) => prev.map((marker) => (marker.id === 2 ? { ...marker, active: true } : marker)));
        } else if (newProgress === 75) {
          setScanMarkers((prev) => prev.map((marker) => (marker.id === 3 ? { ...marker, active: true } : marker)));
        }

        // Complete scan when 100% reached
        if (newProgress >= 100 && !isCancelled) {
          clearInterval(interval);
          setTimeout(() => {
            if (!isCancelled) {
              onScanComplete();
            }
          }, 500);
          return 100;
        }

        return newProgress > 100 ? 100 : newProgress;
      });
    }, 30);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [isOpen, onScanComplete]);

  // Extract first name and last name from file name
  const getNameFromFileName = (fileName) => {
    // Remove file extension
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");

    // Split by underscore or space
    const parts = nameWithoutExt.split(/[_\s]/);

    if (parts.length >= 2) {
      return {
        firstName: parts[0],
        lastName: parts[1],
      };
    }

    return {
      firstName: nameWithoutExt,
      lastName: "",
    };
  };

  const { firstName, lastName } = getNameFromFileName(fileName);
  const displayName = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden p-6">
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="relative w-64 h-96 bg-white shadow-md rounded-md mb-6">
            {/* Document content */}
            <div className="absolute top-6 left-0 right-0 text-center font-bold text-gray-800">{displayName}</div>

            {/* Vertical blue line with markers */}
            <div className="absolute left-12 top-16 bottom-16 w-1 bg-blue-500">
              {scanMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className={`absolute w-3 h-3 rounded-full -left-1 bg-white border-2 ${marker.active ? "border-blue-500" : "border-blue-200"}`}
                  style={{ top: `${marker.position}%` }}
                />
              ))}
            </div>

            {/* Document content lines */}
            <div className="absolute left-16 right-6 top-16 bottom-16 flex flex-col justify-between">
              {/* Header section */}
              <div className="space-y-2">
                <div className="h-1.5 w-16 bg-blue-200 rounded-full" />
                <div className="h-1 w-32 bg-gray-200 rounded-full" />
                <div className="h-1 w-40 bg-gray-200 rounded-full" />
              </div>

              {/* Middle section */}
              <div className="space-y-2">
                <div className="h-1.5 w-20 bg-blue-200 rounded-full" />
                <div className="h-1 w-48 bg-gray-200 rounded-full" />
                <div className="h-1 w-40 bg-gray-200 rounded-full" />
                <div className="h-1 w-44 bg-gray-200 rounded-full" />
                <div className="h-1 w-36 bg-gray-200 rounded-full" />
                <div className="h-1 w-40 bg-gray-200 rounded-full" />
              </div>

              {/* Bottom section */}
              <div className="space-y-2">
                <div className="h-1.5 w-16 bg-blue-200 rounded-full" />
                <div className="h-1 w-32 bg-gray-200 rounded-full" />
                <div className="h-1 w-24 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* Scanning overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent pointer-events-none"
              style={{
                top: `${scanProgress}%`,
                height: "10%",
                transition: "top 0.1s ease-out",
              }}
            />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-800">Analyzing Resume...</h3>
            <p className="text-sm text-gray-500 mt-2">Extracting information from your document</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanPDFPopup; 