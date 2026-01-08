import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [adminInfo, setAdminInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;
  const [deviceCheckResult, setDeviceCheckResult] = useState(null);
  const [checkingDevice, setCheckingDevice] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const info = localStorage.getItem('adminInfo');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (info) {
      setAdminInfo(JSON.parse(info));
    }

    fetchDashboardData();
    fetchUsers();
  }, [navigate, filter, currentPage]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/dashboard/stats`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users?page=${currentPage}&limit=${usersPerPage}`;
      if (filter !== 'all') {
        url += `&status=${filter}`;
      }
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
        setTotalPages(data.data.pagination.pages);
        setTotalUsers(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVerification = async (userId, stepNumber, status, notes) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/verification/${stepNumber}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            adminChecked: true,
            adminStatus: status,
            adminNotes: notes
          })
        }
      );
      
      const data = await response.json();
      if (data.success) {
        // Refresh data
        fetchDashboardData();
        fetchUsers();
        if (selectedUser && selectedUser._id === userId) {
          fetchUserDetails(userId);
        }
        alert(`Step ${stepNumber} ${status} successfully!`);
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Failed to update verification');
    }
  };

  const fetchUserDetails = async (userId) => {
    setDeviceCheckResult(null); // Reset device check result when opening new user
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setSelectedUser(data.data.user);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const checkDevice = async (userId) => {
    setCheckingDevice(true);
    setDeviceCheckResult(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/check-device`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      console.log('Device check response:', data);
      if (data.success) {
        setDeviceCheckResult(data.data);
        // Also update the selectedUser's hadRun status
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(prev => ({
            ...prev,
            hadRun: data.data.hadRun
          }));
        }
        // Refresh the user list to update the table
        fetchUsers();
      }
    } catch (error) {
      console.error('Error checking device:', error);
      setDeviceCheckResult({ error: 'Failed to check device' });
    } finally {
      setCheckingDevice(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      case 'needs_review': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (!stats) {
    return <div className="admin-dashboard loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {adminInfo?.name || 'Admin'}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.overview.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.overview.pendingReview}</h3>
            <p>Pending Review</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.overview.approvedUsers}</h3>
            <p>Approved</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{stats.overview.rejectedUsers}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Verification Steps Overview */}
      <div className="verification-overview">
        <h2>Verification Steps Status</h2>
        <div className="steps-grid">
          <div className="step-card">
            <h4>Step 1: Personal Info</h4>
            <p>Completed: {stats.verificationSteps.step1.completed}</p>
            <p className="pending">Pending Check: {stats.verificationSteps.step1.pendingAdminCheck}</p>
          </div>
          <div className="step-card">
            <h4>Step 2: ID Verification</h4>
            <p>Completed: {stats.verificationSteps.step2.completed}</p>
            <p className="pending">Pending Check: {stats.verificationSteps.step2.pendingAdminCheck}</p>
          </div>
          <div className="step-card">
            <h4>Step 3: Photo</h4>
            <p>Completed: {stats.verificationSteps.step3.completed}</p>
            <p className="pending">Pending Check: {stats.verificationSteps.step3.pendingAdminCheck}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="users-section">
        <div className="section-header">
          <h2>User Management</h2>
          <div className="filters">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => { setFilter('all'); setCurrentPage(1); }}
            >
              All
            </button>
            <button 
              className={filter === 'incomplete' ? 'active' : ''}
              onClick={() => { setFilter('incomplete'); setCurrentPage(1); }}
            >
              Incomplete
            </button>
            <button 
              className={filter === 'pending_review' ? 'active' : ''}
              onClick={() => { setFilter('pending_review'); setCurrentPage(1); }}
            >
              Pending
            </button>
            <button 
              className={filter === 'approved' ? 'active' : ''}
              onClick={() => { setFilter('approved'); setCurrentPage(1); }}
            >
              Approved
            </button>
            <button 
              className={filter === 'rejected' ? 'active' : ''}
              onClick={() => { setFilter('rejected'); setCurrentPage(1); }}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table">
          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table>
                <thead>
                <tr>
                  <th>Email</th>
                  <th>IP Address</th>
                  <th>Device</th>
                  <th>Platform</th>
                  <th>Browser</th>
                  <th>Step 1</th>
                  <th>Step 2</th>
                  <th>Step 3</th>
                  <th>Had Run</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>
                      <span className="ip-address">{user.deviceInfo?.ip || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="device-type">{user.deviceInfo?.device?.type || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="platform-info">
                        {user.deviceInfo?.os?.name || 'N/A'} {user.deviceInfo?.os?.version || ''}
                      </span>
                    </td>
                    <td>
                      <span className="browser-info">
                        {user.deviceInfo?.browser?.name || 'N/A'} {user.deviceInfo?.browser?.version || ''}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="step-badge"
                        style={{ backgroundColor: getStatusColor(user.verificationSteps.step1.adminStatus) }}
                      >
                        {user.verificationSteps.step1.completed ? user.verificationSteps.step1.adminStatus : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="step-badge"
                        style={{ backgroundColor: getStatusColor(user.verificationSteps.step2.adminStatus) }}
                      >
                        {user.verificationSteps.step2.completed ? user.verificationSteps.step2.adminStatus : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="step-badge"
                        style={{ backgroundColor: getStatusColor(user.verificationSteps.step3.adminStatus) }}
                      >
                        {user.verificationSteps.step3.completed ? user.verificationSteps.step3.adminStatus : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`hadrun-badge ${user.hadRun ? 'true' : 'false'}`}>
                        {user.hadRun ? '✅' : '❌'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => fetchUserDetails(user._id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {((currentPage - 1) * usersPerPage) + 1} - {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
            </div>
            <div className="pagination-controls">
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                ««
              </button>
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                «
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                »
              </button>
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »»
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="close-btn">×</button>
            </div>

            <div className="user-details">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Password:</strong> {selectedUser.password}</p>
                <p><strong>Phone:</strong> {selectedUser.phone}</p>
                <p><strong>Date of Birth:</strong> {new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Country:</strong> {selectedUser.country}</p>
                <p><strong>City:</strong> {selectedUser.city}</p>
              </div>

              <div className="detail-section">
                <h3>Device Information</h3>
                <p><strong>IP Address:</strong> {selectedUser.deviceInfo?.ip || 'N/A'}</p>
                <p><strong>Device Type:</strong> {selectedUser.deviceInfo?.device?.type || 'N/A'}</p>
                <p><strong>Device Vendor:</strong> {selectedUser.deviceInfo?.device?.vendor || 'N/A'}</p>
                <p><strong>Platform:</strong> {selectedUser.deviceInfo?.os?.name || 'N/A'} {selectedUser.deviceInfo?.os?.version || ''}</p>
                <p><strong>Browser:</strong> {selectedUser.deviceInfo?.browser?.name || 'N/A'} {selectedUser.deviceInfo?.browser?.version || ''}</p>
                <p><strong>Language:</strong> {selectedUser.deviceInfo?.language || 'N/A'}</p>
                <p><strong>User Agent:</strong> <span className="user-agent">{selectedUser.deviceInfo?.userAgent || 'N/A'}</span></p>
                
                <div className="device-check-section">
                  <p><strong>Had Run:</strong> 
                    <span className={`hadrun-badge ${selectedUser.hadRun ? 'true' : 'false'}`}>
                      {selectedUser.hadRun ? '✅ TRUE' : '❌ FALSE'}
                    </span>
                  </p>
                  <button 
                    className="check-now-btn"
                    onClick={() => checkDevice(selectedUser._id)}
                    disabled={checkingDevice}
                  >
                    {checkingDevice ? 'Checking...' : '🔍 Check Now'}
                  </button>
                  
                  {deviceCheckResult && (
                    <div className={`device-check-result ${deviceCheckResult.hadRun ? 'success' : 'pending'}`}>
                      {deviceCheckResult.error ? (
                        <p className="error">{deviceCheckResult.error}</p>
                      ) : (
                        <>
                          <p><strong>Result:</strong> {deviceCheckResult.hadRun ? '✅ Executed' : '⏳ Not Yet'}</p>
                          <p><strong>IP:</strong> {deviceCheckResult.ip || 'N/A'}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {selectedUser.sessionHistory && selectedUser.sessionHistory.length > 0 && (
                <div className="detail-section">
                  <h3>Session History</h3>
                  <div className="session-history">
                    {selectedUser.sessionHistory.slice(0, 5).map((session, index) => (
                      <div key={index} className="session-entry">
                        <p><strong>#{index + 1}</strong> - {new Date(session.timestamp).toLocaleString()}</p>
                        <p>IP: {session.ip} | {session.browser} | {session.os} | {session.deviceType}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Professional Information</h3>
                <p><strong>Profession:</strong> {selectedUser.profession}</p>
                <p><strong>Education:</strong> {selectedUser.education}</p>
                <p><strong>Experience:</strong> {selectedUser.yearsOfExperience} years</p>
              </div>

              {/* Verification Steps */}
              {[1, 2, 3].map(stepNum => {
                const step = selectedUser.verificationSteps[`step${stepNum}`];
                return (
                  <div key={stepNum} className="detail-section verification-section">
                    <h3>Step {stepNum} Verification</h3>
                    <p><strong>Completed:</strong> {step.completed ? 'Yes' : 'No'}</p>
                    {step.completed && (
                      <>
                        <p><strong>Status:</strong> 
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(step.adminStatus), marginLeft: '8px' }}
                          >
                            {step.adminStatus}
                          </span>
                        </p>
                        <p><strong>Admin Notes:</strong> {step.adminNotes || 'No notes'}</p>
                        
                        <div className="verification-actions">
                          <button 
                            className="approve-btn"
                            onClick={() => {
                              const notes = prompt('Enter approval notes (optional):');
                              updateVerification(selectedUser._id, stepNum, 'approved', notes || '');
                            }}
                          >
                            ✓ Approve
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => {
                              const notes = prompt('Enter rejection reason:');
                              if (notes) {
                                updateVerification(selectedUser._id, stepNum, 'rejected', notes);
                              }
                            }}
                          >
                            ✗ Reject
                          </button>
                          <button 
                            className="review-btn"
                            onClick={() => {
                              const notes = prompt('Enter review notes:');
                              updateVerification(selectedUser._id, stepNum, 'needs_review', notes || '');
                            }}
                          >
                            👁 Needs Review
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
