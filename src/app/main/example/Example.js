import React from 'react';
import {withStyles, TextField, Divider, IconButton, InputAdornment, Button} from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import _ from '@lodash';
import ExampleItem from "./ExampleItem";
import { FusePageSimple } from '@fuse';
import data from './data.json';
import dataCountries from './dataCountries.json';

const styles = theme => ({
    root: {
        padding: '24px 16px 24px 5px',
        minHeight: '400px',
    },
    headerContainer: {
        display: 'flex',
        position: 'sticky',
        top: '9px',
        zIndex: 100
    },
    rowHeader: {
        display: 'flex',
        flex: 'auto',
        alignContent: 'stretch',
        borderRight: '1px solid #B2B2B2',
        borderBottom: '1px solid #B2B2B2',
        borderTop: '1px solid #B2B2B2',
        background: '#F2F2F2',
        minWidth: '278px',
		maxWidth: '345px'
    },
    rowHeaderStart: {
        borderTopLeftRadius: '4px',
        borderLeft: '1px solid #B2B2B2',
    },
    rowHeaderEnd: {
        borderTopRightRadius: '4px',
    },
    dataHeader: {
        flex: 1,
        textAlign: 'center',
    },
    countryHeader: {
        flex: 1,
        paddingLeft: '15px',
        maxWidth: '160px'
    },
    container: {
        maxWidth: '1725px',
        margin: 'auto'
    },
    portContainer: {
        paddingTop: '10px'
    },
    contentContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 'auto',
        border: '1px solid #b2b2b2',
        borderBottomRightRadius: '4px',
        borderBottomLeftRadius: '4px',
        paddingBottom: '1px',
    },
    topContainer: {
        flexWrap: 'wrap',
        flex: 'auto',
        border: '1px solid #b2b2b2',
        borderBottomRightRadius: '4px',
        borderBottomLeftRadius: '4px',
        paddingBottom: '1px',
        display: 'flex'
    },
    nonTargetedContainer: {
        borderTop: '1px solid #b2b2b2',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
    },
    tableText: {
        fontFamily: 'Mulish',
        fontSize: '12px',
        color: '#646464',
        fontStyle: 'normal',
        lineHeight: '24px',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
    },
    contentDivider: {
        margin: '20px'
    },
    filterBar: {
        padding: '10px 0 10px 10px',
        borderBottom: '1px solid #b2b2b2',
        borderLeft: '1px solid #b2b2b2',
        borderRight: '1px solid #b2b2b2',
        borderBottomRightRadius: '4px',
        borderBottomLeftRadius: '4px',
        display: 'flex',
        alignItems: 'center',
    },
    textField: {
        verticalAlign: 'middle',
        marginLeft: 0,
        marginRight: 0,
        '& > div': {
            marginTop: 0
        },
        background: '#fff',
        width: 200,
        '& input': {
            fontSize: '1.4rem',
            paddingTop: 9.5,
            paddingBottom: 9.5,
        },
    },
    buttonsContainer: {
        marginTop: '15px'
    },
    button: {
        backgroundColor: '#00a7e1',
        color: 'white'
    }
});

const demoData = data;
const demoDataCountries = dataCountries;

class Example extends React.Component {
    state = {
        filteredTargeted: [],
        searchedValue: '',
        columnAmount: 5,
        app_id: null,
        campaign: null,
        displayedFields: [],
        testField: 0.18,
        openConfirmation: false,
        toggle: false,
        init: true
    };

    componentDidMount() {
        this.setInitialData();
    }

    setInitialData() {
        let [targeted, nonTargeted] = [[], []];
        let targetedRows = demoData;
        let headers = ['bid', 'budget'];

        demoDataCountries.forEach(countryRow => {
            let code = countryRow.code;
            var item = {
                code: code,
                name: countryRow.name,
                checked: false,
            }

            let itemData = [];
            itemData = this.setData(targetedRows, code);
            item.data = itemData;
            
            if (targetedRows[code]) {
                item.checked = true;
                item.targeted = true;
                item.original = true;
                targeted.push(item);
            } else {
                nonTargeted.push(item);
            }
        });
        let sortedTargeted = this.sortByCountry(targeted);
        let sortedNonTargeted = this.sortByCountry(nonTargeted);

        this.setState({
            targeted: sortedTargeted,
            nonTargeted: sortedNonTargeted,
            filteredTargeted: sortedTargeted,
            filteredNonTargeted: sortedNonTargeted,
            displayedFields: headers,
        });
    }

