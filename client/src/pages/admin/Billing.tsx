import React, { useState, useContext, useMemo } from 'react';
import { AppContext, type InvoiceItem } from '../../context/AppContext';

const Billing: React.FC = () => {
    const [partyId, setPartyId] = useState('');
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
    const appContext = useContext(AppContext);

    const availableItems = appContext?.items || [];
    const parties = appContext?.parties || [];

    const handleAddItem = () => {
        if (availableItems.length > 0) {
            const firstItem = availableItems[0];
            setInvoiceItems([
                ...invoiceItems,
                { itemId: firstItem.id, name: firstItem.name, qty: 1, price: firstItem.price },
            ]);
        }
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: unknown) => {
        const newItems = [...invoiceItems];
        if (field === 'itemId') {
            const selectedItem = availableItems.find((i) => i.id === value);
            if (selectedItem) {
                newItems[index].itemId = selectedItem.id;
                newItems[index].name = selectedItem.name;
                newItems[index].price = selectedItem.price;
            }
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }
        setInvoiceItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    };

    const total = useMemo(() => {
        return invoiceItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    }, [invoiceItems]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (partyId && invoiceItems.length > 0) {
            const invoice = {
                partyId,
                items: invoiceItems,
                total,
                date: new Date().toISOString().split('T')[0],
            };
            appContext?.addInvoice(invoice);
            alert('Invoice created successfully!');
            setPartyId('');
            setInvoiceItems([]);
        } else {
            alert('Please select a party and add at least one item.');
        }
    };

    const sendInvoiceViaWhatsapp = () => {
        alert('Simulating sending invoice via WhatsApp...');
    };

    return (
        <div className="container my-4">
            <h1 className="h3 mb-4">Create Invoice</h1>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-4">
                    <label className="form-label">Select Party</label>
                    <select
                        className="form-select"
                        value={partyId}
                        onChange={(e) => setPartyId(e.target.value)}
                        required
                    >
                        <option value="">-- Choose a party --</option>
                        {parties.map((party) => (
                            <option key={party.id} value={party.id}>
                                {party.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <h5>Items</h5>
                    {invoiceItems.map((item, index) => (
                        <div key={index} className="row g-3 align-items-center mb-3">
                            <div className="col-md-5">
                                <select
                                    className="form-select"
                                    value={item.itemId}
                                    onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                                >
                                    {availableItems.map((availItem) => (
                                        <option key={availItem.id} value={availItem.id}>
                                            {availItem.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    min={1}
                                    className="form-control"
                                    value={item.qty}
                                    onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))}
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                                />
                            </div>
                            <div className="col-md-2 text-end fw-medium">
                                ₹{(item.qty * item.price).toFixed(2)}
                            </div>
                            <div className="col-md-1 text-end">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleRemoveItem(index)}
                                    title="Remove"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline-secondary" onClick={handleAddItem}>
                        Add Item
                    </button>
                </div>

                <div className="border-top pt-3">
                    <div className="d-flex justify-content-end align-items-center mb-3">
                        <strong className="me-3 fs-5">Total:</strong>
                        <span className="fs-5">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            onClick={sendInvoiceViaWhatsapp}
                            className="btn btn-success"
                        >
                            Send via WhatsApp
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Invoice
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Billing;
