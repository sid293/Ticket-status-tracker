import TicketCard from './TicketCard.jsx';

const TicketColumn = ({ status, tickets, loading, onStatusChange, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-gray-100 border-gray-400';
      case 'In Progress':
        return 'bg-blue-100 border-blue-400';
      case 'Review':
        return 'bg-yellow-100 border-yellow-400';
      case 'Testing':
        return 'bg-purple-100 border-purple-400';
      case 'Done':
        return 'bg-green-100 border-green-400';
      default:
        return 'bg-gray-100 border-gray-400';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Open':
        return 'text-gray-800';
      case 'In Progress':
        return 'text-blue-800';
      case 'Review':
        return 'text-yellow-800';
      case 'Testing':
        return 'text-purple-800';
      case 'Done':
        return 'text-green-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Column Header */}
      <div className={`px-4 py-3 border-b-2 ${getStatusColor(status)}`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold text-sm ${getStatusTextColor(status)}`}>
            {status}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)} ${getStatusTextColor(status)}`}>
            {tickets.length}
          </span>
        </div>
      </div>

      {/* Tickets Container */}
      <div className="p-3 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto">
        {loading && tickets.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400 text-sm text-center">
              No tickets in {status.toLowerCase()}
            </div>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard 
              key={ticket._id} 
              ticket={ticket} 
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TicketColumn;
