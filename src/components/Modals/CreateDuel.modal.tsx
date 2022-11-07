import {
  Box,
  Card,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  FormControl,
  Select,
  SelectChangeEvent,
  InputBase,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { duelState } from "../../reducers/duel.reducer";
import { legionState } from "../../reducers/legion.reducer";
import { inventoryState } from "../../reducers/inventory.reducer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { AppSelector } from "../../store";
import {
  useWeb3,
  useDuelSystem,
  useFeeHandler,
  useLegion,
} from "../../web3hooks/useContract";
import { ILegion, IDivision } from "../../types";
import { getTranslation } from "../../utils/utils";
import OrgMenuItem from "../../components/UI/OrgMenuItem";
import GreenMenuItem from "../../components/UI/GreenMenuItem";
import RedMenuItem from "../../components/UI/RedMenuItem";
import FireBtn from "../Buttons/FireBtn";
import {
  createDuel,
  doingDuels,
} from "../../web3hooks/contractFunctions/duel.contract";
import { getBLSTAmount } from "../../web3hooks/contractFunctions/feehandler.contract";
import {
  confirmUnclaimedWallet,
  getAllDuelsAct,
} from "../../services/duel.service";

const PriceTextField = styled(TextField)({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },

  "& input.MuiInput-input": {
    paddingTop: "0px",
    paddingBottom: "0px",
    textAlign: "center",
    MozAppearance: "TextField",
  },
});

