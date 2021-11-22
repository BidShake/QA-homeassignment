import React from 'react';
import {withStyles,	Checkbox, Input} from '@material-ui/core';
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = theme => ({
	root: {
		minHeight: '400px',
	},
	bidField: {
		marginRight: '2px',
		maxWidth: '56px',
	},
	budgetField: {
		marginRight: '5px',
		maxWidth: '56px',
	},
	tableText: {
		fontFamily: 'Mulish',
		fontSize: '12px',
		color: '#646464',
		fontStyle: 'normal',
		lineHeight: '24px',
		alignItems: 'center',
	},
	divider: {
		margin: '0 5px 0 1px',
	},
	dataRowContainer: {
		display: 'flex',
		flex: '1',
		color: '#646464',
		alignItems: 'baseline',
		justifyContent: 'center',
	},
	countryNameContainer: {
		display: 'flex',
		alignItems: 'center',
		maxWidth: '160px',
	},
	countryName:{
		width: '120px',
		marginLeft:'4px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	rowContainer: {
		display: 'flex',
		flex: 'auto',
		alignItems: 'center',
		alignContent: 'stretch',
		minWidth: '278px',
		maxWidth: '345px',
		height: '40px',
		borderBottom: '1px solid #F2F2F2',
		flexGrow: 0
	},
	flag: {
		height:'10px',
		width:'16px'
	},
});

const CustomCheckbox = withStyles({
	root: {
		color: "#b2b2b2",
		padding: '7px',
		"&$checked": {
			color: "#00a7e1"
	  	}
	},
	checked: {}
})((props) => <Checkbox color="default" {...props} />);

const CustomInput = withStyles({
	root: {
		'&:hover:before': {
			borderBottomColor: '#002f3f !important',
		},
		'&:after': {
			borderBottomColor: '#00A7E1',
		},
	},
})((props) => <Input color="default" {...props} />);

class ExampleItem extends React.Component {

	state = {
		item: this.props.item,
		code: this.props.item.code
	};

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.item !== nextProps.item || this.props.columnAmount !== nextProps.columnAmount);
	}

	render() {
        const {classes} = this.props;

        var [bid, budget] = [null, null];
        let rowContainerClasses = [
            classes.tableText,
            classes.rowContainer,
        ];

        let row = null;
        let item = this.props.item;
        if(item) {
            if (this.props.headers.includes("bid")) {
                let bidValue = (item.data.bid.value === 0) ? Number(item.data.bid.value).toFixed(2) : item.data.bid.value;
                let cssClass = classes.bidField;

                bid = <>
                    <CustomInput
                        className={[classes.tableText, cssClass].join(" ")}
                        type="tel"
                        fullWidth={true}
                        value={bidValue}
                        startAdornment={<InputAdornment style={{marginRight: '1px'}} position="start">$</InputAdornment>}
                        inputProps={{
                            step: (1 / Math.pow(10, 2)),
                            maxLength: 5 + 2,
                            style: {textAlign: 'left'},
                        }}
                        size="small"
                        onChange={(e) => {this.props.onChangeField(item.code, e.target.value, item.original, 'bid')}}>
                    </CustomInput>
                </>
            }
            if (this.props.headers.includes("budget")) {
                let budgetValue = item.data.budget.value;
                let cssClass = classes.budgetField;

                budget = <>
                    <span className={classes.divider}>\</span>
                    <CustomInput
                        className={[classes.tableText, classes.budgetField, cssClass].join(" ")}
                        style={{width: '8ch'}}
                        type="tel"
                        value={budgetValue}
                        startAdornment={<InputAdornment style={{marginRight: '1px'}} position="start">$</InputAdornment>}
                        inputProps={{
                            step: 1,
                            maxLength: 6,
                            style: {textAlign: 'left'},
                        }}
                        onChange={(e) => this.props.onChangeField(item.code, e.target.value, item.original, 'budget')}>
                    </CustomInput>
                </>
            }

            let bidBudgetDiv = <div className={classes.dataRowContainer}>{bid}{budget}</div>;
            row = <div className={rowContainerClasses.join(" ")} style={{opacity: this.props.hidden ? "0" : "1", flexBasis: (100 / this.props.columnAmount).toString() + '%'}}>
                <div className={classes.countryNameContainer}>
                    <CustomCheckbox
                        checked={item.checked}
                        value={item.code}
                        onChange={(e) => this.props.onCheckTargeting(item.code, item.original)}
                    />
                    <img src={`${process.env.PUBLIC_URL}/assets/images/flags/${item.code.toLowerCase()}.svg`} alt="" className={classes.flag}></img>
                    <span className={classes.countryName}>
						{item.name}
					</span>
                </div>
                {bidBudgetDiv}
            </div>
        }

        return row;
	}
}

export default (withStyles(styles, {withTheme: true}) (ExampleItem));
