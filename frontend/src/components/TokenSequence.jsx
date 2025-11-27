import React, { useState, useEffect } from 'react';
import { getTokenPredictions } from '../api';

const TokenSequence = ({ text }) => {
        const [tokenData, setTokenData] = useState(null);
        const [hoveredToken, setHoveredToken] = useState(null);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
                if (!text) return;

                const fetchData = async () => {
                        setLoading(true);
                        try {
                                const data = await getTokenPredictions(text, 5);
                                setTokenData(data);
                        } catch (error) {
                                console.error("Error fetching token predictions:", error);
                        }
                        setLoading(false);
                };

                fetchData();
        }, [text]);

        if (loading) {
                return <div className="card"><div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div></div>;
        }

        if (!tokenData) {
                return null;
        }

        const formatToken = (token) => {
                // Handle special characters
                if (token === '\n') return '↵';
                if (token === '\t') return '→';
                if (token === ' ') return '·';
                return token;
        };

        const getConfidenceColor = (prob) => {
                // Color intensity based on probability
                const intensity = Math.min(prob * 2, 1); // Scale up for visibility
                return `rgba(59, 130, 246, ${intensity * 0.6 + 0.1})`;
        };

        return (
                <div className="card">
                        <h2 className="card-header">
                                <span className="card-header-indicator indicator-blue"></span>
                                Interactive Token Sequence
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem', marginLeft: '0.75rem' }}>
                                Hover over each token to see the model's prediction probability and top alternatives
                        </p>

                        <div className="token-sequence">
                                {tokenData.predictions.map((pred, idx) => (
                                        <div
                                                key={idx}
                                                className="token-box"
                                                style={{ backgroundColor: getConfidenceColor(pred.actual_prob) }}
                                                onMouseEnter={() => setHoveredToken(idx)}
                                                onMouseLeave={() => setHoveredToken(null)}
                                        >
                                                <span className="token-text">{formatToken(pred.actual_token)}</span>

                                                {hoveredToken === idx && (
                                                        <div className="token-hover-tooltip">
                                                                <div className="tooltip-header">
                                                                        <span className="tooltip-token">{formatToken(pred.actual_token)}</span>
                                                                        <span className="tooltip-prob">{(pred.actual_prob * 100).toFixed(1)}%</span>
                                                                </div>
                                                                <div className="tooltip-divider"></div>
                                                                <div className="tooltip-alternatives">
                                                                        <div className="tooltip-label">Top Alternatives:</div>
                                                                        {pred.top_k.slice(0, 5).map((alt, i) => (
                                                                                <div key={i} className="tooltip-alt-item">
                                                                                        <span className="alt-token">{formatToken(alt.token)}</span>
                                                                                        <div className="alt-prob-bar">
                                                                                                <div
                                                                                                        className="alt-prob-fill"
                                                                                                        style={{ width: `${alt.prob * 100}%` }}
                                                                                                />
                                                                                        </div>
                                                                                        <span className="alt-prob-text">{(alt.prob * 100).toFixed(1)}%</span>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                                <div className="tooltip-footer">
                                                                        Position: {idx} | Token ID: {pred.actual_token_id}
                                                                </div>
                                                        </div>
                                                )}
                                        </div>
                                ))}
                        </div>
                </div>
        );
};

export default TokenSequence;
