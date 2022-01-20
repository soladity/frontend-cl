import React from 'react'
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { Button, ButtonGroup, Card, CardContent, Grid, Paper, Skeleton, Slider } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CardSm from '../../Cards/CardSm';

const FilterCards = () => {
	const [apValue, setApValue] = React.useState<number[]>([20, 37]);
	const [bsValue, setBsValue] = React.useState<number[]>([20, 37]);

	const handleChangeAp = (
		event: Event,
		newValue: number | number[],
		activeThumb: number,
	) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		if (activeThumb === 0) {
			setApValue([Math.min(newValue[0], apValue[1] - 1), apValue[1]]);
		} else {
			setApValue([apValue[0], Math.max(newValue[1], apValue[0] + 1)]);
		}
	};

	const handleChangeBs = (
		event: Event,
		newValue: number | number[],
		activeThumb: number,
	) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		if (activeThumb === 0) {
			setBsValue([Math.min(newValue[0], bsValue[1] - 1), bsValue[1]]);
		} else {
			setBsValue([bsValue[0], Math.max(newValue[1], bsValue[0] + 1)]);
		}
	};

	return (
		<Box>
			<Paper sx={{ mb: "24px", padding: 2 }}>
				<Grid spacing={2}
					container
					direction="row"
					justifyContent="stretch"
					alignItems="stretch"
				>
					<Grid item xs={12} md={3}>
						<FormControl component="fieldset">
							<FormLabel component="legend" style={{ marginBottom: 8 }}>Filter by level:</FormLabel>
							<ButtonGroup variant="outlined" color="primary" aria-label="outlined button group">
								<Button>1</Button>
								<Button>2</Button>
								<Button variant="contained">3</Button>
								<Button>4</Button>
								<Button>5</Button>
								<Button>6</Button>
							</ButtonGroup>
						</FormControl>
					</Grid>

					<Grid item xs={12} md={3}>
						<FormControl component="fieldset" sx={{ width: '90%' }}>
							<FormLabel component="legend">Filter by AP:</FormLabel>
							<Slider
								getAriaLabel={() => "Custom marks"}
								// defaultValue={20}
								value={apValue}
								min={5}
								max={80}
								marks={[
									{ value: 5, label: '5' },
									{ value: 80, label: '80' },
								]}
								step={1}
								valueLabelDisplay="auto"
								onChange={handleChangeAp}
								disableSwap
							/>
						</FormControl>
					</Grid>

					<Grid item xs={12} md={3}>
						<FormControl component="fieldset" sx={{ width: '90%' }}>
							<FormLabel component="legend">Filter by $Bloodstone:</FormLabel>
							<Slider
								getAriaLabel={() => "Custom marks"}
								// defaultValue={20}
								value={bsValue}
								min={5}
								max={80}
								marks={[
									{ value: 5, label: '5' },
									{ value: 80, label: '80' },
								]}
								step={1}
								valueLabelDisplay="auto"
								onChange={handleChangeBs}
								disableSwap
							/>
						</FormControl>
					</Grid>

					<Grid item xs={12} md={3}>
						<Grid>
							<FormControl component="fieldset">
								<FormLabel component="legend">Sort by:</FormLabel>
								<RadioGroup row aria-label="gender" name="row-radio-buttons-group">
									<FormControlLabel value="AP" control={<Radio />} label="AP" />
									<FormControlLabel value="$Bloodstone" control={<Radio />} label="$Bloodstone" />
									<FormControlLabel value="Level" control={<Radio />} label="Level" />
								</RadioGroup>
							</FormControl>
							<Button variant="outlined">Show My Listing</Button>
						</Grid>
					</Grid>

				</Grid>
			</Paper>

			<Grid container spacing={2} sx={{ mb: 4 }}>
				<Grid item xs={3}>
					<CardSm image={"https://uc73451e395a40e1bbf333aa1dce.previews.dropboxusercontent.com/p/thumb/ABbcaRgSyKClSK8DTWg77StVIlUtauzezyQumBVvchP60a-XaXMq9CU1J2DjuIcCt3DHAERYdXOA7SY_QRrj1BqVtQaUwnDYfFfCPyLbDYxVvS0dcRSgwQ8Uj9TIFYd2Cb_OUh61HGQpWLcgExNfZXXmotJvqRsFLxywkiUYtCVRoAZoPh8meIlIMVKijqssGdh_5JNN_iyNUipqpSVChO2G8836-C8yve1l1fQKbM0Z3MJ7ePAOJS-CzZYfa-GigEEaWDZFUmvLT4bi8vx-zBjhLsb3qhomXv0Tb6VAqqdvndowaEI6-W7L_r1RXv8Nlh2yK27Z1dmki18lO0LQ2QhPgGgEivaX8OjUFRj00P_1nWFtvK67oB8J2kmxZOQkg8U/p.gif"} />
				</Grid>
				<Grid item xs={3}>
					<CardSm image={"https://ucb2b30381f664573476b8d8e685.previews.dropboxusercontent.com/p/thumb/ABYJSojYwEXlllWqDPOZvsFb4F2ENjt-1ecROewf1hYrWZ8G8RviWzVVEZD0P5sQTtBHeQ4yF9MzaKqxxD5iECkOOYVcig6hy3atskB4GoZdoQzpXtm7JsUYllJuqnv_pQe1p0P7PtnJGOgiWMRWrRj0sYCRVV0S-0htBep-x3P9DDFc32Pip8520vrmacEJiqk_Py7wJZbrJ6IJlwqwItr1epmsyW1fUcA83XHTeBVhxA7qzG8bTqRv6WZtwBZUlWE-IqNByg6f295Jus7SmQzboX8o91ljwwtyahjFmHj61DdJn1r6fGuN81dthdTJWMRLxKaZHPl9VoIwxFOCoIKduYyhWlG33B6fp7LFKqM27LNk98yH_IDpv89wkIo99k4/p.gif"} />
				</Grid>
				<Grid item xs={3}>
					<CardSm image={"https://uc84480d507953c4b2bf27c4182e.previews.dropboxusercontent.com/p/thumb/ABbWehB6_2oyMu23daGpRMBnJPv6yQk7QKLEQJwq5w62RpBKy3wJTQJzFpvtcaGGFG-rr0YfJKAO_fmho3ne2eDH610thfynmcQOaH9cOF51I8TSumUD2umqAcsTBNwgSTW556m6M4cQBo1Ha4fObqrlsoeaNdLRDzCU6x--73OSNehddTugv2_MPG9SJy_lRtL3sHq1MOReaRTI86SWXedI0gl09AiL_LeDnJei8cq49FHBwc3qeG1GfWH3CKZFsvNeC5gRr1JsGiLLaBEWCHsDbiSDI48YWVxcBwD-IYWA27OtqOzdon5mJv-vTbls_vYchphdExHfTtCHcqRjgvUq73eR3Z9YmlvYV0g_YPsGKBxzakaO4g3lBf1jQsgeWaCKJ4c7lWDNZ0gMzKP7R5yM7KGSerkW2HfshaYz7Wp1hgGD9EfxOk840utFTun-hdU/p.gif"} />
				</Grid>
				<Grid item xs={3}>
					<Paper sx={{ p: [1, 2] }}>
						<Skeleton variant="circular" width={40} height={40} />
						<br />
						<Skeleton variant="rectangular" height={200} />
						<br />
						<Skeleton variant="text" />
						<Skeleton variant="text" />
						<Skeleton variant="text" />
						<Skeleton variant="text" />
					</Paper>
				</Grid>
			</Grid>

			<Paper sx={{ mb: "24px", padding: 2 }}>
				<Grid container
					direction="row"
					justifyContent="center"
					alignItems="flex-start">
					<Stack spacing={2}>
						<Pagination count={11} defaultPage={6} siblingCount={0} boundaryCount={2} variant="outlined" shape="rounded" />
					</Stack>
				</Grid>
			</Paper>
		</Box>
	)
}

export default FilterCards
