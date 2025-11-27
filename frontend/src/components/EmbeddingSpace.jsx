import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts';

const EmbeddingSpace = ({ data }) => {
        const CustomTooltip = ({ active, payload }) => {
                if (active && payload && payload.length) {
                        const point = payload[0].payload;
                        return (
                                <div style={{
                                        background: 'white',
                                        padding: '12px 16px',
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                        <p style={{
                                                margin: 0,
                                                fontFamily: "'Courier New', monospace",
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                color: '#4f46e5',
                                                marginBottom: '8px'
                                        }}>
                                                {point.token}
                                        </p>
                                        <div style={{ fontSize: '12px', color: '#6c757d', lineHeight: 1.6 }}>
                                                <div>Token ID: <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{point.id}</span></div>
                                                <div>Position: <span style={{ color: '#1a1a1a', fontWeight: 500 }}>({point.x.toFixed(2)}, {point.y.toFixed(2)})</span></div>
                                        </div>
                                </div>
                        );
                }
                return null;
        };

        return (
                <div className="card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
                        <h2 className="card-header">
                                <span className="card-header-indicator indicator-green"></span>
                                Embedding Space (PCA)
                        </h2>
                        <p style={{
                                fontSize: '13px',
                                color: '#6c757d',
                                marginBottom: '1rem',
                                lineHeight: 1.5
                        }}>
                                2D projection of token embeddings using Principal Component Analysis.
                                Tokens with similar meanings cluster together.
                        </p>
                        <div style={{ flex: 1, minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 30 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                                                <XAxis
                                                        type="number"
                                                        dataKey="x"
                                                        name="PC1"
                                                        stroke="#6c757d"
                                                        tick={{ fill: '#6c757d', fontSize: 12 }}
                                                        label={{ value: 'Principal Component 1', position: 'bottom', fill: '#6c757d', fontSize: 12 }}
                                                />
                                                <YAxis
                                                        type="number"
                                                        dataKey="y"
                                                        name="PC2"
                                                        stroke="#6c757d"
                                                        tick={{ fill: '#6c757d', fontSize: 12 }}
                                                        label={{ value: 'Principal Component 2', angle: -90, position: 'left', fill: '#6c757d', fontSize: 12 }}
                                                />
                                                <ZAxis range={[60, 60]} />
                                                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#4f46e5' }} />
                                                <Scatter
                                                        name="Embeddings"
                                                        data={data}
                                                        shape="circle"
                                                >
                                                        {data.map((entry, index) => (
                                                                <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={index < 20 ? '#ef4444' : '#4f46e5'}
                                                                        fillOpacity={0.7}
                                                                        stroke={index < 20 ? '#dc2626' : '#4338ca'}
                                                                        strokeWidth={1.5}
                                                                />
                                                        ))}
                                                </Scatter>
                                        </ScatterChart>
                                </ResponsiveContainer>
                        </div>
                        <div style={{
                                display: 'flex',
                                gap: '16px',
                                marginTop: '12px',
                                padding: '12px',
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                fontSize: '13px'
                        }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: '#ef4444',
                                                border: '1.5px solid #dc2626'
                                        }} />
                                        <span style={{ color: '#6c757d' }}>First 20 tokens</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: '#4f46e5',
                                                border: '1.5px solid #4338ca'
                                        }} />
                                        <span style={{ color: '#6c757d' }}>Other tokens</span>
                                </div>
                        </div>
                </div>
        );
};

export default EmbeddingSpace;
