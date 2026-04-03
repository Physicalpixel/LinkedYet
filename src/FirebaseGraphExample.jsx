import React, { useState, useEffect } from 'react';
import { subscribeToGraph, addUserConnections } from './firebaseService';

/**
 * Minimal Example Component
 * Shows how to:
 * 1. Subscribe to real-time graph data from Firestore.
 * 2. Add new data to Firestore.
 */
const FirebaseGraphExample = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [name, setName] = useState('');
  const [friend, setFriend] = useState('');

  // 1. Subscribe to live data on mount
  useEffect(() => {
    const unsubscribe = subscribeToGraph((data) => {
      setGraphData(data);
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  // 2. Function to add data
  const handleAdd = async () => {
    if (name && friend) {
      await addUserConnections(name, [friend]);
      setName('');
      setFriend('');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Live Graph Data (Nodes: {graphData.nodes.length})</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Your Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <input 
          placeholder="Friend's Name" 
          value={friend} 
          onChange={e => setFriend(e.target.value)} 
        />
        <button onClick={handleAdd}>Add Connection</button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <h4>Nodes</h4>
          <ul>
            {graphData.nodes.map(n => <li key={n.id}>{n.id}</li>)}
          </ul>
        </div>
        <div>
          <h4>Links (Edges)</h4>
          <ul>
            {graphData.links.map((l, i) => (
              <li key={i}>{l.source} ↔ {l.target}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FirebaseGraphExample;