const LegionSelectInput = styled(InputBase)(({ theme }) => ({
  ".MuiSelect-select": {
    paddingBottom: "5px",
    textAlign: "right",
    border: "1px solid #ced4da",
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #ced4da",
    fontSize: 16,
    paddingLeft: 10,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

const CreateDuelModal: React.FC = () => {
  const dispatch = useDispatch();
  const { allLegions } = AppSelector(legionState);
  const { divisions } = AppSelector(duelState);
  const { BLSTToUSD } = AppSelector(inventoryState);
  const { createDuelModalOpen } = AppSelector(modalState);
  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contract
  const duelContract = useDuelSystem();
  const feeHandlerContract = useFeeHandler();
  const legionContract = useLegion();

  const [allIn, setAllIn] = useState(false);
  const [estimatePrice, setEstimatePrice] = useState(0);
  const [currentLegionIndex, setCurrentLegionIndex] = useState<number>(0);
  const [divisionIndex, setDivisionIndex] = useState(0);
  const [createDuelLoading, setCreateDuelLoading] = useState<boolean>(false);
  const [legionsDuelStatus, setLegionsDuelStatus] = useState<boolean[]>([]);
  const [blstAmount, setBlstAmount] = useState<number>(0);
  const [blstAmountWin, setBlstAmountWin] = useState<number>(0);

  useEffect(() => {
    setBlstAmountForDuel();
  }, [divisionIndex]);

  useEffect(() => {
    setEstimatePrice(0);
    if (allLegions.length != 0) {
      getBalance();
      divisions.map((division: IDivision, index: Number) => {
        if (
          allLegions[0].attackPower >= division.minAP &&
          allLegions[0].attackPower < division.maxAP
        ) {
          setDivisionIndex(index.valueOf());
        }
      });
      setCurrentLegionIndex(0);
    }
  }, [allLegions, createDuelModalOpen]);

  const setBlstAmountForDuel = async () => {
    try {
      const blstAmountTemp = await getBLSTAmount(
        web3,
        feeHandlerContract,
        divisions[divisionIndex].betPrice
      );
      setBlstAmount(blstAmountTemp);
      const blstAmountWinTemp = await getBLSTAmount(
        web3,
        feeHandlerContract,
        2 * divisions[divisionIndex].betPrice.valueOf() * 0.8
      );
      setBlstAmountWin(blstAmountWinTemp);
    } catch (e) {
      console.log(e);
    }
  };
  const getBalance = async () => {
    var legionsDueStatusTemp: boolean[] = [];
    for (let i = 0; i < allLegions.length; i++) {
      const legion = allLegions[i];
      const res = await doingDuels(duelContract, legion.id);
      legionsDueStatusTemp.push(res);
    }
    setLegionsDuelStatus(legionsDueStatusTemp);
  };

  const handleSelectLegion = (e: SelectChangeEvent) => {
    const legionIndex = parseInt(e.target.value);
    setCurrentLegionIndex(legionIndex);
    divisions.map((division: IDivision, index: Number) => {
      if (
        allLegions[legionIndex].attackPower >= division.minAP &&
        allLegions[legionIndex].attackPower < division.maxAP
      ) {
        setDivisionIndex(index.valueOf());
      }
    });
  };

  const handleAllInCheck = () => {
    if (!allIn) {
      Swal.fire({
        title: "Warning",
        text: "Are you sure you want to go All-In with your Cyber? \nIf you lose this bet, then you will lose all the Attack Power of your Cyber and your Cyber will not be able to hunt anymore.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f66810",
        cancelButtonColor: "#d33",
        confirmButtonText: "Go All-In",
        background: "#111",
        color: "white",
      }).then((result) => {
        if (result.isConfirmed) {
          setAllIn(!allIn);
        }
      });
    } else {
      setAllIn(!allIn);
    }
  };

  const handleChangeEstimatePrice = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const price = parseFloat(e.target.value);
    if (price > 10000 || price * 10000 - Math.floor(price * 10000) > 0) {
      setEstimatePrice(estimatePrice);
      return;
    }
    setEstimatePrice(price);
  };

  const handleClose = () => {
    dispatch(updateModalState({ createDuelModalOpen: false }));
  };

  const handleSubmit = async () => {
    if (estimatePrice.valueOf() < 0) {
      toast.error(getTranslation("pleaseprovidevalidvalue"));
      return;
    }
    if (!confirmUnclaimedWallet(divisions[divisionIndex].betPrice)) {
      const blstAmount = await getBLSTAmount(
        web3,
        feeHandlerContract,
        divisions[divisionIndex].betPrice
      );
      toast.error(
        getTranslation("toCreateThisDuelYouNeedToHaveAtLeastBLSTInYourUnClaimedWallet", {
          CL1: Math.round(blstAmount)
        })
      );
      return;
    }
    try {
      setCreateDuelLoading(true);
      const res = await createDuel(
        duelContract,
        account,
        allLegions[currentLegionIndex].id.valueOf(),
        estimatePrice.valueOf() * 10 ** 18,
        !allIn.valueOf()
      );
      setCreateDuelLoading(false);
      dispatch(updateModalState({ createDuelModalOpen: false }));
      toast.success("yourduelhasbeencreated");
      getAllDuelsAct(dispatch, duelContract, legionContract);
    } catch (error) {
      setCreateDuelLoading(false);
    }
  };

  return (
    <Dialog open={createDuelModalOpen.valueOf()} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
          }}
        >
          {getTranslation("createduel")}
        </Typography>
        <FaTimes
          style={{
            cursor: "pointer",
            fontSize: "1.8em",
          }}
          onClick={handleClose}
        />
      </DialogTitle>
      <DialogContent dividers>
        <Typography>
          {getTranslation(
            "whatDoYouThinkTheCryptoPriceInBUSDWillBeInExactly24HoursFromNow"
          )}
        </Typography>
        <Typography>
          {getTranslation("currenty1cryptois", {
            CL1: Math.round(BLSTToUSD.valueOf() * 10000) / 100,
          })}
        </Typography>
        <Box
          sx={{
            padding: "20px",
            fontSize: "1.2em",
            fontWeight: "bold",
          }}
        >
          <a
            href="https://coinmarketcap.com/dexscan/bsc/0x13fade99f5d7038cd53261770d80902c8756adae"
            target="_blank"
            style={{ color: "#0df8f9", textDecoration: "none" }}
          >
            {getTranslation("seepricechart")}
          </a>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            {getTranslation("selectyourlegion")}:
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <FormControl>
              <Select
                id="hunt-legion-select"
                value={currentLegionIndex.toString()}
                onChange={handleSelectLegion}
                input={<LegionSelectInput />}
              >
                {allLegions.length != 0 ? (
                  allLegions.map((legion: ILegion, index: number) =>
                    legionsDuelStatus[index] ? (
                      <OrgMenuItem value={index} key={index}>
                        {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                      </OrgMenuItem>
                    ) : legion.attackPower.valueOf() >= 10000 &&
                      legion.attackPower < 70000 ? (
                      <GreenMenuItem value={index} key={index}>
                        {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                      </GreenMenuItem>
                    ) : (
                      <RedMenuItem value={index} key={index}>
                        {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                      </RedMenuItem>
                    )
                  )
                ) : (
                  <></>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {allLegions.length != 0 && legionsDuelStatus[currentLegionIndex] && (
          <Typography mt={1} mb={1}>
            {getTranslation("yourlegionisinthemidstofaduel")}
          </Typography>
        )}
        {allLegions.length != 0 &&
          !legionsDuelStatus[currentLegionIndex] &&
          allLegions[currentLegionIndex].attackPower.valueOf() >= 10000 &&
          allLegions[currentLegionIndex].attackPower.valueOf() <= 70000 && (
            <Typography mt={1} mb={1}>
              {getTranslation("yourlegiondivision")} :{" "}
              {divisions[divisionIndex].minAP.valueOf() / 1000}K -{" "}
              {divisions[divisionIndex].maxAP.valueOf() / 1000}K AP{" "}
            </Typography>
          )}
        {allLegions.length != 0 &&
          !legionsDuelStatus[currentLegionIndex] &&
          allLegions[currentLegionIndex].attackPower.valueOf() >= 10000 &&
          allLegions[currentLegionIndex].attackPower.valueOf() <= 70000 && (
            <>
              <Typography mb={1}>
                {getTranslation("youwillbet")} :{" "}
                {divisions[divisionIndex].betPrice} BUSD ( ={" "}
                {Math.round(blstAmount * 100) / 100} $BLST)
              </Typography>
            </>
          )}
        {allLegions.length != 0 &&
          !legionsDuelStatus[currentLegionIndex] &&
          allLegions[currentLegionIndex].attackPower.valueOf() >= 10000 &&
          allLegions[currentLegionIndex].attackPower.valueOf() <= 70000 &&
          allIn && (
            <Typography mb={1}>
              {getTranslation("youmightloseupto", {
                CL1 : allLegions[currentLegionIndex].attackPower
              })}
            </Typography>
          )}
        {allLegions.length != 0 &&
          !legionsDuelStatus[currentLegionIndex] &&
          allLegions[currentLegionIndex].attackPower.valueOf() >= 10000 &&
          allLegions[currentLegionIndex].attackPower.valueOf() <= 70000 &&
          !allIn && (
            <Typography mb={1}>
              {getTranslation("youmightloseupto", {
                CL1: Math.round(divisions[divisionIndex].maxAP.valueOf() / 10)
              })}
            </Typography>
          )}
        {allLegions.length != 0 &&
          !legionsDuelStatus[currentLegionIndex] &&
          allLegions[currentLegionIndex].attackPower.valueOf() >= 10000 &&
          allLegions[currentLegionIndex].attackPower.valueOf() <= 70000 && (
            <>
              <Typography mb={1}>
                {getTranslation("youmightwin")}:{" "}
                {2 * divisions[divisionIndex].betPrice.valueOf() * 0.8} BUSD ( ={" "}
                {Math.round(blstAmountWin * 100) / 100} $CRYPTO)
              </Typography>
              <Typography mb={1}>
                {getTranslation("toCreateThisDuelYouMustBetBUSDFromYourUnclaimedWallet", {
                  CL1: divisions[divisionIndex].betPrice.valueOf()
                })}
              </Typography>
            </>
          )}
        {allLegions.length != 0 &&
          !legionsDuelStatus[currentLegionIndex] &&
          allLegions[currentLegionIndex].attackPower.valueOf() >= 10000 &&
          allLegions[currentLegionIndex].attackPower.valueOf() <= 70000 && (
            <>
              <Grid container mb={1} spacing={1}>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  md={5}
                  lg={5}
                  sx={{ fontWeight: "bold" }}
                >
                  {getTranslation("ithink1blstwillbe")}{" "}
                </Grid>
                <Grid item xs={6} sm={2} md={2} lg={2}>
                  <PriceTextField
                    id="outlined-number"
                    variant="standard"
                    type="number"
                    value={estimatePrice}
                    onChange={handleChangeEstimatePrice}
                    sx={{ padding: "0 !important" }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sm={2}
                  md={2}
                  lg={1}
                  sx={{ fontWeight: "bold" }}
                >
                  BUSD
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <FireBtn
                  sx={{ width: "100px" }}
                  onClick={handleSubmit}
                  loading={createDuelLoading}
                >
                  {getTranslation("bet")}
                </FireBtn>
              </Box>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allIn}
                      onChange={handleAllInCheck}
                      defaultChecked
                    />
                  }
                  label="All-In"
                />
              </FormGroup>
            </>
          )}
        {allLegions.length != 0 &&
          !legionsDuelStatus[currentLegionIndex] &&
          (allLegions[currentLegionIndex].attackPower.valueOf() < 10000 ||
            allLegions[currentLegionIndex].attackPower.valueOf() >= 70000) && (
            <Typography mt={1} mb={1}>
              {getTranslation("yourlegionattackpoweristoohighorlow")}
            </Typography>
          )}
      </DialogContent>
    </Dialog>
  );
};
export default CreateDuelModal;
