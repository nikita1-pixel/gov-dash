const GrievanceModal = ({ issue, onClose, onSave }) => {
    const [formData, setFormData] = React.useState({
        title: '',
        location: '',
        priority: 'Medium',
        description: '',
        latitude: 18.5204,
        longitude: 73.8567
    });

    // Sync state when "issue" prop changes (e.g., clicking a map marker)
    React.useEffect(() => {
        if (issue) {
            setFormData({
                ...issue,
                latitude: issue.latitude || 18.5204,
                longitude: issue.longitude || 73.8567
            });
        }
    }, [issue]);

    if (!issue) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={modalOverlay}>
            <div style={modalContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{issue.isNew ? 'Report New Issue' : 'Edit Issue'}</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        style={inputStyle}
                        placeholder="Issue Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <input
                        style={inputStyle}
                        placeholder="Area/Location Name"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Latitude</label>
                            <input style={inputLocked} value={formData.latitude.toFixed(6)} readOnly />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Longitude</label>
                            <input style={inputLocked} value={formData.longitude.toFixed(6)} readOnly />
                        </div>
                    </div>

                    <select
                        style={inputStyle}
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                    </select>

                    <textarea
                        style={{ ...inputStyle, height: '80px' }}
                        placeholder="Describe the issue..."
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <button type="submit" style={submitBtn}>
                        {issue.isNew ? 'Post to Map' : 'Update Issue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Modal Styles
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 };
const modalContent = { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' };
const inputLocked = { ...inputStyle, backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' };
const labelStyle = { fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '4px', display: 'block' };
const submitBtn = { padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' };