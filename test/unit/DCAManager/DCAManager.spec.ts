import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Mocks, Signers } from "../../shared/types";

export const UnitTest = (): void => {
  describe("Deployment", function () {
    describe("State variables/Owner privileges", function () {
      it("Should set the right owner", async function () {
        expect(await this.dCAManager.owner()).to.equal(this.signers[0].address);
      });
      it("Should not allow non-owner to set children contract addresses", async function () {
        await expect(
          this.dCAManager
            .connect(this.signers[2])
            .setContractAddress(0, this.dCAManager.address)
        ).to.be.reverted;
      });
      it("Should allow owner to set children contract addresses", async function () {
        const testAddr = this.dCAManager.address; // dummy address
        await expect(
          this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(0, testAddr)
        ).to.not.be.reverted;
        expect(await this.dCAManager.s_contractsLookup(0)).to.be.equal(
          testAddr
        );
      });
      it("Should allow owner to set children contract addresses", async function () {
        const testAddr = this.dCAManager.address; // dummy address
        await expect(
          this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(3, testAddr)
        ).to.not.be.reverted;
        expect(await this.dCAManager.s_contractsLookup(3)).to.be.equal(
          testAddr
        );
      });
      it("Should allow owner to set children contract addresses", async function () {
        const testAddr = this.dCAManager.address; // dummy address
        await expect(
          this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(4, testAddr)
        ).to.not.be.reverted;
        expect(await this.dCAManager.s_contractsLookup(4)).to.be.equal(
          testAddr
        );
      });
      it("Should set flag to true when all child contracts are initialized", async function () {
        const testAddr = this.dCAManager.address; // dummy address
        for (let i = 0; i < 4; i++) {
          await this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(i, testAddr);
        }
        expect(await this.dCAManager.s_isInitialized()).to.be.equal(true);
      });
      it("Should revert if owner tries to set children contract address as 0", async function () {
        const testAddr = ethers.constants.AddressZero; // dummy address
        await expect(
          this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(0, testAddr)
        ).to.be.reverted;
      });
      it("Should revert if safeTransferFrom is unsuccessful", async function () {});
      describe("Events", function () {
        it("Should emit event when a core contract address is updated", async function () {
          await expect(
            this.dCAManager
              .connect(this.signers[0])
              .setContractAddress(0, this.dCAManager.address)
          ).to.emit(this.dCAManager, "LogContractAddrSet");
        });
      });
    });
  });

  describe("Creating a DCA Job", function () {
    it("Should revert if attempt to create a DCA job but core contract values are not set", async function () {
      await expect(
        this.dCAManager.connect(this.signers[0]).createDCAJob(100, 10, [0])
      ).to.be.reverted;
    });
    describe("...after all core contracts initialized", function () {
      beforeEach(
        `Initialize all core contracts with dummy vars`,
        async function () {
          const testAddr = this.dCAManager.address; // dummy address
          for (let i = 0; i < 5; i++) {
            await this.dCAManager
              .connect(this.signers[0])
              .setContractAddress(i, testAddr);
          }
        }
      );
      it("Should revert if no tokens are sent/user has insufficient tokens", async function () {
        await this.mocks.mockUsdc.mock.transferFrom.returns(true);
        await this.mocks.mockUsdc.mock.balanceOf.returns(0);
        await expect(
          this.dCAManager.connect(this.signers[0]).createDCAJob(100, 10, [1, 2])
        ).to.be.revertedWithCustomError(
          this.dCAManager,
          `DCAManager__InsufficientFunds`
        );
      });
      it("Should revert if user has funds but token transfer not approved first", async function () {
        await this.mocks.mockUsdc.mock.balanceOf.returns(100);
        await this.mocks.mockUsdc.mock.transferFrom.returns(false);
        await expect(
          this.dCAManager.connect(this.signers[0]).createDCAJob(100, 10, [1, 2])
        ).to.be.revertedWithCustomError(
          this.dCAManager,
          `DCAManager__TransferError`
        );
      });
      it("Should revert if user has insufficient funds", async function () {
        await this.mocks.mockUsdc.mock.transferFrom.returns(false);
        await this.mocks.mockUsdc.mock.balanceOf.returns(100);

        await expect(
          this.dCAManager
            .connect(this.signers[0])
            .createDCAJob(100, 200, [1, 2])
        ).to.be.revertedWithCustomError(
          this.dCAManager,
          `DCAManager__InvalidInvestment`
        );
      });
      // it("Should revert if invalid tokens are sent with request", async function () {});
      it("Should create DCA job if validation successful", async function () {
        const _mockJobId = 2;
        const _depositAmount = 100;

        // set up mocks
        await this.mocks.mockUsdc.mock.balanceOf.returns(_depositAmount);
        await this.mocks.mockUsdc.mock.transferFrom.returns(true);
        await this.mocks.mockJobManager.mock.create.returns(_mockJobId);

        // set JobManager contract address to mock
        await this.dCAManager
          .connect(this.signers[0])
          .setContractAddress(0, this.mocks.mockJobManager.address);
        await this.dCAManager
          .connect(this.signers[0])
          .setContractAddress(2, this.mocks.mockTradeManager.address);

        // create DCA job
        const tx = await this.dCAManager
          .connect(this.signers[0])
          .createDCAJob(_depositAmount, _depositAmount / 10, [0, 0]);
        await tx.wait();
        expect(
          await this.dCAManager
            .connect(this.signers[0])
            .s_userJobs(this.signers[0].address, _mockJobId)
        ).to.be.equal(_depositAmount);
      });

      describe("Cancel a DCA Job", function () {
        beforeEach(`...save 1st DCA job`, async function () {
          this._mockJobId = 2;

          // set up mocks
          await this.mocks.mockUsdc.mock.balanceOf.returns(1000);
          await this.mocks.mockUsdc.mock.transferFrom.returns(true);
          await this.mocks.mockJobManager.mock.create.returns(this._mockJobId);

          // set JobManager contract address to mock
          await this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(0, this.mocks.mockJobManager.address);
          await this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(2, this.mocks.mockTradeManager.address);

          // create DCA job
          this._depositAmount = 100;
          const tx = await this.dCAManager
            .connect(this.signers[1])
            .createDCAJob(
              this._depositAmount,
              this._depositAmount / 10,
              [0, 0]
            );
          await tx.wait();
        });
        it("Should add to existing deposit amount if 2nd job created", async function () {
          const _depositAmount = 200;
          const _mockJobId = 3;
          await this.mocks.mockJobManager.mock.create.returns(_mockJobId);
          const tx = await this.dCAManager
            .connect(this.signers[1])
            .createDCAJob(_depositAmount, this._depositAmount / 10, [0, 0]);
          await tx.wait();
          expect(
            await this.dCAManager.s_userJobs(
              this.signers[1].address,
              _mockJobId
            )
          ).to.be.equal(_depositAmount);
        });
        it("Should cancel job", async function () {
          expect(
            await this.dCAManager
              .connect(this.signers[1])
              .s_userJobs(this.signers[1].address, this._mockJobId)
          ).to.be.equal(this._depositAmount);

          await this.mocks.mockJobManager.mock.isValidId.returns(true);
          await this.mocks.mockJobManager.mock.cancel.returns(true);

          await expect(
            this.dCAManager.connect(this.signers[1]).cancelJob(this._mockJobId)
          ).to.not.be.reverted;

          expect(
            await this.dCAManager
              .connect(this.signers[1])
              .s_userJobs(this.signers[1].address, this._mockJobId)
          ).to.be.equal(0);
        });
        it("Should throw if cancellation attempted for invalid id", async function () {
          await this.mocks.mockJobManager.mock.isValidId.returns(false);
          await expect(
            this.dCAManager.cancelJob(0)
          ).to.be.revertedWithCustomError(
            this.dCAManager,
            `DCAManager__InvalidJobId`
          );
        });
        it("Should throw if cancellation attempted by non owner", async function () {
          await this.mocks.mockJobManager.mock.isValidId.returns(true);
          await expect(
            this.dCAManager.cancelJob(0)
          ).to.be.revertedWithCustomError(
            this.dCAManager,
            `DCAManager__InvalidJobCreator`
          );
        });
        describe("Events", function () {
          it("Should emit when job is cancelled", async function () {
            await this.mocks.mockJobManager.mock.isValidId.returns(true);
            await this.mocks.mockJobManager.mock.cancel.returns(true);

            await expect(
              this.dCAManager
                .connect(this.signers[1])
                .cancelJob(this._mockJobId)
            )
              .to.emit(this.dCAManager, `LogCancelJob`)
              .withArgs(this._mockJobId);
          });
        });

        // it("", async function () {});
      });
      describe("Events", function () {
        it("Should emit event when valid DCA job is created", async function () {
          const _mockJobId = 2;
          // set up mocks
          await this.mocks.mockUsdc.mock.balanceOf.returns(1000);
          await this.mocks.mockUsdc.mock.transferFrom.returns(true);
          await this.mocks.mockJobManager.mock.create.returns(_mockJobId);
          // set JobManager contract address to mock
          await this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(0, this.mocks.mockJobManager.address);
          await this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(2, this.mocks.mockTradeManager.address);
          const _depositAmount = 100;
          await expect(
            this.dCAManager
              .connect(this.signers[0])
              .createDCAJob(_depositAmount, _depositAmount / 10, [0, 0])
          )
            .to.emit(this.dCAManager, `LogCreateJob`)
            .withArgs(this.signers[0].address, _depositAmount);
        });
      });
    });
  });
};
