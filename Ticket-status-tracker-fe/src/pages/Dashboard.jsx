import { useState, useEffect } from 'react';
import { getAllTickets, logout, updateTicketStatus, deleteTicket } from '../api/tickets.js';
import TicketColumn from '../components/TicketColumn.jsx';
import CreateTicketForm from '../components/CreateTicketForm.jsx';
import EditTicketForm from '../components/EditTicketForm.jsx';

const STATUSES = ['Open', 'In Progress', 'Review', 'Testing', 'Done'];

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getAllTickets();
      // console.log('Fetched tickets:', data);
      
      // Handle different response structures
      let ticketsArray = [];
      if (Array.isArray(data)) {
        ticketsArray = data;
      } else if (data && Array.isArray(data.items)) {
        ticketsArray = data.items;
      } else if (data && data.data && Array.isArray(data.data)) {
        ticketsArray = data.data;
      }
      
      setTickets(ticketsArray);
      // console.log("tickets set to: ", ticketsArray);
      setError('');
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message || 'Failed to fetch tickets');
      setTickets([]); // Ensure tickets is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTickets, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleTicketCreated = () => {
    setShowCreateForm(false);
    fetchTickets(); // Refresh the tickets list
  };

  const handleTicketUpdated = () => {
    setEditingTicket(null);
    fetchTickets(); // Refresh the tickets list
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      fetchTickets(); // Refresh the tickets list
    } catch (error) {
      throw error; // Let the TicketCard handle the error display
    }
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await deleteTicket(ticketId);
      fetchTickets(); // Refresh the tickets list
    } catch (error) {
      alert(`Failed to delete ticket: ${error.message}`);
    }
  };

  const getTicketsByStatus = (status) => {
    if (!Array.isArray(tickets)) {
      return [];
    }
    return tickets.filter(ticket => ticket.status === status);
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ticket Tracker</h1>
              <p className="text-sm text-gray-500">Monitor your tickets in real-time</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                New Ticket
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Auto-refreshing every 30 seconds
          </p>
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="text-xs text-blue-600 hover:text-blue-500 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh now'}
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {STATUSES.map((status) => (
            <TicketColumn
              key={status}
              status={status}
              tickets={getTicketsByStatus(status)}
              loading={loading}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTicket}
              onDelete={handleDeleteTicket}
            />
          ))}
        </div>
      </main>

      {/* Create Ticket Modal */}
      {showCreateForm && (
        <CreateTicketForm
          onClose={() => setShowCreateForm(false)}
          onTicketCreated={handleTicketCreated}
        />
      )}

      {/* Edit Ticket Modal */}
      {editingTicket && (
        <EditTicketForm
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onTicketUpdated={handleTicketUpdated}
        />
      )}
    </div>
  );
};

export default Dashboard;
