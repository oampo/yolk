import React from 'react';
import './ColorPalette.css';

export default class ColorPalette extends React.Component {
    renderNone() {
        let classes = 'color-palette-color color-palette-color-none';
        if (this.props.selectedColor === null) {
            classes += ' color-palette-color-selected';
        }
        return (
            <div
                className={classes}
                onClick={() => this.props.selectColor(null)}
            />
        );
    }

    render() {
        const colors = this.props.colors.map((color, index) => (
            <div
                key={index}
                className={`color-palette-color ${
                    index === this.props.selectedColor
                        ? 'color-palette-color-selected'
                        : ''
                }`}
                style={{backgroundColor: color}}
                onClick={() => this.props.selectColor(index)}
            />
        ));
        return (
            <div className="color-palette">
                {this.renderNone()}
                {colors}
            </div>
        );
    }
}
