import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  // describe("Deployment", function () {});
  describe("Create", function () {
    it("Should revert if options param array doesn't have at least 1 element", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(this.signers[2].address, 100, [])
      ).to.be.revertedWithCustomError(
        this.jobManager,
        `DCAOptions__InvalidOptions`
      );
    });
    it("Should revert if owner is zero address", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(ethers.constants.AddressZero, 100, [0])
      ).to.be.revertedWithCustomError(
        this.jobManager,
        `JobManager__InvalidOwner`
      );
    });
    it("Should revert if amount is <= 0", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(this.signers[1].address, 0, [0])
      ).to.be.revertedWithCustomError(
        this.jobManager,
        `JobManager__InvalidAmount`
      );
    });
    it("Should create job if validation successful", async function () {
      const _investmentAmount = 100;
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(this.signers[1].address, _investmentAmount, [0])
      ).to.not.be.reverted;
    });
    describe("Events", function () {
      it("Should emit event during create", async function () {
        await expect(
          this.jobManager
            .connect(this.signers[0])
            .create(this.signers[2].address, 100, [0])
        ).to.emit(this.jobManager, `LogCreate`);
      });
    });
    describe("...after job1 created", function () {
      beforeEach(`...create job1`, async function () {
        this._amount = 1000;
        this._investmentAmount = 100;
        await this.jobManager
          .connect(this.signers[0])
          .create(this.signers[1].address, this._investmentAmount, [0]);
      });
      it("Should update _s_numActiveJobs var", async function () {
        expect(await this.jobManager._s_numActiveJobs()).to.be.equal(1);
      });
      it("Should have updated jobIds counter after create", async function () {
        expect(await this.jobManager.getCurrentId()).to.be.equal(1);
      });
      it("Should have updated s_jobs var after create", async function () {
        const _job = await this.jobManager.s_jobs(0);
        expect(_job.id).to.be.equal(0);
        expect(_job.owner).to.be.equal(this.signers[1].address);
        expect(_job.frequencyOptionId).to.be.equal(0);
        expect(_job.isActive).to.be.equal(true);
        expect(_job.startTime).to.be.equal(await time.latest());
        expect(_job.investmentAmount).to.be.equal(this._investmentAmount);
      });
      describe("Cancel", function () {
        it("Should revert if no active job exists", async function () {
          await expect(this.jobManager.cancel(5)).to.be.reverted;
        });
        it("Should not revert if validation succeeds", async function () {
          await expect(this.jobManager.cancel(0)).to.not.be.reverted;
          const _job = await this.jobManager.s_jobs(0);
          expect(_job.isActive).to.be.equal(false);
        });
        describe("Events", function () {
          it("Should emit event during cancel", async function () {
            await expect(this.jobManager.connect(this.signers[0]).cancel(0))
              .to.emit(this.jobManager, `LogCancelJob`)
              .withArgs(0);
          });
        });
        describe("...After job1 is cancelled", function () {
          beforeEach(`...cancel job1`, async function () {});
          // it("Should emit event during cancel", async function () {});
        });
      });
    });
  });
  // describe("Cancel existing DCA job", function () {
  //   it("Should revert if user has no active job", async function () {});
  //   it("Should delete the DCA job if validation successful", async function () {});
  //   describe("...After DCA job cancelled", function () {
  //     it("Should show state of user's funds and DCA job details", async function () {});
  //   });
  //   describe("Events", function () {
  //     it("Should emit event when DCA job is cancelled", async function () {});
  //   });
  // });
};
