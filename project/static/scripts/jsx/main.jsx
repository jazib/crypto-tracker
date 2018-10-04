import React from 'react';
import {PropTypes} from 'prop-types';

import Select from 'react-select';
import axios from 'axios';
import ReactDOM from 'react-dom';


class ResultsComponent extends React.Component {

    render() {
        const Card = cardData => (
            <div className={cardData.colorClass + " card"}>
                <div className="card-body text-center">
                    <h5 className="card-title">{cardData.exchange}</h5>
                    <p className="card-text">{cardData.price}</p>
                    {cardData.hasOwnProperty('error') &&
                    <p className="card-text text-danger">Error: {cardData.error + " " + cardData.content.message}</p>}
                </div>
            </div>
        );
        const cards = this.props.cardsList.map(cardData => {
            if (cardData.hasOwnProperty('isMax')) {
                cardData['colorClass'] = 'bg-success';
            } else if (cardData.hasOwnProperty('isMin')) {
                cardData['colorClass'] = 'bg-danger';
            } else {
                cardData['colorClass'] = '';
            }

            return Card(cardData)
        });

        return (
            <div className="results">
                <div className="card-columns">
                    {cards}
                </div>
            </div>
        )

    }
}


ResultsComponent.defaultProps = {
    cardsList: [],
};

ResultsComponent.propTypes = {
    cardsList: PropTypes.array.isRequired,
};

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
            products: [],
            productPrices: [],
            isLoading: false,
            error: false,
        }
    }

    componentDidMount() {
        axios.get(`/api/v1.0/products`)
            .then(res => {
                const products = res.data.map(obj => {
                    return {'value': obj, 'label': obj}
                });
                this.setState({products});
            });
    }

    setMaxMin = (productPrices) => {

        let max = productPrices.reduce(function (prev, current) {
            if (+current.price > +prev.price) {
                return current;
            } else {
                return prev;
            }
        });

        let min = productPrices.reduce(function (prev, current) {
            if (+current.price < +prev.price) {
                return current;
            } else {
                return prev;
            }
        });

        max['isMax'] = true;
        min['isMin'] = true;

        this.setState({productPrices: productPrices, isLoading: false});
    };

    fetchPirces = (product) => {
        if (product === this.state.selectedOption.value) {
            return;
        }
        this.setState({isLoading: true, productPrices: [], error: false});
        axios.get(`api/v1.0/products/${product}/prices`)
            .then(res => {
                this.setMaxMin(res.data);
            }).catch(err => {
            console.error(err);
            this.setState({error: true, isLoading: false})
        });
    };

    handleChange = (selectedOption) => {
        this.setState({selectedOption});
        this.fetchPirces(selectedOption.value);
    };

    render() {
        const {selectedOption} = this.state;

        return (
            <div className="container">
                Please select a product
                <Select
                    value={selectedOption}
                    onChange={this.handleChange}
                    options={this.state.products}
                />
                <ResultsComponent cardsList={this.state.productPrices}/>
                {this.state.error && <div className="text-danger">Server error. Please try again later.</div>}
                {this.state.isLoading && <div className="loader"></div>}
            </div>
        )
    }
}


ReactDOM.render(
    <App/>,
    document.getElementById('main')
);