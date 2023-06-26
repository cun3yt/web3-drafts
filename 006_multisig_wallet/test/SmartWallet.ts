import { 
    loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SmartWallet", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploySmartWalletFixture() {
        const [firstAccount, secondAccount, thirdAccount, forthAccount] = await ethers.getSigners();

        const SmartWallet = await ethers.getContractFactory("SmartWallet");

        // deploy with 3 owners and 2 required confirmations
        const smartWallet = await SmartWallet.deploy([firstAccount.address, secondAccount.address, thirdAccount.address], 2);
    
        return { smartWallet, firstAccount, secondAccount, thirdAccount, forthAccount };
    }
    
    describe("Deployment", function () {
        it("Should set the signers and threshold right", async function () {
            const { smartWallet, firstAccount, secondAccount, thirdAccount, forthAccount } = await loadFixture(deploySmartWalletFixture);
        
            expect(await smartWallet.signers(firstAccount.address)).to.equal(true);
            expect(await smartWallet.signers(secondAccount.address)).to.equal(true);
            expect(await smartWallet.signers(thirdAccount.address)).to.equal(true);
            expect(await smartWallet.signers(forthAccount.address)).to.equal(false);
            expect(await smartWallet.n()).to.equal(2);
        });

        it("Should fail if the threshold is greater than the number of signers", async function () {
            const SmartWallet = await ethers.getContractFactory("SmartWallet");
            const [firstAccount] = await ethers.getSigners(); 
            await expect(SmartWallet.deploy([firstAccount], 2)).to.be.revertedWith(
                "Not enough signers"
            );
        });

        it("Should fail if the threshold is zero", async function () {
            const SmartWallet = await ethers.getContractFactory("SmartWallet");
            const [firstAccount] = await ethers.getSigners(); 
            await expect(SmartWallet.deploy([firstAccount], 0)).to.be.revertedWith(
                "n must be greater than zero"
            );
        });

        it("Should let anyone contribute", async function () {
            const { smartWallet, firstAccount, secondAccount, forthAccount } = await loadFixture(deploySmartWalletFixture);
            
            await smartWallet.contribute({ value: 1 });
            expect(await ethers.provider.getBalance(smartWallet)).to.equal(1);
            
            await smartWallet.connect(secondAccount).contribute({ value: 2 });
            expect(await ethers.provider.getBalance(smartWallet)).to.equal(3);

            await smartWallet.connect(forthAccount).contribute({ value: 3, from: forthAccount.address });
            expect(await ethers.provider.getBalance(smartWallet)).to.equal(6);
        });

        it("Should let any signer suggest a tx", async function () {
            const { smartWallet, firstAccount, secondAccount, forthAccount } = await loadFixture(deploySmartWalletFixture);
            
            await smartWallet.connect(firstAccount).suggestTx(forthAccount.address, 5, "first tx");
            
            // Get the suggested transactions array from the contract
            let suggestedTxs = await smartWallet.waitingTxs();

            // Assert the length of the array
            expect(suggestedTxs.length).to.equal(1);
            
            await smartWallet.connect(secondAccount).suggestTx(secondAccount.address, 2, "second tx");
            suggestedTxs = await smartWallet.waitingTxs();
            expect(suggestedTxs.length).to.equal(2);

            expect(suggestedTxs[0].to).to.equal(forthAccount.address);
            expect(suggestedTxs[0].memo).to.equal("first tx");
            expect(suggestedTxs[0].signerNumber).to.equal(1);
            expect(suggestedTxs[0].value).to.equal(5);

            expect(suggestedTxs[1].to).to.equal(secondAccount.address);
            expect(suggestedTxs[1].memo).to.equal("second tx");
            expect(suggestedTxs[1].signerNumber).to.equal(1);
            expect(suggestedTxs[1].value).to.equal(2);
        });

        it("Should not let non-signer suggest a tx", async function () {
            const { smartWallet, forthAccount } = await loadFixture(deploySmartWalletFixture);
            
            await expect(smartWallet.connect(forthAccount).suggestTx(forthAccount.address, 5, "first tx")).to.be.revertedWith(
                "You are not a signer"
            );
        });

        it("Should execute a tx if enough signers approve it", async function () {
            const { smartWallet, firstAccount, secondAccount, forthAccount } = await loadFixture(deploySmartWalletFixture);
            
            await smartWallet.contribute({ value: 10 });
            await smartWallet.suggestTx(forthAccount.address, 3, "first tx");

            expect(await ethers.provider.getBalance(smartWallet)).to.equal(10);

            await smartWallet.connect(secondAccount).sign(0);

            expect(await ethers.provider.getBalance(smartWallet)).to.equal(7);
        });
    });
});
