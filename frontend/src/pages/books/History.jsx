import React from "react";
import {
  useClearAllHistoryMutation,
  useDeleteHistoryMutation,
  useFetchHistoryQuery,
} from "../../redux/features/history/historyApi";

const HistoryPage = () => {
  // Fetch history records
  const { data: history = [], error, isLoading } = useFetchHistoryQuery();
  const [deleteHistory] = useDeleteHistoryMutation();
  const [clearAllHistory] = useClearAllHistoryMutation();

  // Handle delete of a specific history record
  const handleDeleteHistory = async (historyId) => {
    try {
      await deleteHistory(historyId).unwrap();
      console.log(`History with ID ${historyId} deleted`);
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  // Handle clearing all history records
  const handleClearAllHistory = async () => {
    try {
      await clearAllHistory().unwrap();
      console.log("All history cleared");
    } catch (error) {
      console.error("Error clearing all history:", error);
    }
  };

  // Loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading history</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your History</h2>

      {/* Flex container for the button, aligned to the right */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleClearAllHistory}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Clear All History
        </button>
      </div>

      {/* Show history records */}
      {history.length === 0 ? (
        <div className="text-center text-gray-500">No history available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((record) => (
            <div
              key={record._id}
              className="bg-white shadow-md rounded-lg p-6 border-2 border-gray-300 dark:border-white"
            >
              {/* Card content */}
              <h3 className="font-semibold text-lg">{record.itemType}</h3>
              <pre className="text-sm mt-2">
                {JSON.stringify(record.actionDetails, null, 2)}
              </pre>
              <p className="text-sm text-gray-600 mt-4">
                Action Date: {new Date(record.actionDate).toLocaleString()}
              </p>

              {/* Delete button for individual record */}
              <button
                onClick={() => handleDeleteHistory(record._id)}
                className="bg-red-500 text-white py-1 px-3 rounded mt-4 hover:bg-red-700"
              >
                Delete History
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