    // Set value for each header available
    setData = (targetedRows, code) => {
        let itemData = [];

        if (targetedRows[code]) {
            itemData['bid'] = {value: targetedRows[code].data[0].value};
            itemData['budget'] = {value: targetedRows[code].data[1].value}
        } else {
            itemData['bid'] = {value: 0};
            itemData['budget'] = {value: 50};
        }

        return itemData;
    }

    sortByChecked(data) {
		return [...data].sort(function (x,y) {
			return (x.checked === y.checked) ? 0 : x.checked ? -1 : 1;
		});
	}

    sortByCountry(list) {
		return list.sort(function (x,y) {
			return (x.code === y.code) ? 0 : ((x.code > y.code) ? 1 : -1);
		});
	}

    // Search field filtering
    filterCountries = (event) => {
        if (event.target.value === '') {
			this.setState({
				filteredTargeted: this.state.targeted,
				filteredNonTargeted: this.sortByChecked(this.state.nonTargeted),
				searchedValue: '',
			});
		} else {
			let newTargeted = this.state.targeted.filter(item => {
				return item.name.toLowerCase().includes(event.target.value.toLowerCase())
			});

			let newNonTargeted = this.state.nonTargeted.filter(item => {
				return item.name.toLowerCase().includes(event.target.value.toLowerCase())
			});

			this.setState({
				filteredTargeted: newTargeted,
				filteredNonTargeted: newNonTargeted,
				searchedValue: event.target.value,
			});
		}
    }

    checkTargetingItem = (code, hasOriginal) => {
		let newData = (hasOriginal) ? [...this.state.targeted] : [...this.state.nonTargeted];
		let newFilteredData = (hasOriginal) ? [...this.state.filteredTargeted] : [...this.state.filteredNonTargeted];
		let toUpdate = (hasOriginal) ? 'targeted' : 'nonTargeted';
		let toUpdateFiltered = (hasOriginal) ? 'filteredTargeted' : 'filteredNonTargeted';

		for (const i in newFilteredData) {
			if (newFilteredData[i].code === code) {
				let item = {...newFilteredData[i]};
				if (item.checked) {
					item.removed = (item.original) ? true : false;
					item.checked = false;
					item.new = false;
				} else {
					item.new = (item.original) ? false : true;
					item.removed = false;
					item.checked = true;
				}

				newFilteredData.splice(i, 1, item);
				let newDataIndex = newData.findIndex(obj => {
					return obj.code === item.code
				});
				newData.splice(newDataIndex, 1, item);

				this.setState({
					[toUpdate]: newData,
					[toUpdateFiltered]: newFilteredData
				});
				break;
			}
		}
    };

    changeField = (code, newValue, hasOriginal, fieldType) => {
        let regexValidator = /^\d*\.?\d*$/;
        if (regexValidator.test(newValue)) {
            let newData = (hasOriginal) ? [...this.state.targeted] : [...this.state.nonTargeted];
            let newFilteredData = (hasOriginal) ? [...this.state.filteredTargeted] : [...this.state.filteredNonTargeted];
            let toUpdate = (hasOriginal) ? 'targeted' : 'nonTargeted';
            let toUpdateFiltered = (hasOriginal) ? 'filteredTargeted' : 'filteredNonTargeted';

            for (const i in newFilteredData) {
                if (newFilteredData[i].code === code) {
                    let item = {...newFilteredData[i]};
                    item.data[fieldType].value = newValue;

                    newFilteredData.splice(i, 1, item);
                    let newDataIndex = newData.findIndex(obj => {
                        return obj.code === item.code
                    });
                    newData.splice(newDataIndex, 1, item);

                    this.setState({
                        [toUpdate]: newData,
                        [toUpdateFiltered]: newFilteredData
                    });
                    break;
                }
            }
        }
    }

    showTargeted() {
        return <>
            {this.state.filteredTargeted.map(item => {
                return <ExampleItem
                    key={item.code}
                    item={item}
                    headers={this.state.displayedFields}
                    onCheckTargeting={this.checkTargetingItem}
                    onChangeField={this.changeField}
                    columnAmount={this.state.columnAmount}
                ></ExampleItem>
            })}
        </>
    }

