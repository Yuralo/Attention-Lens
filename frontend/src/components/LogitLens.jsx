import React, { useState, useEffect } from 'react';
import { getLogitLens } from '../api';

const LogitLens = ({ text }) => {
        const [lensData, setLensData] = useState(null);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
                if (!text) return;

                const fetchData = async () => {
                        setLoading(true);
                        try {
                                const data = await getLogitLens(text, 5);
                                setLensData(data);
                        } catch (error) {
                                console.error("Error fetching logit lens:", error);
                        }
                        setLoading(false);
                };

                fetchData();
        }, [text]);

        if (loading) {
                return <div className="card"><div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div></div>;
        }

        if (!lensData) {
                return null;
        }

        const formatToken = (token) => {
                if (token === '\n') return '↵';
                if (token === '\t') return '→';
                if (token === ' ') return '·';
                return token;
        };

        return (
                <div className="card">
                        <h2 className="card-header">
                                <span className="card-header-indicator indicator-pink"></span>
                                Logit Lens
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem', marginLeft: '0.75rem' }}>
                                See how predictions evolve through the model: before attention vs. after attention
                        </p>

                        <div className="logit-lens-grid">
                                {lensData.lens.map((item, idx) => (
                                        <div key={idx} className="lens-item">
                                                <div className="lens-token-header">
                                                        <span className="lens-position">#{idx}</span>
                                                        <span className="lens-token">{formatToken(item.token)}</span>
                                                </div>

                                                <div className="lens-stages">
                                                        {/* Pre-attention predictions */}
                                                        <div className="lens-stage">
                                                                <div className="lens-stage-label">Pre-Attention</div>
                                                                <div className="lens-predictions">
                                                                        {item.pre_attention.map((pred, i) => (
                                                                                <div key={i} className="lens-pred-item">
                                                                                        <span className="lens-pred-rank">{i + 1}.</span>
                                                                                        <span className="lens-pred-token">{formatToken(pred.token)}</span>
                                                                                        <span className="lens-pred-prob">{(pred.prob * 100).toFixed(1)}%</span>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        {/* Arrow */}
                                                        <div className="lens-arrow">→</div>

                                                        {/* Final predictions */}
                                                        <div className="lens-stage">
                                                                <div className="lens-stage-label">Final</div>
                                                                <div className="lens-predictions">
                                                                        {item.final.map((pred, i) => (
                                                                                <div key={i} className="lens-pred-item">
                                                                                        <span className="lens-pred-rank">{i + 1}.</span>
                                                                                        <span className="lens-pred-token">{formatToken(pred.token)}</span>
                                                                                        <span className="lens-pred-prob">{(pred.prob * 100).toFixed(1)}%</span>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                ))}
                        </div>
                </div>
        );
};

export default LogitLens;
