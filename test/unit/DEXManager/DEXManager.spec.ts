import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Deployment", function () {
    it("Should set the right swapRouter address during deployment", async function () {
      expect(await this.dEXManager.s_swapRouter()).to.be.equal(
        this.mocks.mockISwapRouter.address
      );
    });
  });
  describe("setTokenIn", function () {
    it("Should set tokenIn address", async function () {
      await expect(this.dEXManager.setTokenIn(this.mocks.mockUsdc.address)).to
        .be.not.reverted;
    });
    describe("Events", function () {
      it("Should emit when tokenIn is set", async function () {
        await expect(this.dEXManager.setTokenIn(this.mocks.mockUsdc.address))
          .to.emit(this.dEXManager, `LogSetTokenIn`)
          .withArgs(this.mocks.mockUsdc.address);
      });
    });
  });

  // it("Should set the right owner", async function () {});
  // it("Should set the right owner", async function () {});
  // it("Should set the right owner", async function () {});
  // it("Should set the right owner", async function () {});
};
