import React, { useState, useContext, useMemo } from 'react';
import { AppContext, type Party } from '../../context/AppContext';

const AddPartyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState<'Customer' | 'Supplier'>('Customer');
    const appContext = useContext(AppContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && phone && category) {
            appContext?.addParty({ name, phone, category });
            setName('');
            setPhone('');
            setCategory('Customer');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Party</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Party Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter party name"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as 'Customer' | 'Supplier')}
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Supplier">Supplier</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Add Party
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Parties: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const appContext = useContext(AppContext);

    const filteredParties = useMemo(() => {
        return (
            appContext?.parties.filter(
                (party) =>
                    party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    party.phone.includes(searchTerm)
            ) || []
        );
    }, [appContext?.parties, searchTerm]);

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">Parties</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    Add Party
                </button>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParties.map((party: Party) => (
                                    <tr key={party.id}>
                                        <td>{party.name}</td>
                                        <td>{party.phone}</td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    party.category === 'Customer'
                                                        ? 'bg-primary'
                                                        : 'bg-success'
                                                }`}
                                            >
                                                {party.category}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredParties.length === 0 && (
                            <p className="text-center py-4 text-muted">No parties found.</p>
                        )}
                    </div>
                </div>
            </div>

            <AddPartyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Parties;
