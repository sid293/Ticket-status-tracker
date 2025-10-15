const TicketCard = ({ ticket, onStatusChange, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'Open':
        return 'border-l-gray-400';
      case 'In Progress':
        return 'border-l-blue-400';
      case 'Review':
        return 'border-l-yellow-400';
      case 'Testing':
        return 'border-l-purple-400';
      case 'Done':
        return 'border-l-green-400';
      default:
        return 'border-l-gray-400';
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = ['Open', 'In Progress', 'Review', 'Testing', 'Done'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  const getPrevStatus = (currentStatus) => {
    const statusFlow = ['Open', 'In Progress', 'Review', 'Testing', 'Done'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex > 0 ? statusFlow[currentIndex - 1] : null;
  };

  const handleStatusChange = async (newStatus) => {
    if (onStatusChange) {
      try {
        await onStatusChange(ticket._id, newStatus);
      } catch (error) {
        alert(`Failed to update status: ${error.message}`);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      if (onDelete) {
        onDelete(ticket._id);
      }
    }
  };

  const nextStatus = getNextStatus(ticket.status);
  const prevStatus = getPrevStatus(ticket.status);

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${getStatusBorderColor(ticket.status)} border border-gray-200 p-4 hover:shadow-md transition-shadow`}>
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1">
          {ticket.title}
        </h4>
        <div className="flex items-center space-x-1 ml-2">
          {ticket.status === 'Done' && (
            <span className="text-green-500 text-lg">✅</span>
          )}
          <button
            onClick={() => onEdit && onEdit(ticket)}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
            title="Edit ticket"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Delete ticket"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-xs mb-3 leading-relaxed">
        {truncateText(ticket.description)}
      </p>

      {/* Status change buttons */}
      <div className="flex flex-wrap gap-1 mb-3">
        {prevStatus && (
          <button
            onClick={() => handleStatusChange(prevStatus)}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            title={`Move to ${prevStatus}`}
          >
            ← {prevStatus}
          </button>
        )}
        {nextStatus && (
          <button
            onClick={() => handleStatusChange(nextStatus)}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
            title={`Move to ${nextStatus}`}
          >
            {nextStatus} →
          </button>
        )}
      </div>

      {/* Footer with metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
        </div>
        <div className="text-right">
          <div className="text-xs">
            {formatDate(ticket.updatedAt || ticket.createdAt)}
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div className="mt-2 flex justify-end">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          ticket.status === 'Open' ? 'bg-gray-100 text-gray-800' :
          ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          ticket.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
          ticket.status === 'Testing' ? 'bg-purple-100 text-purple-800' :
          ticket.status === 'Done' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {ticket.status}
        </span>
      </div>
    </div>
  );
};

export default TicketCard;
