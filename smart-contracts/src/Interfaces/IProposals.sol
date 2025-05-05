// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

interface IProposals {
    // STRUCTS
    struct Proposal {
        string title;
        string description;
    }

    // ERRORS
    error TitleTooLong(uint256 length);
    error DescriptionTooLong(uint256 length);
    error TitleCannotBeEmpty();
    error DescriptionCannotBeEmpty();

    // EVENTS
    event ProposalCreated(
        address indexed proposer,
        uint256 proposalNumber,
        string title,
        string description
    );

    // FUNCTIONS
    function createProposal(string memory _title, string memory _description) external;
    function getProposalsByAddress(address _user) external view returns (Proposal[] memory);
    function getTotalProposalCount() external view returns (uint256);
    function getAllProposals() external view returns (Proposal[] memory);
}
