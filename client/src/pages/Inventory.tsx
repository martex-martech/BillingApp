import React, { useState, useContext, useMemo } from 'react';
import { AppContext, type Item } from '../context/AppContext';

const AddItemModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [stock, setStock] = useState(0);
    const [price, setPrice] = useState(0);
    const appContext = useContext(AppContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        appContext?.addItem({ name, stock, price });
        setName('');
        setStock(0);
        setPrice(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Item</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Item Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Organic Apples"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Stock Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={stock}
                                    onChange={(e) => setStock(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Price per unit (₹)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Add Item
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const BulkUploadModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = () => {
        if (file) {
            alert(`Simulating upload for ${file.name}. In a real app, this would be parsed on the backend.`);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Bulk Upload Items</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p className="text-muted">Upload a CSV file with columns: name, stock, price.</p>
                        <input
                            type="file"
                            accept=".csv"
                            className="form-control"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleUpload} disabled={!file}>
                            Upload CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Inventory: React.FC = () => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isBulkModalOpen, setBulkModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const appContext = useContext(AppContext);

    const filteredItems = useMemo(() => {
        return (
            appContext?.items.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) || []
        );
    }, [appContext?.items, searchTerm]);

    return (
        <div className="container my-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <h1 className="h3">Inventory</h1>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" onClick={() => setBulkModalOpen(true)}>
                        Bulk Upload
                    </button>
                    <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
                        Add Item
                    </button>
                </div>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Search by item name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Item Name</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item: Item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td className={item.stock < 10 ? 'text-danger fw-bold' : 'text-muted'}>
                                            {item.stock}
                                        </td>
                                        <td>₹{item.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredItems.length === 0 && (
                            <p className="text-center py-4 text-muted">No items found.</p>
                        )}
                    </div>
                </div>
            </div>

            <AddItemModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
            <BulkUploadModal isOpen={isBulkModalOpen} onClose={() => setBulkModalOpen(false)} />
        </div>
    );
};

export default Inventory;