    performChange = () => {
        let targeted = [...this.state.targeted];
        let nonTargeted = [...this.state.nonTargeted];
        let removeFromTargeted = [];
        let removeFromTargetedIndexes = [];
        let removeFromNonTargeted = [];
        let removeFromNonTargetedIndexes = [];
       
        targeted.forEach((item, idx, arr) => {
            if (!item.checked) {
                item.original = false;
                removeFromTargetedIndexes.push(idx);
            }
        });
        removeFromTargeted = _.pullAt(targeted, removeFromTargetedIndexes);
        
        nonTargeted.forEach((item, idx, arr) => {
            if (item.checked) {
                item.original = true;
                removeFromNonTargetedIndexes.push(idx);
            }
        });
        removeFromNonTargeted = _.pullAt(nonTargeted, removeFromNonTargetedIndexes);
        
        targeted = targeted.concat(removeFromNonTargeted);
        nonTargeted = nonTargeted.concat(removeFromTargeted);
        
        let sortedTargeted = this.sortByCountry(targeted);
        let sortedNonTargeted = this.sortByCountry(nonTargeted);
        //API update happens here

        this.setState({
            targeted: sortedTargeted,
            nonTargeted: sortedNonTargeted,
            filteredTargeted: sortedTargeted,
            filteredNonTargeted: sortedNonTargeted,
            searchedValue: ''
        });
    }

    render() {
        const { classes } = this.props;
        const headers = [];

        // Construct defaults display (bid/budget combinations)
        if (!_.isEmpty(this.state.displayedFields)) {
            headers.push(<div key='countryHeader' className={classes.countryHeader}><span className={[classes.headerText, classes.tableText].join(" ")}>Country</span></div>)
            headers.push(<div key='bidBudgetHeader' className={classes.dataHeader}>
                <span className={[classes.headerText, classes.tableText].join(" ")}>Bid \ </span>
                <span className={[classes.headerText, classes.tableText].join(" ")}>Budget</span>
            </div>);
        }

        // Construct headers display for the data container
        var headerRows = [];
        for (let index = 0; index < this.state.columnAmount; index++) {
            let headerClasses = [
                classes.rowHeader,
                (index === 0) ? classes.rowHeaderStart : '',
                (index === this.state.columnAmount - 1) ? classes.rowHeaderEnd : ''
            ].join(" ");

            let headerRow = <div key={index} className={headerClasses}>{headers}</div>
            headerRows.push(headerRow);
        }

        return (
            <FusePageSimple
                classes={{
                    root: classes.layoutRoot
                }}
                content={
                    <>
                    {this.state.targeted ?
                    <div className={classes.container}>
                        <div className={classes.filterBar}>
                            <TextField
                                name="countryFilter"
                                value={this.state.searchedValue}
                                variant="outlined"
                                className={classes.textField + ' text'}
                                onChange={this.filterCountries}
                                placeholder="Search Country"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                        <div className={classes.portContainer}>
                            <>
                                <div className={classes.headerContainer}>{headerRows}</div>
                                <div className={classes.topContainer}>
                                    {this.showTargeted()}
                                </div>
                                <>
                                    {<Divider variant="middle" className={classes.contentDivider} />}
                                    <div style={{ display: 'flex' }} className={[classes.contentContainer, classes.nonTargetedContainer].join(" ")}>
                                        {this.state.filteredNonTargeted.map(item => {
                                            return <ExampleItem
                                                key={item.code}
                                                item={item}
                                                headers={this.state.displayedFields}
                                                onCheckTargeting={this.checkTargetingItem}
                                                onChangeField={this.changeField}
                                                columnAmount={this.state.columnAmount}
                                            ></ExampleItem>
                                        })}
                                    </div>
                                </>
                            </>
                        </div>
                        <div className={classes.buttonsContainer}>
                            <Button
                                className={[classes.button, classes.buttonChange].join(" ")}
                                variant="contained"
                                onClick={this.performChange}
                            >
                                CHANGE
                            </Button>
                        </div> 
                    </div> : ''
                    }
                    </>
                }
            />
        )
    }
}

export default withStyles(styles, { withTheme: true })(Example);
