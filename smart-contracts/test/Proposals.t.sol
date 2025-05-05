// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Test, console} from "forge-std/Test.sol";
import {Proposals} from "../src/Proposals.sol";
import {IProposals} from "../src/Interfaces/IProposals.sol";

contract ProposalsTest is Test {
    Proposals public proposalsContract;
    address public constant USER_A = address(0x1);
    address public constant USER_B = address(0x2);

    function setUp() public {
        proposalsContract = new Proposals();
    }

    function testCreateProposalSuccess() public {
        string memory title = "Test Title";
        string memory description = "Test Description";

        vm.expectEmit(true, true, true, true);
        emit IProposals.ProposalCreated(USER_A, 0, title, description); // Expect event from USER_A with proposal index 0

        vm.prank(USER_A);
        proposalsContract.createProposal(title, description);

        IProposals.Proposal[] memory userAProposals = proposalsContract.getProposalsByAddress(USER_A);
        assertEq(userAProposals.length, 1, "User A should have 1 proposal");
        assertEq(userAProposals[0].title, title, "Proposal title mismatch");
        assertEq(userAProposals[0].description, description, "Proposal description mismatch");
        assertEq(proposalsContract.getTotalProposalCount(), 1, "Total proposal count should be 1");

        // Check all proposals array
        IProposals.Proposal[] memory allProposalsAfterA = proposalsContract.getAllProposals();
        assertEq(allProposalsAfterA.length, 1, "All proposals array should have 1 proposal after A");
        assertEq(allProposalsAfterA[0].title, title, "All proposals[0] title mismatch");

        // Create another proposal from a different user
        string memory titleB = "Title B";
        string memory descriptionB = "Description B";

        vm.expectEmit(true, true, true, true);
        emit IProposals.ProposalCreated(USER_B, 1, titleB, descriptionB); // Expect event from USER_B with proposal index 1

        vm.prank(USER_B);
        proposalsContract.createProposal(titleB, descriptionB);

        IProposals.Proposal[] memory userBProposals = proposalsContract.getProposalsByAddress(USER_B);
        assertEq(userBProposals.length, 1, "User B should have 1 proposal");
        assertEq(proposalsContract.getTotalProposalCount(), 2, "Total proposal count should be 2");

        // Check all proposals array again
        IProposals.Proposal[] memory allProposalsAfterB = proposalsContract.getAllProposals();
        assertEq(allProposalsAfterB.length, 2, "All proposals array should have 2 proposals after B");
        assertEq(allProposalsAfterB[0].title, title, "All proposals[0] title mismatch after B"); // Check first proposal
        assertEq(allProposalsAfterB[1].title, titleB, "All proposals[1] title mismatch after B"); // Check second proposal

        // Check User A proposals again
        userAProposals = proposalsContract.getProposalsByAddress(USER_A);
        assertEq(userAProposals.length, 1, "User A should still have 1 proposal");
    }

    function test_RevertIf_CreateProposal_TitleTooLong() public {
        string memory longTitle = "This title is definitely longer than thirty characters limit";
        string memory description = "Valid Description";
        uint256 expectedLength = bytes(longTitle).length;

        vm.expectRevert(abi.encodeWithSelector(IProposals.TitleTooLong.selector, expectedLength));
        vm.prank(USER_A);
        proposalsContract.createProposal(longTitle, description);
    }

    function test_RevertIf_CreateProposal_DescriptionTooLong() public {
        string memory title = "Valid Title";
        string memory longDescription = new string(501); // Create a string longer than 500 bytes
        uint256 expectedLength = bytes(longDescription).length;

        vm.expectRevert(abi.encodeWithSelector(IProposals.DescriptionTooLong.selector, expectedLength));
        vm.prank(USER_A);
        proposalsContract.createProposal(title, longDescription);
    }

    function test_RevertIf_CreateProposal_TitleEmpty() public {
        string memory title = "";
        string memory description = "Valid Description";

        vm.expectRevert(IProposals.TitleCannotBeEmpty.selector);
        vm.prank(USER_A);
        proposalsContract.createProposal(title, description);
    }

    function test_RevertIf_CreateProposal_DescriptionEmpty() public {
        string memory title = "Valid Title";
        string memory description = "";

        vm.expectRevert(IProposals.DescriptionCannotBeEmpty.selector);
        vm.prank(USER_A);
        proposalsContract.createProposal(title, description);
    }

    function testGetProposalsByAddressEmpty() public view {
        IProposals.Proposal[] memory userAProposals = proposalsContract.getProposalsByAddress(USER_A);
        assertEq(userAProposals.length, 0, "User A should have 0 proposals initially");
    }

    function testGetTotalProposalCountEmpty() public view {
        assertEq(proposalsContract.getTotalProposalCount(), 0, "Total proposal count should be 0 initially");
    }

    function testGetAllProposalsEmpty() public view {
        IProposals.Proposal[] memory allProposals = proposalsContract.getAllProposals();
        assertEq(allProposals.length, 0, "All proposals array should be empty initially");
    }
}