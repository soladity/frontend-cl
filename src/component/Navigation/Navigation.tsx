import * as React from 'react';
import { Box, Typography, Grid, Card, CardMedia, ButtonGroup, Button, Checkbox, FormLabel, FormControl, Slider } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { getTranslation } from '../../utils/translation';

type NProps = {
	totalCount: number;
	cPage: number;
	perPage: number;
	handlePage: Function;
};

// @TODO rework into virtualized list
export default function Navigation(props: NProps) {
	const { totalCount, cPage, perPage, handlePage } = props;

	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageNumbers, setPageNumbers] = React.useState<(string | number)[]>([]);
	const totalPage = totalCount % perPage === 0 ? Math.floor(totalCount / perPage) : Math.floor(totalCount / perPage) + 1;

	React.useEffect(() => {
		createPageNumbers(1);
	}, [totalCount]);

	React.useEffect(() => {
		setCurrentPage(cPage);
		createPageNumbers(cPage);
	}, [cPage]);

	const handleCurrentPage = (value: any) => {
		if (value !== 0) {
			setCurrentPage(value);
			createPageNumbers(value);
			handlePage(value);
		}
	}

	const createPageNumbers = (value: number) => {
		let tempArray = [];
		if (totalPage <= 5) {
			for (let i = 1; i <= totalPage; i++) {
				tempArray.push(i);
			}
		} else {
			if (value <= 4) {
				for (let i = 1; i <= value + 1; i++) {
					tempArray.push(i);
				}
				if (totalPage != 6) {
					tempArray.push('next');
				}
				tempArray.push(totalPage);
			} else {
				tempArray.push(1);
				tempArray.push('before');
				if (totalPage <= value + 3) {
					for (let i = value - 1; i <= totalPage; i++) {
						tempArray.push(i);
					}
				} else {
					tempArray.push(value - 1);
					tempArray.push(value);
					tempArray.push(value + 1);
					tempArray.push('next');
					tempArray.push(totalPage);
				}
			}
		}
		setPageNumbers(tempArray);
	}

	return (
		<div>
			<FormControl component="fieldset">
				<ButtonGroup variant="outlined" color="primary" aria-label="outlined button group">
					<Button variant='outlined' disabled={currentPage === 1 ? true : false} onClick={() => handleCurrentPage(currentPage === 1 ? 0 : 1)}>{getTranslation('first')}</Button>
					<Button variant='outlined' disabled={currentPage === 1 ? true : false} onClick={() => handleCurrentPage(currentPage === 1 ? 0 : currentPage - 1)}>{getTranslation('previous')}</Button>
					{
						pageNumbers.map((item, index) => (
							(item === 'before' || item === 'next') ? (
								<Button key={index} variant='outlined' onClick={() => handleCurrentPage(item === 'before' ? currentPage - 3 : currentPage + 3)}>
									<MoreHorizIcon />
								</Button>
							) : (
								<Button key={index} variant={`${currentPage === item ? 'contained' : 'outlined'}`} onClick={() => handleCurrentPage(item)}>
									{item}
								</Button>
							)
						))
					}
					<Button variant='outlined' disabled={currentPage === totalPage ? true : false} onClick={() => handleCurrentPage(currentPage === totalPage ? 0 : currentPage + 1)}>{getTranslation('next')}</Button>
					<Button variant='outlined' disabled={currentPage === totalPage ? true : false} onClick={() => handleCurrentPage(currentPage === totalPage ? 0 : totalPage)}>{getTranslation('last')}</Button>
				</ButtonGroup>
			</FormControl>
		</div>
	)
}
