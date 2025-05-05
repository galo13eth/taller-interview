// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {IProposals} from "./Interfaces/IProposals.sol";

contract Proposals is IProposals {

    // Store proposals per user address
    mapping(address => Proposal[]) public userProposals;
    Proposal[] public allProposals;

    uint256 public totalProposalCount;

    function createProposal(string memory _title, string memory _description) public {
        bytes memory titleBytes = bytes(_title);
        if (titleBytes.length == 0) {
            revert TitleCannotBeEmpty();
        }
        if (titleBytes.length > 30) {
            revert TitleTooLong(titleBytes.length);
        }

        bytes memory descriptionBytes = bytes(_description);
        if (descriptionBytes.length == 0) {
            revert DescriptionCannotBeEmpty();
        }
        if (descriptionBytes.length > 500) {
            revert DescriptionTooLong(descriptionBytes.length);
        }

        Proposal memory newProposal = Proposal({
            title: _title,
            description: _description
        });

        userProposals[msg.sender].push(newProposal);
        allProposals.push(newProposal);

        emit ProposalCreated(msg.sender, totalProposalCount, _title, _description);
        totalProposalCount++;
    }

    // Function to get all proposals submitted by a specific user
    function getProposalsByAddress(address _user) public view returns (Proposal[] memory) {
        return userProposals[_user];
    }

    // Function to get the total number of proposals across all users
    function getTotalProposalCount() public view returns (uint256) {
        return totalProposalCount;
    }

    // Function to get all proposals across all users
    function getAllProposals() public view returns (Proposal[] memory) {
        return allProposals;
    }
}
