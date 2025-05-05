// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script, console} from "forge-std/Script.sol";
import {Proposals} from "../src/Proposals.sol";

contract DeployProposals is Script {
    function setUp() public {}

    function run() public returns (Proposals) {
        vm.startBroadcast();

        Proposals proposals = new Proposals();
        console.log("Proposals contract deployed at:", address(proposals));

        vm.stopBroadcast();
        return proposals;
    }
}