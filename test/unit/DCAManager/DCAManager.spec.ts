import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Mocks, Signers } from "../../shared/types";

export const DCAUnitTest = (): void => {
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
      // it("Should set other initialized defaults in storage", async function () {});
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
    describe("Creating a DCA Job", function () {
      it("Should revert if attempt to create a DCA job but core contract values are not set", async function () {
        await expect(this.dCAManager.connect(this.signers[0]).createDCAJob(100))
          .to.be.reverted;
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
            this.dCAManager.connect(this.signers[0]).createDCAJob(100, [1, 2])
          ).to.be.revertedWithCustomError(
            this.dCAManager,
            `DCAManager__InsufficientFunds`
          );
        });
        it("Should revert if user has funds but token transfer not approved first", async function () {
          await this.mocks.mockUsdc.mock.balanceOf.returns(1);
          await this.mocks.mockUsdc.mock.transferFrom.returns(false);
          await expect(
            this.dCAManager.connect(this.signers[0]).createDCAJob(100, [1, 2])
          ).to.be.revertedWithCustomError(
            this.dCAManager,
            `DCAManager__TransferError`
          );
        });
        // it("Should revert if invalid tokens are sent with request", async function () {});
        it("Should create DCA job if validation successful", async function () {
          const _mockJobId = 2;

          // set up mocks
          await this.mocks.mockUsdc.mock.balanceOf.returns(1000);
          await this.mocks.mockUsdc.mock.transferFrom.returns(true);
          await this.mocks.mockJobManager.mock.create.returns(_mockJobId);

          // set JobManager contract address to mock
          await this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(0, this.mocks.mockJobManager.address);

          // create DCA job
          const _depositAmount = 100;
          const tx = await this.dCAManager
            .connect(this.signers[0])
            .createDCAJob(_depositAmount, [0, 0]);
          await tx.wait();

          // expect saved depsoit amount to match expected
          expect(
            await this.dCAManager
              .connect(this.signers[0])
              .s_deposits(this.signers[0].address)
          ).to.be.equal(_depositAmount);

          // expect jobId added to s_userJobs
          const jobIds = await this.dCAManager
            .connect(this.signers[0])
            .getUserJobIds(this.signers[0].address);
          expect(jobIds).to.be.a("array");
          const jobIdsValues = jobIds.map((e: any) => e.toNumber());
          expect(jobIdsValues).to.be.an("array").that.includes(_mockJobId);
        });

        describe("...After 1st DCA job created from user1", function () {
          beforeEach(`...save 1st DCA job`, async function () {
            this._mockJobId = 2;

            // set up mocks
            await this.mocks.mockUsdc.mock.balanceOf.returns(1000);
            await this.mocks.mockUsdc.mock.transferFrom.returns(true);
            await this.mocks.mockJobManager.mock.create.returns(
              this._mockJobId
            );

            // set JobManager contract address to mock
            await this.dCAManager
              .connect(this.signers[0])
              .setContractAddress(0, this.mocks.mockJobManager.address);

            // create DCA job
            this._depositAmount = 100;
            const tx = await this.dCAManager
              .connect(this.signers[1])
              .createDCAJob(this._depositAmount, [0, 0]);
            await tx.wait();
          });
          it("Should add to existing deposit amount if 2nd job created", async function () {
            const _depositAmount = 200;
            const tx = await this.dCAManager
              .connect(this.signers[1])
              .createDCAJob(_depositAmount, [0, 0]);
            await tx.wait();

            expect(
              await this.dCAManager
                .connect(this.signers[1])
                .s_deposits(this.signers[1].address)
            ).to.be.equal(this._depositAmount + _depositAmount);
          });
          it("Should allow cancellation from user", async function () {
            // await this.mocks.mockJobManager.mock.isValidId.returns(false);
            // await this.mocks.mockJobManager.mock.cancel.returns(
            //   true
            // );
            // expect(await this.dCAManager.connect(this.signers[1]).cancelJob());
          });
          it.only("Should throw if cancellation attempted for invalid id", async function () {
            await this.mocks.mockJobManager.mock.isValidId.returns(false);
          });
          it("Should throw if cancellation attempted by non owner", async function () {});
          // it("", async function () {});
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
            const _depositAmount = 100;
            await expect(
              this.dCAManager
                .connect(this.signers[0])
                .createDCAJob(_depositAmount, [0, 0])
            )
              .to.emit(this.dCAManager, `LogCreateJob`)
              .withArgs(this.signers[0].address, _depositAmount);
          });
        });
      });
    });
  });
  describe("Events", function () {
    it("Should emit even when user creates a DCA job", async function () {});
    it("Should set the right owner", async function () {});
    it("Should set the right owner", async function () {});
  });
};
