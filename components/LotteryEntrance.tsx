import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { ContractAddressInterface } from "../interfaces/ContractAddressInterface";
import { ethers, ContractTransaction, BigNumber } from "ethers";
import { Bell, useNotification } from "web3uikit";

const LotteryEntrance = () => {
  const dispatch = useNotification();
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId: string = parseInt(chainIdHex!).toString();
  const addresses: ContractAddressInterface = contractAddresses;
  const raffleAddress =
    chainId in contractAddresses ? addresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getRecentWinner",
    params: {},
  });

  const updateUI = async () => {
    const entranceFeeFromCall = (
      (await getEntranceFee({
        onError: (error) => console.log(error),
      })) as BigNumber
    ).toString();

    const numPlayersFromCall = (
      (await getNumberOfPlayers({
        onError: (error) => console.log(error),
      })) as BigNumber
    ).toString();

    const recentWinnerFromCall = (await getRecentWinner()) as string;

    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  };

  useEffect(() => {});

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const enterRaffleClickHandler = async () => {
    await enterRaffle({
      onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
      onError: (error) => console.log(error),
    });
  };

  const handleSuccess = async (tx: ContractTransaction) => {
    await tx.wait(1);
    handleNewNotification();
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: <Bell />,
    });
  };

  return (
    <div className="p-5">
      Hi from lottery entrance!
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={enterRaffleClickHandler}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>Entrance Fee: {ethers.utils.formatEther(entranceFee)} ETH</div>
          <div>Players: {numPlayers}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle Address Detected!</div>
      )}
    </div>
  );
};

export default LotteryEntrance;
