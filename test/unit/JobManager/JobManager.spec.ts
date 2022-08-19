import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Deployment", function () {});
  describe("Create", function () {
    it("Should revert if options param array doesn't have at least 1 element", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(this.signers[2].address, 1000, 100, [])
      ).to.be.revertedWithCustomError(
        this.jobManager,
        `DCAOptions__InvalidOptions`
      );
    });
    it("Should revert if owner is zero address", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(ethers.constants.AddressZero, 1000, 100, [0])
      ).to.be.revertedWithCustomError(
        this.jobManager,
        `JobManager__InvalidOwner`
      );
    });
    it("Should revert if amount is <= 0", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(this.signers[1].address, 0, 100, [0])
      ).to.be.revertedWithCustomError(
        this.jobManager,
        `JobManager__InvalidAmount`
      );
    });
    it("Should create job if validation successful", async function () {
      const _amount = 1000;
      const _investmentAmount = 100;
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(this.signers[1].address, _amount, _investmentAmount, [0])
      ).to.not.be.reverted;
    });
    describe("...after job1 created", function () {
      beforeEach(`...create job1`, async function () {
        this._amount = 1000;
        this._investmentAmount = 100;
        await this.jobManager
          .connect(this.signers[0])
          .create(
            this.signers[1].address,
            this._amount,
            this._investmentAmount,
            [0]
          );
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
        expect(_job.initialBalance).to.be.equal(this._amount);
        expect(_job.investmentAmount).to.be.equal(this._investmentAmount);
      });
    });

    describe("Events", function () {
      it("Should emit event during create", async function () {
        await expect(
          this.jobManager
            .connect(this.signers[0])
            .create(this.signers[2].address, 1000, 100, [0])
        ).to.emit(this.jobManager, `LogCreate`);
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
