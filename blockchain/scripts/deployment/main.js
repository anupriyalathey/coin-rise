// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { network, run } = require("hardhat")

const { deployCampaignManager } = require("./deployCampaignManager")
const { deployCampaignFactory } = require("./deployFactory")
const { deployCampaign } = require("./deployCampaign")

async function main() {
    await run("compile")
    const chainId = network.config.chainId

    //TODO: Adding deploy scripts
    await deployCampaign(chainId)
    await deployCampaignFactory(chainId)
    await deployCampaignManager(chainId)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
