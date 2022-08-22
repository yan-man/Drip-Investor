import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Deployment", function () {
    it("Should set the right swapRouter address during deployment", async function () {
      expect(await this.dEXManager.s_swapRouter()).to.be.equal(
        this.mocks.mockISwapRouter.address
      );
      expect(await this.dEXManager.s_tokenIn()).to.be.equal(
        this.mocks.mockUsdc.address
      );
      expect(await this.dEXManager.s_tokenOut()).to.be.equal(
        this.mocks.mockWeth.address
      );
    });
  });

  describe("swap", function () {
    it("Should swap", async function () {
      await expect(this.dEXManager.swap(this.signers[3].address, 100)).to.be.not
        .reverted;
    });
    describe("Events", function () {
      it("Should emit on swap", async function () {
        const _amountIn = 100;
        const _amountOut = 10;
        await this.mocks.mockISwapRouter.mock.exactInputSingle.returns(
          _amountOut
        );
        await expect(this.dEXManager.swap(this.signers[3].address, _amountIn))
          .to.emit(this.dEXManager, `LogSwap`)
          .withArgs(_amountIn, _amountOut);
      });
    });
  });

  // it("Should set the right owner", async function () {});
  // it("Should set the right owner", async function () {});
  // it("Should set the right owner", async function () {});
  // it("Should set the right owner", async function () {});
};
