import React from 'react';
import classNames from 'classnames';
import styles from './Card.module.css';

const Card = ({ card, isSelected, onClick }) => {
    if (!card) return <div className={styles.emptyCard} />;

    const { number, shape, shading, color } = card;

    // Helper to render shapes
    const renderShape = () => {
        // SVG paths for shapes
        // SVG paths for shapes (ViewBox 0 0 100 50) - Horizontal
        const paths = {
            // Wide Capsule
            oval: "M25,12 L75,12 A13,13 0 0,1 75,38 L25,38 A13,13 0 0,1 25,12 Z",

            // Wide Diamond
            diamond: "M10,25 L50,5 L90,25 L50,45 Z",

            // Horizontal Squiggle
            squiggle: "M15,14 C15,4 40,4 50,16 C60,28 85,28 85,16 C85,6 95,6 95,20 C95,36 75,46 50,34 C25,22 25,36 10,36 C0,36 0,24 15,14 Z"
        };

        // We'll use SVG for rendering shapes to handle shading easily
        return (
            <svg viewBox="0 0 100 50" className={styles.shapeSvg}>
                <defs>
                    <pattern id={`striped-${color}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="4" stroke={getColor(color)} strokeWidth="2" />
                    </pattern>
                </defs>
                <path
                    d={paths[shape]}
                    fill={getFill(shading, color)}
                    stroke={getColor(color)}
                    strokeWidth="2"
                />
            </svg>
        );
    };

    const getColor = (c) => {
        switch (c) {
            case 'red': return '#ff7675';
            case 'green': return '#55efc4';
            case 'purple': return '#a29bfe';
            default: return '#000';
        }
    };

    const getFill = (s, c) => {
        switch (s) {
            case 'solid': return getColor(c);
            case 'open': return 'none';
            case 'striped': return `url(#striped-${c})`;
            default: return 'none';
        }
    };

    return (
        <div
            className={classNames(styles.card, { [styles.selected]: isSelected })}
            onClick={onClick}
        >
            {Array.from({ length: number }).map((_, i) => (
                <div key={i} className={styles.shapeContainer}>
                    {renderShape()}
                </div>
            ))}
        </div>
    );
};

export default Card;
