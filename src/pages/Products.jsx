import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New Search State
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    // Double check your port number (3869) matches your Spring Boot application.properties
    axios.get('http://localhost:3869/api/products')
      .then(r => {
        console.log("Data received from Java:", r.data); // DEBUG: Check console
        setProducts(r.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
        toast.error('Cannot connect to Backend API');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Filter products based on search input
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#111827' }}>Inventory</h2>
          
          {/* SEARCH BAR */}
          <input 
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
                marginTop: '10px',
                padding: '8px 15px',
                width: '300px',
                borderRadius: '8px',
                border: '1.5px solid #d1d5db',
                outline: 'none'
            }}
          />
        </div>
        
        <button onClick={() => {/* your openAdd logic */}} style={btnStyle}>+ Add Product</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}><div className="loader"></div></div>
      ) : (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    {products.length === 0 ? "No products found in Database." : "No results match your search."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={tdStyle}><b>{p.name}</b><br/><small>{p.category}</small></td>
                    <td style={tdStyle}>
                        <span style={{ 
                            color: p.stockQuantity < 5 ? 'red' : 'green',
                            fontWeight: 'bold'
                        }}>
                            {p.stockQuantity} {p.unit}
                        </span>
                    </td>
                    <td style={tdStyle}>₹{p.sellingPrice}</td>
                    <td style={tdStyle}>
                        <button style={{ color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: '15px', textAlign: 'left', fontSize: '12px', color: '#6b7280' };
const tdStyle = { padding: '15px', fontSize: '14px' };
const btnStyle = { padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };