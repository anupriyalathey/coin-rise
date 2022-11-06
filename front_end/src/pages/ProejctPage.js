import React, { useState, useEffect } from "react";
import StepperIcon from "../assets/StepperIcon.svg";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Inputs from "../components/Ui";
import Card from "../components/Card/Card";
import { Link } from "react-router-dom";
import { ethers, BigNumber } from "ethers";
import {
  storeFiles,
  makeFileObjects,
  retrieveFiles,
  loadData,
} from "../components/Storage";
import CampaignAbi from "../artifacts/contracts/Campaign.sol/Campaign.json";
import CampaignFactoryAbi from "../artifacts/contracts/CampaignFactory.sol/CampaignFactory.json";

const FactoryAddress = "0xd98458e022ac999a547D49f9da37DCc6F4d1f19F";
const campaignAddress = "0x3A7A5176Caf503dEb19d06fcDE845B9D6DD01B10";
const ProejctPage = () => {
  const getDeployedCampaignContracts = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          FactoryAddress,
          CampaignFactoryAbi.abi,
          signer
        );

        let campaignList = await contract.getDeployedCampaignContracts();
        const stylesMining = ["color: black", "background: yellow"].join(";");
        console.log(
          "%c Deployed Campaign Contracts addresses =  %s",
          stylesMining,
          campaignList
        );
        return campaignList;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * Get the IPFS CID of a Campaign
   */
  const getCampaignURI = async (campaignaddress) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          campaignaddress,
          CampaignAbi.abi,
          signer
        );

        let cid = await contract.getCampaignURI();
        const stylesMining = ["color: black", "background: yellow"].join(";");
        console.log("%c campaign IPFS CID =  %s", stylesMining, cid);
        return cid;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const retrieveData = async (cid) => {
    const files = await retrieveFiles(cid);
    const content = await loadData(files[0].cid);
    return content;
  };
  const [campaigns, setCampaigns] = useState([]);
  console.log(campaigns, "campaigns");
  const makeObj = async (campaignList) => {
    let campaignObj = [];
    for (let i = 11; i < campaignList.length; i++) {
      let cid_i = await getCampaignURI(campaignList[i]);
      let content = await retrieveData(cid_i);
      content.address = campaignList[i];
      campaignObj.push(content);
    }
    return campaignObj;
  };
  useEffect(() => {
    const test = async (cid) => {
      let campaignList = await getDeployedCampaignContracts();
      const campaignObj = await makeObj(campaignList);
      setCampaigns(campaignObj);
      // console.log("obj", campaignObj);
    };
    test();
  }, []);

  const data = [1, 2, 3, 4];
  const AllComapain = [{}, {}, {}];
  const [text, setText] = useState("");

  return (
    <div style={{ marginLeft: "8rem", marginTop: "2rem" }}>
      <Inputs
        type="text"
        width={400}
        onChange={(e) => setText(e.target.value)}
      />
      <Box display="flex" flexWrap="wrap">
        {campaigns
          ?.filter((el) => el?.campaignName?.toString().includes(text))
          .map((el) => (
            <Link
              to={`/project/${el?.address}`}
              style={{
                textDecoration: "none",
                color: "black",
                cursor: "pointer",
              }}
            >
              <Card {...el} />
            </Link>
          ))}
      </Box>
    </div>
  );
};

export default ProejctPage;