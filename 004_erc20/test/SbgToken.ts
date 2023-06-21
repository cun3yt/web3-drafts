import { expect } from "chai";
import { ethers } from "hardhat";


describe("SbgToken", function () {
    async function deploymentFixture(supply_=1000000000) {
        const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
        const SbgToken = await ethers.getContractFactory("SbgToken");
        const supply = supply_;
        const sbgToken = await SbgToken.deploy(supply);
        return { sbgToken, owner, otherAccount, thirdAccount };
    }

    describe("Deployment", function () {
        it("Should set the right amount of total supply", async function () {
            const supply = 15;
            const { sbgToken } = await deploymentFixture(supply);
            expect(await sbgToken.totalSupply()).to.equal(supply);  
        });

        it("Should assign the total supply to the owner", async function () {
            const { sbgToken, owner } = await deploymentFixture();
            const supply = 1000000000;
            expect(await sbgToken.balanceOf(owner.address)).to.equal(supply);
        });

        it("Should be able to transfer tokens between accounts", async function () {
            const { sbgToken, owner, otherAccount } = await deploymentFixture();
            const amount = 1;
            await sbgToken.transfer(otherAccount.address, amount);
            expect(await sbgToken.balanceOf(otherAccount.address)).to.equal(amount);
        });

        it("Should have the right remaining balance after transfer", async function () {
            const { sbgToken, owner, otherAccount } = await deploymentFixture();
            const amount = 1;
            await sbgToken.transfer(otherAccount.address, amount);
            expect(await sbgToken.balanceOf(owner.address)).to.equal(999999999);
        });

        it("Should emit a Transfer event when tokens are transferred", async function () {
            const { sbgToken, owner, otherAccount } = await deploymentFixture();
            const amount = 1;
            await expect(sbgToken.transfer(otherAccount.address, amount))
                .to.emit(sbgToken, "Transfer")
                .withArgs(owner.address, otherAccount.address, amount);
        });

        it("Should fail if the sender doesn't have enough tokens", async function () {
            const { sbgToken, owner, otherAccount } = await deploymentFixture();
            const amount = 1000000001;
            await expect(sbgToken.transfer(otherAccount.address, amount)).to.be.revertedWith("Insufficient balance");
        });

        it("Should give the right allowance to spender", async function () {
            const { sbgToken, owner, otherAccount } = await deploymentFixture();
            const amount = 1;
            await sbgToken.approve(otherAccount.address, amount);
            expect(await sbgToken.allowance(owner.address, otherAccount.address)).to.equal(amount);
        });

        it("Should emit an Approval event when allowance is given", async function () {
            const { sbgToken, owner, otherAccount } = await deploymentFixture();
            const amount = 1;
            await expect(sbgToken.approve(otherAccount.address, amount))
                .to.emit(sbgToken, "Approval")
                .withArgs(owner.address, otherAccount.address, amount);
        });

        it("Should still give the right allowance even if the sender doesn't have enough tokens to give allowance", async function () {
            const { sbgToken, owner, otherAccount } = await deploymentFixture();
            const amount = 1000000001;
            await sbgToken.approve(otherAccount.address, amount);
            expect(await sbgToken.allowance(owner.address, otherAccount.address)).to.equal(amount);
        });

        it("Should transfer tokens from one account to another", async function () {
            const { sbgToken, owner, otherAccount, thirdAccount } = await deploymentFixture();
            const allowedAmount = 10;
            const transferAmount = 5;
            await sbgToken.approve(otherAccount.address, allowedAmount);
            await sbgToken.connect(otherAccount).transferFrom(owner, thirdAccount.address, transferAmount);
            expect(await sbgToken.balanceOf(thirdAccount.address)).to.equal(transferAmount);
        });

        it("Should emit a Transfer event when tokens are transferred from one account to another", async function () {
            const { sbgToken, owner, otherAccount, thirdAccount } = await deploymentFixture();
            const amount = 1;
            await sbgToken.approve(otherAccount.address, amount);
            await expect(sbgToken.connect(otherAccount).transferFrom(owner.address, thirdAccount.address, amount))
                .to.emit(sbgToken, "Transfer")
                .withArgs(owner.address, thirdAccount.address, amount);
        });

        it("Should fail if the sender doesn't have enough allowance", async function () {
            const { sbgToken, owner, otherAccount, thirdAccount } = await deploymentFixture();
            const amount = 1;
            await expect(sbgToken.connect(otherAccount).transferFrom(owner.address, thirdAccount.address, amount)).to.be.revertedWith("Insufficient allowance");
        });

        it("Should fail if the allowed party tries transfers more than sender has", async function () {
            const { sbgToken, owner, otherAccount, thirdAccount } = await deploymentFixture(10);
            await sbgToken.approve(otherAccount.address, 30);
            await expect(sbgToken.connect(otherAccount).transferFrom(owner.address, thirdAccount.address, 20)).to.be.revertedWith("Insufficient balance");
        });
    });
});
